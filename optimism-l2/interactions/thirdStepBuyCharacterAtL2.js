const hre = require("hardhat");
require('dotenv').config();

/*
This is executed on Optimism network
 */
const main = async () => {
    const trade = await hre.ethers.getContractAt("TradeContract", process.env.TRADE_ADDRESS);
    const resource = await hre.ethers.getContractAt("OptimisticLight", process.env.TOKEN_ADDRESS_L2);

    const kind = await trade.tradedKind();
    const price = await trade.getPrice(kind);
    const tx = await resource.transfer(trade.address, price);
    console.log(tx.hash);
};

main().catch(console.error);
