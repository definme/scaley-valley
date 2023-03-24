import {config as envs} from "dotenv"
import axios from "axios";
import {ContractTransactionResponse, ethers} from "ethers";
import * as fs from "fs";
import {NftMintRequest, Kind} from "./types";

envs();

const readUrl = process.env.APPLY_READ_URL as string;
const writeUrl = process.env.APPLY_WRITE_URL as string;
const kindsUrl = process.env.KINDS_URL as string;
const privateKey = process.env.PRIVATE_KEY as string;
const abi = JSON.parse(fs.readFileSync("src/TradeContract.abi.json").toString());
const postConfig = {
    auth: {
        username: process.env.MINT_APPLIER_USERNAME,
        password: process.env.MINT_APPLIER_PASSWORD
    }
}

const BATCH_SIZE = 1;

const main = async () => {
    const readyToBeApplied: Array<NftMintRequest> = (await axios.get(readUrl)).data;
    const first = readyToBeApplied[0];
    if (!first) {
        console.log("No applicable mint requests found.");
        process.exit(0);
    }
    const kindId = first.kind;
    const kinds: Array<Kind> = (await axios.get(kindsUrl)).data;

    let promises: Array<Promise<ContractTransactionResponse>> = [];
    for (const kind of kinds) {
        console.log(`Applying for kind ${kind.name}`);
        if (kind.name === "Druid")
            continue;
        const tradeContractAddress = kind.payment_resource.trade_contract_address;
        const rpcUrl = kind.payment_resource.spend_resource_chain.rpc_url;
        const wallet = new ethers.Wallet(privateKey, new ethers.JsonRpcProvider(rpcUrl));
        console.log(`Interacting from ${wallet.address} (on ${rpcUrl}) with contract ${tradeContractAddress}`);
        const tradeContract = new ethers.Contract(tradeContractAddress, abi, wallet);
        promises.push(tradeContract.getFunction("calculatePrices").send(kindId, BATCH_SIZE));
    }

    Promise.all(promises).then((responses) => {
        for (const response of responses) {
            console.log(`Interacted with calculatePrices function ${response.hash}`)
            response.wait().then((receipt) => {
                if (receipt.status == 0) {
                    console.error(`Calculating prices failed`);
                    process.exit(1);
                }
            }).catch((error) => {
                console.error(error);
                console.error(`Error occured on ${response.hash} handling`);
                process.exit(1);
            });
        }
        console.log("Successfully applied");
        axios.post(writeUrl, {tx: first.purchase_tx_hash}, postConfig).then((response) => {
            if (response.status === 200) {
                console.log("Saved applied status");
                process.exit(0);
            } else {
                console.error("Failed");
            }
        })
    });

}

main().catch(console.error);