const hre = require("hardhat");
require('dotenv').config();

const main = async () => {
    const factory = await hre.ethers.getContractFactory("OptimisticLight");
    const contract = await factory.deploy();
    console.log(contract.address);
};

main().catch(console.error);
