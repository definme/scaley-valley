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
    const balance = await contract.balanceOf("0xE6CE5994C668bA5e73de9a149bA81D6f4BCF37ad"); // some address
    console.log(balance.toString());
}

main().catch(console.error);
