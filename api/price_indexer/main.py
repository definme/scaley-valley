import json
import time
from typing import List, Dict

from web3 import Web3

from scaley_valley.models import Resource

BUY_AMOUNT = Web3.to_wei("1", "ether")


class PriceIndexer:
    resource_token_abi: List[Dict]
    trade_contract_abi: List[Dict]
    indexer_interval: int

    def __init__(self, indexer_interval: int):
        self.indexer_interval = indexer_interval
        with open("abi/ResourceToken.abi.json", "r") as abi:
            self.resource_token_abi = json.load(abi)

    def start(self):
        while True:
            self.__cycle_body()
            print(f"Sleep for {self.indexer_interval} sec")
            time.sleep(self.indexer_interval)

    def __cycle_body(self):
        for resource in Resource.objects.all():
            chain = resource.buy_resource_chain
            print(f"Fetching price in ETH of resource {resource.name} on chain {chain.name}")
            w3 = Web3(Web3.HTTPProvider(chain.rpc_url))
            resource_token = w3.eth.contract(address=resource.buyable_resource_token_address, abi=self.resource_token_abi)
            resource.price = resource_token.functions.getRequiredNativeCurrencyToBuy(BUY_AMOUNT).call()
            print(f"Price is {resource.price}")
            resource.save()
