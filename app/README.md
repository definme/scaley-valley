# Scaley-Valley DApp

### DApp is currently configured to work with multiple networks. All configs for networks should be in `/src/network.json` as follows(at least 2 networks - l1 and l2):

```
{
  "5": {
    "name": "Goerli",
    "image": "image_uri",
    "params": {
      "chainId": "0x5",
      "chainName": "Goerli",
      "nativeCurrency": {
        "name": "ETH",
        "symbol": "ETH",
        "decimals": 18
      },
      "rpcUrls": ["https://goerli.blockpi.network/v1/rpc/public"],
      "blockExplorerUrls": ["https://goerli.etherscan.io/"]
    },
    "contracts": {
      "erc20resource": "contract_address",
      "erc721": "contract_address",
      "collection": "contract_address"
    }
  },
   "420": {
    "name": "Optimism",
    "image": "image_uri",
    "params": {
      "chainId": "0x1A4",
      "chainName": "Optimism Goerli",
      "nativeCurrency": {
        "name": "ETH",
        "symbol": "ETH",
        "decimals": 18
      },
      "rpcUrls": ["https://goerli.optimism.io"],
      "blockExplorerUrls": ["https://goerli-explorer.optimism.io/"]
    },
    "contracts": {
      "erc20resource": "contract_address",
      "trade": "contract_address",
      "erc721": "contract_address",
      "bridge": "contract_address"
    }
  },
}
```

#### Scaley-Valley DApp working with four contracts: `Collection`(characters), `ERC20Token`(resource), `ERC721`(collateral) and `Trade`. Addresses of contracts should be located in `/src/network.json` as shown above. Abis of contracts should be located in `/src/abis` folder.

---

### Project must contain following environment variables

```txt
REACT_APP_CHANNEL_PK='push_channel_private_key'
```

## Development server

Run `yarn` for install packages

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Production server

In production project starting in docker container
`docker-compose` file from which the project image is run is in [main repository](https://github.com/definme/scaley-valley)