# ScaleyValley

## Game-focused marketplace with deep multi-chain integration and cross-chain bridging to access game content.

## About

We thought about how L2 networks could be used in the growing GameFi industry. And what if the networks themselves can become part of the game process?

At the Scaling Ethereum 2023 hackathon,  we are going to implement a solution that enables the purchase and bridging of NFTs from the main Ethereum network to the L2 network and back (using the technologies that are presented in the description of the hackathon).

Users would need to pay with ERC20 tokens to purchase a character in the marketplace, and transactions are processed in one of the Layer2 networks. Moreover, depending on the desired character, the user must use the appropriate network. For ease of perception, we call ERC 20 tokens - resources.

|    NFT Type   |     Initial price     |   Token Name  |            Chain            |
| ------------- | --------------------- | ------------- | --------------------------- |
|   Aquatique   |           100         |     WATER     | Gnosis testnet chain Chiado |
|     Druid     |           100         |     WOOD      |       Zksync testnet        |
|  Illuminator  |           100         |     OPTIC     |  Optimism testnet Goerli    |
|    Hermes     |           100         |      AIR      |   Polygon zkEVM testnet     |

The key idea of using L2 chains is to reduce  NFT transaction costs. Players purchase  characters on  gas-cheap L2 networks and receive NFTs on the Ethereum chain.

In the marketplace, we give  users the opportunity to exchange resources into  stablecoins on the Ethereum network. To do this, we use bridges from L2 to L1 networks:

Gnosis > Using ANB > Goerli

ZkSync > zkSynk Rollup > Goerli

Optimism > Optimistic Rollup > Goerli

zkPolygon > Hyperlane > Goerli

NFT characters can be moved across different networks (for this, we use Hyperlane’s bridge ). Players will be motivated to move tokens from one network to another to get access to different game content, such as valleys or perk boosters:

|  Valley Name  |     Network     |                             Feature                             |
| ------------- | --------------- | --------------------------------------------------------------- |
|  EtherValley  |      Goerli     |      20% boost for NFT's level and corresponding area(valley)   |
|  PolyValley   |    zkPolygon    |        20% agility boost and corresponding area(valley)         |
|  OptiValley   | Optimism Goerli | 20% boost for leveling intellect and corresponding area(valley) |

[Documentation](https://scaleyvalley.gitbook.io/main/)

## Used technology stack

- To develop the backend, we use a well-known Python library - Django and Django Rest Framework for rapid api development.
- To develop, test and deploy contracts, we use Solidity (contracts), js and ts (testing and deployment). Also, we will use project SDKs to develop our solution.
- We use ReactJS together with web3 libraries (ether, web3.js) to build the dapp’s user interface and ensure seamless interaction between users and the blockchain.  
- Also, one of the most important elements of the project that we are implementing workers that will index the network and send transactions. These workers will be written in python. 

The goal of scaley-valley is to offer users access to cross-chain game content, have a seamless gaming experience, and transfer tokens with lower fees.

![tg_image_423075292](https://user-images.githubusercontent.com/25884190/225343648-69e9fde2-60ea-4523-80b8-ebac27bcb780.jpeg)

![tg_image_1028392436](https://user-images.githubusercontent.com/25884190/225343746-e8d17115-5fe2-434c-959a-03a14618c6da.jpeg)
