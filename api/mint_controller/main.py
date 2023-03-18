import json
import time

from eth_account.account import Account, LocalAccount
from eth_typing import ChecksumAddress
from web3 import Web3
from web3.contract import Contract

from scaley_valley.models import NFTMintRequest, StatusChoices, Chain, Character, User, Valley


class MintController:
    indexer_interval: int
    account: LocalAccount
    chain: Chain
    contract: Contract
    w3: Web3
    valley: Valley

    def __init__(self, indexer_interval: int, private_key: str, nft_contract_address: ChecksumAddress, chain_id: int):
        self.indexer_interval = indexer_interval
        self.account = Account.from_key(private_key)
        self.chain = Chain.objects.get(chain_id=chain_id)
        self.w3 = Web3(Web3.HTTPProvider(self.chain.rpc_url))
        with open("abi/ScaleyValleyCollection.abi.json") as abi:
            self.contract = self.w3.eth.contract(address=nft_contract_address, abi=json.load(abi))
        self.valley = Valley.objects.get(chain=self.chain)

    def start(self):
        while True:
            self.__cycle_body()
            time.sleep(self.indexer_interval)

    def __cycle_body(self):
        for mint_request in NFTMintRequest.objects.filter(status=StatusChoices.NEW):
            print(f"Performing mint request of {mint_request}")
            kind = int(mint_request.kind.contract_kind_id)
            to = mint_request.recipient
            unsigned_tx = self.contract.functions.mintKind(to, kind).build_transaction({
                "from": self.account.address,
                "chainId": self.w3.eth.chain_id,
                "nonce": self.w3.eth.get_transaction_count(self.account.address)
            })
            signed_tx = self.account.sign_transaction(unsigned_tx)["rawTransaction"]
            mint_tx_hash = self.w3.eth.send_raw_transaction(signed_tx)
            receipt = self.w3.eth.wait_for_transaction_receipt(mint_tx_hash)
            if receipt.status == 0:
                mint_request.status = StatusChoices.FAIL
                print(f"Mint failed at {mint_tx_hash}")
            else:
                nft_id = int(receipt.logs[0].topics[3].hex(), 16)
                print(f"Mint success at {mint_tx_hash.hex()} minted NFT id {nft_id}")
                mint_request.status = StatusChoices.SUCCESS
                mint_request.mint_tx_hash = mint_tx_hash.hex()
                mint_request.nft_id = nft_id
                owner, created = User.objects.get_or_create(
                    address=mint_request.recipient
                )
                if created:
                    print(f"Created user with address {owner.address}")
                Character.objects.create(kind=mint_request.kind,
                                         contract_token_id=nft_id,
                                         owner=owner,
                                         price=mint_request.price,
                                         valley=self.valley
                                         )
                print(f"Created character on valley {self.valley.name}")
            mint_request.save()
