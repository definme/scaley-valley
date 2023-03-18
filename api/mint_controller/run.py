import os
import sys

import django
import web3

django_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(django_dir)
sys.path.append(django_dir)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "api.settings")
django.setup()

INDEXER_INTERVAL = int(os.environ["INDEXER_INTERVAL"])
MINTER_PRIVATE_KEY = str(os.environ["MINTER_PRIVATE_KEY"])
NFT_CONTRACT_ADDRESS = web3.Web3.to_checksum_address(str(os.environ["NFT_CONTRACT_ADDRESS"]))
MAIN_NFT_CHAIN_ID = int(os.environ["MAIN_NFT_CHAIN_ID"])


def main():
    from mint_controller.main import MintController
    indexer = MintController(INDEXER_INTERVAL, MINTER_PRIVATE_KEY, NFT_CONTRACT_ADDRESS, MAIN_NFT_CHAIN_ID)
    indexer.start()


if __name__ == "__main__":
    main()
