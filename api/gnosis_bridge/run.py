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
GNOSIS_BRIDGE_PRIVATE_KEY = str(os.environ["GNOSIS_BRIDGE_PRIVATE_KEY"])
GNOSIS_CHAIN_ID = int(os.environ["GNOSIS_CHAIN_ID"])
ETHEREUM_CHAIN_ID = int(os.environ["ETHEREUM_CHAIN_ID"])


def main():
    from gnosis_bridge.main import GnosisBridge
    bridge = GnosisBridge(INDEXER_INTERVAL, GNOSIS_BRIDGE_PRIVATE_KEY, ETHEREUM_CHAIN_ID, GNOSIS_CHAIN_ID,)
    bridge.start()


if __name__ == "__main__":
    main()
