import json
import time
from typing import List, Dict

from web3 import Web3

from scaley_valley.models import Valley, Character


class ValleysIndexer:
    resource_token_abi: List[Dict]
    trade_contract_abi: List[Dict]
    indexer_interval: int

    def __init__(self, indexer_interval: int):
        self.indexer_interval = indexer_interval
        with open("abi/ScaleyValleyCollection.abi.json", "r") as abi:
            self.collection_abi = json.load(abi)

    def start(self):
        while True:
            self.__cycle_body()
            print(f"Sleep for {self.indexer_interval} sec")
            time.sleep(self.indexer_interval)

    def __cycle_body(self):
        for character in Character.objects.all():
            token_id = character.contract_token_id
            valley = character.valley
            owner = character.owner.address
            actual_valley = self.find_actual_chain(token_id=token_id, owner=owner)
            if actual_valley and valley != actual_valley:
                print(f'Change valley from {valley.name} to '
                      f'{actual_valley.name} on token with id {token_id}(owner {owner})')
                character.valley = actual_valley
                character.save()

    def check_ownership(self, valley, token_id, abi):
        w3 = Web3(Web3.HTTPProvider(valley.chain.rpc_url))
        collection_contract = w3.eth.contract(address=valley.collection_address, abi=abi)
        try:
            owner = collection_contract.functions.ownerOf(int(token_id)).call()
        except Exception as e:
            return
        return owner

    def find_actual_chain(self, token_id, owner):
        for valley in Valley.objects.all():
            token_owner = self.check_ownership(valley=valley, token_id=token_id, abi=self.collection_abi)
            if token_owner == owner:
                return valley
