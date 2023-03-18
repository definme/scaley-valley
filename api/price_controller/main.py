import json
import time
from typing import Dict, List

from eth_account.account import Account, LocalAccount
from web3 import Web3

from scaley_valley.models import NFTMintRequest, StatusChoices, Resource


class PriceController:
    indexer_interval: int
    account: LocalAccount
    trade_contract_abi: List[Dict]

    def __init__(self, indexer_interval: int, private_key: str):
        self.indexer_interval = indexer_interval
        self.account = Account.from_key(private_key)
        with open("abi/TradeContract.abi.json") as abi:
            self.trade_contract_abi = json.load(abi)

    def start(self):
        while True:
            self.__cycle_body()
            time.sleep(self.indexer_interval)

    def __cycle_body(self):
        for mint_request in NFTMintRequest.objects.filter(status=StatusChoices.SUCCESS):
            print(f"Applying minting supply change caused by mint at "
                  f"{mint_request.mint_tx_hash} of kind {mint_request.kind.name}")
            kind = int(mint_request.kind.contract_kind_id)
            amount = 1  # in the future: pack price change in 10, 100 batches of mint
            for resource in Resource.objects.all():
                print(f"Apply minting at {resource.chain.name}")
                w3 = Web3(Web3.HTTPProvider(resource.chain.rpc_url))
                contract = w3.eth.contract(address=resource.trade_contract_address, abi=self.trade_contract_abi)
                tx_hash = contract.functions.calculatePrices(kind, amount).transact({
                    "from": self.account.address,
                    "chainId": w3.eth.chain_id,
                    "nonce": w3.eth.get_transaction_count(self.account.address)
                })
                receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
                if receipt.status == 0:
                    mint_request.status = StatusChoices.FAIL
                    print(f"Applying mint failed at {tx_hash}")
                else:
                    print(f"Applying mint success at {tx_hash.hex()}")
                    mint_request.status = StatusChoices.APPLIED
                mint_request.save()
