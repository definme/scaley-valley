import os
import sys

import django

django_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(django_dir)
sys.path.append(django_dir)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "api.settings")
django.setup()

INDEXER_INTERVAL = int(os.environ["INDEXER_INTERVAL"])


def main():
    from price_indexer.main import PriceIndexer
    indexer = PriceIndexer(INDEXER_INTERVAL)
    indexer.start()


if __name__ == "__main__":
    main()
