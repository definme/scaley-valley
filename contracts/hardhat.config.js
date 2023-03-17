require('@nomicfoundation/hardhat-toolbox')
require('hardhat-deploy')
require('hardhat-deploy-ethers')
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const accounts = {
  mnemonic: `${process.env.MNEMONIC}`,
}

module.exports = {
  solidity: '0.8.18',
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    localhost: {
      url: 'http://localhost:8545/',
      accounts,
      live: false,
      saveDeployments: true,
      tags: ['local'],
    },
    hardhat: {
      accounts,
    },
    goerli: {
      chainId: 5,
      url: 'https://endpoints.omniatech.io/v1/eth/goerli/public',
      accounts,
      live: true,
      saveDeployments: true,
    },
  },
}
