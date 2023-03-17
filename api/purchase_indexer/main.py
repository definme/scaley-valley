import json
import time
from typing import List, Dict

from web3 import Web3

from scaley_valley.models import Resource, NFTMintRequest, StatusChoices, Kind


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
            chain = resource.chain
            w3 = Web3(Web3.HTTPProvider(chain.rpc_url))
            resource_contract = w3.eth.contract(address=resource.resource_token_address, abi=self.resource_token_abi)
            trade_contract = w3.eth.contract(address=resource.trade_contract_address, abi=self.trade_contract_abi)
            start_block = chain.last_indexed_block
            last_block_in_chain = w3.eth.get_block("latest")["number"]
            to_block = min(start_block + chain.indexed_blocks_interval, last_block_in_chain)
            print(f"Taking events from {start_block} to {to_block} where argument to={resource.trade_contract_address}")
            argument_filters = {
                "to": resource.trade_contract_address
            }
            events = resource_contract.events.Transfer.create_filter(
                fromBlock=start_block,
                toBlock=to_block,
                argument_filters=argument_filters
            ).get_all_entries()
            traded_kind = Kind.objects.get(contract_kind_id=trade_contract.functions.tradedKind().call())
            if not events:
                print("No events found. Skip blocks range")
                return
            for event in events:
                tx_hash = event.transactionHash.hex()
                if not NFTMintRequest.objects.filter(purchase_tx_hash=tx_hash).first():
                    mint_request = NFTMintRequest.objects.create(
                        kind=traded_kind,
                        recipient=event.args["from"],
                        price=event.args["value"],
                        purchase_tx_hash=tx_hash,
                        status=StatusChoices.NEW
                    )
                    print(f"Created Mint request {mint_request}")
            resource.chain.last_indexed_block = to_block
            resource.chain.save()
