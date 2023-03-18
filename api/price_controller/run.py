import os
import sys

import django

django_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(django_dir)
sys.path.append(django_dir)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "api.settings")
django.setup()

INDEXER_INTERVAL = int(os.environ["INDEXER_INTERVAL"])
PRICE_MANAGER_PRIVATE_KEY = str(os.environ["PRICE_MANAGER_PRIVATE_KEY"])


def main():
    from price_controller.main import PriceController
    indexer = PriceController(INDEXER_INTERVAL, PRICE_MANAGER_PRIVATE_KEY)
    indexer.start()


if __name__ == "__main__":
    main()
