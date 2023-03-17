require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",

  networks: {
    ethTestnet: {
      url: process.env.ALCHEMY_URL_L1,
      accounts: [process.env.PRIVATE_KEY]
    },
    optimismTestnet: {
      url: process.env.ALCHEMY_URL_L2,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
