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

## Cotracts addresses
|      Cintract name     |     Network     |  Address  |
| ---------------------- | --------------- | --------- |
| ScaleyWalleyCollection |     Goerli      | [0x7a1Bf79FeA06Da1C7bb03Bbc729F1360ACa2080f](https://goerli.etherscan.io/address/0x7a1Bf79FeA06Da1C7bb03Bbc729F1360ACa2080f)|
| Hyperlane Warp Router  |     Goerli      | [0x04F02C3D9C9190F0B66120e2945AF3740dBe485B](https://goerli.etherscan.io/address/0x04F02C3D9C9190F0B66120e2945AF3740dBe485B)|
| Hyperlane Warp Router  | Optimism Goerli | [0x3De4Af596Ff7c0946Cf611f6c440Ec7b7BB24c46](https://goerli-optimism.etherscan.io/address/0x3De4Af596Ff7c0946Cf611f6c440Ec7b7BB24c46)|
| Hyperlane Warp Router  | Polygon Mumbai  | [0xbDC8B9860F0B78e342C1C6c4b3870b8bAf2d75aA](https://mumbai.polygonscan.com/address/0xbDC8B9860F0B78e342C1C6c4b3870b8bAf2d75aA)|

## Bridge example

|      Description     |     Tx     |
| ---------------------- | --------------- |
|User with address 0x5fCb8f7149E8aD03544157C90E6f81b26933d3a2 call setApproveallForAll() method for Warp Router| https://goerli.etherscan.io/tx/0xe59a812fcc6c72f7a19d1b303c5d64c62f4a5b71afaea84e3ec5ea1abff687ff |
|Deployer mint NFT(id 4) to user with address 0x5fCb8f7149E8aD03544157C90E6f81b26933d3a2| https://goerli.etherscan.io/tx/0xdfe2d552748888b565aac82a137e5bbd83bc986640f0cc986608c3801b2dbffa |
|User send token to mumbai chain(sends token and some ETH to HypERC721Collateral on the goerli use method transferRemote())| https://goerli.etherscan.io/tx/0x64b04eef8ee6b32f6bc117522201fbf7c9b2af44413675f0556e37b0f1791117 |
|User get token on the polygon(mumbai) network| https://mumbai.polygonscan.com/tx/0x85bed4ef5e6c7bd990ad1dadc93dc488e0bebc211e8195bf8113d27a9894dd5b |
|User send token to optimism goerli chain(sends token and some ETH to HypERC721 on the mumbai use method transferRemote())| https://mumbai.polygonscan.com/tx/0x4758a1831e816a1cdc03410bd32bee3cd361619eb2a06c4dd83f332ebe3e870e |
|User get token on the optimism goerli network| https://goerli-optimism.etherscan.io/tx/0x5fe120f13a4b1810ae49c74bbe141ad62bfa13d20129e287556ea72e1757a21c |
|User send token to goerli chain(sends token and some ETH to HypERC721 on the optimism goerli use method transferRemote())| https://goerli-optimism.etherscan.io/tx/0x3c9a70f4b61d245076346a4910d5472d71833f3c580c5885405d443459d72138 |
|User get token on the goerli network| https://goerli.etherscan.io/tx/0x3a1ed82bbe480ebb1c8788a71b3a84d322ece5b80801ca9c7a94456f450bea6d |