const hre = require("hardhat");
require('dotenv').config();

const main = async () => {
    const factory = await hre.ethers.getContractFactory("TradeContract");
    const resourceAddress = process.env.TOKEN_ADDRESS_L2;
    const initialPrice = hre.ethers.utils.parseEther("100");
    const mintTokenDelta = hre.ethers.utils.parseEther("1");
    const kindToBeTraded = 0x0002;
    const contract = await factory.deploy(resourceAddress, initialPrice, mintTokenDelta, kindToBeTraded);
    console.log(contract.address);
};

main().catch(console.error);
