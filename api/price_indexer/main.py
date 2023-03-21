import json
import time
from typing import List, Dict

from web3 import Web3

from scaley_valley.models import Resource, Kind

BUY_AMOUNT = Web3.to_wei("1", "ether")


class PriceIndexer:
    resource_token_abi: List[Dict]
    trade_contract_abi: List[Dict]
    indexer_interval: int

    def __init__(self, indexer_interval: int):
        self.indexer_interval = indexer_interval
        with open("abi/ResourceToken.abi.json", "r") as resource_abi:
            self.resource_token_abi = json.load(resource_abi)
        with open("abi/TradeContract.abi.json", "r") as contract_abi:
            self.trade_contract_abi = json.load(contract_abi)

    def start(self):
        while True:
            self.__cycle_body()
            print(f"Sleep for {self.indexer_interval} sec")
            time.sleep(self.indexer_interval)

    def __cycle_body(self):
        # resources prices
        for resource in Resource.objects.all():
            print(f"Fetching price in ETH of resource {resource.name} on chain {resource.buy_resource_chain.name}")
            w3 = Web3(Web3.HTTPProvider(resource.buy_resource_chain.rpc_url))
            resource_token = w3.eth.contract(address=resource.buyable_resource_token_address,
                                             abi=self.resource_token_abi)
            resource.price = resource_token.functions.price().call()
            print(f"Price is {resource.price}")
            resource.save()
        # characters prices
        for kind in Kind.objects.all():
            print(f"Fetching price in resource {kind.payment_resource.name} of {kind.name} on chain {kind.payment_resource.spend_resource_chain.name}")
            w3 = Web3(Web3.HTTPProvider(kind.payment_resource.spend_resource_chain.rpc_url))
            trade_contract = w3.eth.contract(address=kind.payment_resource.trade_contract_address,
                                             abi=self.trade_contract_abi)
            kind.price = trade_contract.functions.getPrice(int(kind.contract_kind_id)).call()
            print(f"Price is {kind.price}")
            kind.save()
