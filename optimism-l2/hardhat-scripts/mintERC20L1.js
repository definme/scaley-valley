const hre = require("hardhat");
require('dotenv').config();

const main = async () => {
    const minter = (await hre.ethers.getSigners())[0];
    const contract = await hre.ethers.getContractAt("OptimisticLight", process.env.TOKEN_ADDRESS_L1);
    const tx = await contract.mint(await minter.getAddress(), hre.ethers.utils.parseEther("100000"));
    console.log(tx.hash);
};

main().catch(console.error);
