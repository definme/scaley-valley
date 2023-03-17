import {Wallet, Provider, Contract} from "zksync-web3";
import * as ethers from "ethers";
import {config} from "dotenv";
import {abi} from "../artifacts-zk/contracts/ZksyncForest.sol/ZksyncForest.json"

config();

const main = async function () {
    const zkSyncProvider = new Provider(process.env.ZKSYNC_URL as string);
    const ethereumProvider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL as string);
    const wallet = new Wallet(process.env.PRIVATE_KEY, zkSyncProvider, ethereumProvider);
    const contract = new Contract(process.env.TOKEN_ADDRESS, abi, wallet);
    const balance = await contract.balanceOf(await wallet.getAddress());
    console.log(balance.toString());
}

main().catch(console.error);
