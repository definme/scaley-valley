const hre = require("hardhat");
require('dotenv').config();

const main = async () => {
    const contract = await hre.ethers.getContractAt("OptimisticLight", process.env.TOKEN_ADDRESS_L1);
    let amount = hre.ethers.utils.parseEther("500");
    const tx = await contract.buy(amount, {
        value: await contract.getRequiredNativeCurrencyToBuy(amount)
    });
    console.log(tx.hash);
};

main().catch(console.error);
