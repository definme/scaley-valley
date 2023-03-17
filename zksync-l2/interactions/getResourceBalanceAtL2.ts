import {providers, Contract} from "ethers";
import {config} from "dotenv";
import * as abi from "./ZksyncForest.json"

config();

/*
This is executed on ZkSync testnet
 */
const main = async function () {
    const zkSyncProvider = new providers.JsonRpcProvider(process.env.ZKSYNC_URL as string);
    const contract = new Contract(process.env.TOKEN_ADDRESS, abi, zkSyncProvider);
    const balance = await contract.balanceOf("0x22E837C1E3380e8f38758C8490d9865433bF3ad5"); // some address
    console.log(balance.toString());
}

main().catch(console.error);
