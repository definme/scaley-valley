const ethers = require("ethers");
const abi = require("./ResourceToken.abi.json");
const optimismSDK = require("@eth-optimism/sdk");
const {MongoClient} = require("mongodb");
require("dotenv").config();
const providerL2 = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_L2);
const providerL1 = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_L1);

const bridgeWallet = new ethers.Wallet(process.env.BRIDGE_PRIVATE_KEY, providerL1);
console.log(`Bridge administrator ${bridgeWallet.address}`);
const contract = new ethers.Contract(process.env.TOKEN_ADDRESS_L1, abi, bridgeWallet);
const messenger = new optimismSDK.CrossChainMessenger({
    l1ChainId: Number.parseInt(process.env.CHAIN_ID_L1),
    l2ChainId: Number.parseInt(process.env.CHAIN_ID_L2),
    l1SignerOrProvider: bridgeWallet,
    l2SignerOrProvider: providerL2,
    bedrock: true
});

const mongo = new MongoClient(process.env.MONGO_URL);
const database = mongo.db("scaley-valley");
const bridgeProcesses = database.collection("bridgeProcesses");

function failBridge(newBridgeProcess) {
    bridgeProcesses.updateOne({
        _id: newBridgeProcess._id
    }, {$set: {"status": "FAIL"}}).catch(console.error);
    process.exit(1);
}

function completeBridge(newBridgeProcess) {
    bridgeProcesses.updateOne({
        _id: newBridgeProcess._id
    }, {
        $set: {
            "status": "SUCCESS",
            "bridgeL1TxHash": newBridgeProcess.bridgeL1TxHash,
            "allowanceL1TxHash": newBridgeProcess.allowanceL1TxHash,
        }
    }).then(_ => {
        console.log("Bridge status is set to completed");
        console.log("Bridge completed");
        process.exit(0);
    }).catch(console.error);
}

async function processBridge(newBridgeProcess) {
    let tx;
    try {
        tx = await providerL1.getTransaction(newBridgeProcess.purchaseTxHash);
    } catch (e) {
        console.error(e);
        tx = null
    }
    if (tx) {
        const bridgeInitiator = tx.from;
        const value = tx.value;
        if (tx.to === bridgeWallet.address.toString()) {
            const price = await contract.price();
            const amount = value.mul(price);
            console.log(`Buy resource to be bridged: ${amount} bought with ${value} (price: ${price})`)
            const tx = await contract.buy(amount, {
                value,
            });
            const receipt = await tx.wait();
            if (receipt.status !== 0) {
                const allowanceResponse = await messenger.approveERC20(process.env.TOKEN_ADDRESS_L1, process.env.TOKEN_ADDRESS_L2, amount);
                await allowanceResponse.wait();
                console.log(`Allowance given by tx ${allowanceResponse.hash}`);
                const depositResponse = await messenger.depositERC20(process.env.TOKEN_ADDRESS_L1, process.env.TOKEN_ADDRESS_L2, amount, {
                    recipient: bridgeInitiator
                });
                newBridgeProcess.allowanceL1TxHash = allowanceResponse.hash;
                newBridgeProcess.bridgeL1TxHash = depositResponse.hash;
                console.log(`Deposit transaction hash (on L1): ${depositResponse.hash}`);
                await depositResponse.wait();
                console.log("Waiting for status to change to RELAYED");
                await messenger.waitForMessageStatus(depositResponse.hash, optimismSDK.MessageStatus.RELAYED);
                completeBridge(newBridgeProcess);
            } else {
                failBridge(newBridgeProcess);
            }
        } else {
            failBridge(newBridgeProcess);
        }
    } else {
        failBridge(newBridgeProcess);
    }

}

const main = async () => {
    bridgeProcesses.findOne({
        status: "NEW"
    }).then(bridgeProcess => {
        if (bridgeProcess) {
            console.log(`Found NEW bridge request initiatied in ${bridgeProcess.purchaseTxHash}`)
            bridgeProcesses.updateOne({
                _id: bridgeProcess._id
            }, {$set: {"status": "PROCESS"}}).catch(console.error);
            processBridge(bridgeProcess).catch(console.error);
        } else {
            throw new Error("No new bridge process found");
        }
    });
}

main().catch((reason) => {
    console.log(reason);
});
