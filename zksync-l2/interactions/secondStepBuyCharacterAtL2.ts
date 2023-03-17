import * as ethers from "ethers";
import {config} from "dotenv";
import * as resourceAbi from "./ZksyncForest.json";
import * as tradeAbi from "./TradeContract.json";

config();
/*
This is executed on ZkSync L2 network
 */
const main = async function () {
    const provider = new ethers.providers.JsonRpcProvider(process.env.ZKSYNC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const resource = new ethers.Contract(process.env.TOKEN_ADDRESS, resourceAbi, signer);
    const trade = new ethers.Contract(process.env.TRADE_ADDRESS, tradeAbi, signer);

    const tradedKind = await trade.tradedKind();
    const price = await trade.getPrice(tradedKind);
    const tx = await resource.transfer(trade.address, price);
    await tx.wait();
    console.log(`Transferred to ${process.env.TRADE_ADDRESS} ${price} in tx ${tx.hash}`);
}

main().catch(console.error);
