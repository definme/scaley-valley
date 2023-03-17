const hre = require("hardhat");
const {BigNumber} = require("ethers");
require('dotenv').config();

const main = async () => {
    const factory = await hre.ethers.getContractFactory("OptimisticLight");
    const contract = await factory.deploy(BigNumber.from(1000000));
    console.log(contract.address);
};

main().catch(console.error);
