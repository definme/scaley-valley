import json
import time
from typing import List, Dict

from web3 import Web3

from scaley_valley.models import Resource, NFTMintRequest, StatusChoices, Kind
from web3._utils.events import get_event_data


class Indexer:
    resource_token_abi: List[Dict]
    trade_contract_abi: List[Dict]
    indexer_interval: int

    def __init__(self, indexer_interval: int):
        with open("abi/ResourceToken.abi.json", "r") as abi:
            self.resource_token_abi = json.load(abi)
        with open("abi/TradeContract.abi.json", "r") as abi:
            self.trade_contract_abi = json.load(abi)
        self.indexer_interval = indexer_interval

    def start(self):
        while True:
            self.__cycle_body()
            print(f"Sleep for {self.indexer_interval} sec")
            time.sleep(self.indexer_interval)

    def __cycle_body(self):
        for resource in Resource.objects.all():
            print(f"Fetching events on resource {resource.name} on chain {resource.chain.name}")
            chain = resource.chain
            w3 = Web3(Web3.HTTPProvider(chain.rpc_url))
            resource_token = w3.eth.contract(address=resource.resource_token_address, abi=self.resource_token_abi)
            trade_contract = w3.eth.contract(address=resource.trade_contract_address, abi=self.trade_contract_abi)
            start_block = chain.last_indexed_block
            last_block_in_chain = w3.eth.get_block("latest")["number"]
            to_block = int(min(start_block + chain.indexed_blocks_interval, last_block_in_chain))
            print(f"Taking events from {start_block} to {to_block} where argument to={resource.trade_contract_address}")
            traded_kind = Kind.objects.get(contract_kind_id=trade_contract.functions.tradedKind().call())
            events = w3.eth.get_logs({
                "address": resource_token.address,
                "fromBlock": start_block,
                "toBlock": to_block
            })
            if not events:
                print("No events found. Skip blocks range")
            else:
                print(f"Found {len(events)} events")

            for index, event in enumerate(events):
                price = int(bytes(event["data"]).hex(), base=16)
                topics = event["topics"]
                if len(topics) != 3:
                    print(f"Event #{index} skipped: bad topics length {len(topics)}")
                transfer_from = w3.to_checksum_address(hex(int(topics[1].hex(), base=16)))
                transfer_to = w3.to_checksum_address(hex(int(topics[2].hex(), base=16)))
                if transfer_to != w3.to_checksum_address(trade_contract.address):
                    print(f"Event #{index} skipped: recipient is not {trade_contract.address}")
                    continue
                tx_hash = event["transactionHash"].hex()
                if NFTMintRequest.objects.filter(purchase_tx_hash=tx_hash).first():
                    print(f"Event #{index} skipped: NFTMintRequest with purchase tx hash {tx_hash} already exists")
                    continue
                if not trade_contract.functions.isTradeValid(resource_token.address, price,
                                                             int(traded_kind.contract_kind_id)):
                    print(f"Event #{index} skipped: contract says trade of {traded_kind}"
                          f" with {price} of token {resource_token.address} is invalid")
                    continue
                mint_request = NFTMintRequest.objects.create(
                    kind=traded_kind,
                    recipient=transfer_from,
                    price=price,
                    purchase_tx_hash=tx_hash,
                    status=StatusChoices.NEW
                )
                print(f"Created Mint request {mint_request}")
            resource.chain.last_indexed_block = to_block
            resource.chain.save()
