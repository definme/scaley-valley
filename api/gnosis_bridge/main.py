import json
import time

from eth_account.account import Account, LocalAccount
from web3 import Web3
from web3.contract import Contract

from scaley_valley.models import Chain, Resource, GnosisBridgeProcess, GnosisStatusChoices


class GnosisBridge:
    indexer_interval: int
    account: LocalAccount
    l1_w3: Web3
    l2_w3: Web3
    resource: Resource
    l2_token_contract: Contract
    l1_bridge_contract: Contract

    def __init__(self, indexer_interval: int, private_key: str, chain_id_l1: int, chain_id_l2: int):
        self.indexer_interval = indexer_interval
        self.account = Account.from_key(private_key)
        chain_l1 = Chain.objects.get(chain_id=chain_id_l1)
        self.l1_w3 = Web3(Web3.HTTPProvider(chain_l1.rpc_url))
        chain_l2 = Chain.objects.get(chain_id=chain_id_l2)
        self.l2_w3 = Web3(Web3.HTTPProvider(chain_l2.rpc_url))
        self.resource = Resource.objects.get(buy_resource_chain__chain_id=chain_id_l1,
                                             spend_resource_chain__chain_id=chain_id_l2)
        with open("abi/ResourceToken.abi.json") as abi:
            self.l2_token_contract = self.l2_w3.eth.contract(
                address=self.l2_w3.to_checksum_address(self.resource.spendable_resource_token_address),
                abi=json.load(abi)
            )
        with open("abi/GnosisBridgeL1.abi.json") as abi:
            self.l1_bridge_contract = self.l1_w3.eth.contract(
                address=self.l1_w3.to_checksum_address(self.resource.buyable_resource_token_address),
                abi=json.load(abi)
            )

    def start(self):
        while True:
            self.__cycle_body()
            time.sleep(self.indexer_interval)

    def __cycle_body(self):
        l1_price = self.l1_bridge_contract.functions.price().call()
        l2_price = self.l2_token_contract.functions.price().call()
        if l1_price != l2_price:
            print(f"Bad bridge config. All bridge processes will be suspended")
            print(f"L1 price: {l1_price} meanwhile L2 price {l2_price}")
            return
        for bridge_process in GnosisBridgeProcess.objects.filter(status=GnosisStatusChoices.NEW):
            print(f"Taking in bridge process initiated in {bridge_process.purchase_tx_hash}")
            bridge_process.status = GnosisStatusChoices.PROCESS
            bridge_process.save()
            try:
                l1_transaction = self.l1_w3.eth.get_transaction(bridge_process.purchase_tx_hash)
            except Exception as e:
                print("Tx not found on L1. Mark bridge process as failed")
                bridge_process.status = GnosisStatusChoices.FAIL
                return
            value = l1_transaction["value"]
            to = l1_transaction["from"]
            price = self.l2_token_contract.functions.price().call()
            to_be_minted = value * price
            unsigned_tx = self.l2_token_contract.functions.mint(to, to_be_minted).build_transaction({
                "nonce": self.l2_w3.eth.get_transaction_count(self.account.address),
                "chainId": self.l2_w3.eth.chain_id,
                "from": self.account.address,
            })
            print(f"Bridging {value} from L1 ethereum to {to_be_minted} tokens on L2 gnosis")
            signed_tx = self.account.sign_transaction(unsigned_tx)
            tx_hash = self.l2_w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            print(f"On L2 tx is sent: {tx_hash.hex()}")
            receipt = self.l2_w3.eth.wait_for_transaction_receipt(tx_hash)
            print(f"On L2 tx is confirmed: {tx_hash.hex()}")
            bridge_process.bridge_l1_tx_hash = tx_hash.hex()
            if receipt.status == 0:
                print(f"Bridge failed")
                bridge_process.status = GnosisStatusChoices.FAIL
            else:
                print(f"Bridge success")
                bridge_process.status = GnosisStatusChoices.SUCCESS
            bridge_process.save()

