const hre = require("hardhat");
require('dotenv').config();

/*
This is executed on L1 Ethereum chain
 */
const main = async () => {
    const contract = await hre.ethers.getContractAt("OptimisticLight", process.env.TOKEN_ADDRESS_L1);
    let amount = hre.ethers.utils.parseEther("500");
    let value = await contract.getRequiredNativeCurrencyToBuy(amount);
    const tx = await contract.buy(amount, {
        value,
    });
    console.log(tx.hash);
};

main().catch(console.error);
