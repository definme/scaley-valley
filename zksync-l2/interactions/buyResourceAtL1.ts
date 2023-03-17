import {Wallet, Provider, Contract} from "zksync-web3";
import * as ethers from "ethers";
import {config} from "dotenv";
import {BigNumber} from "ethers";
import * as abi from "./ZksyncForest.json"

config();

const tokenAmount = ethers.utils.parseEther("13");

const main = async function () {
    const zkSyncProvider = new Provider(process.env.ZKSYNC_URL as string);
    const ethereumProvider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_URL as string);
    const wallet = new Wallet(process.env.PRIVATE_KEY, zkSyncProvider, ethereumProvider);
    const gasPrice = await wallet.providerL1!.getGasPrice();
    const contract = new Contract(process.env.TOKEN_ADDRESS, abi, wallet);
    const value = await contract.getRequiredNativeCurrencyToBuy(tokenAmount);
    const gasLimit = BigNumber.from(3000000);
    const gasPerPubdataByte = BigNumber.from(800);

    const calldata = contract.interface.encodeFunctionData("buy", [tokenAmount]);
    const txCostPrice = await wallet.getBaseCost({
        gasPrice,
        gasLimit,
        gasPerPubdataByte
    });
    console.log(`Executing the transaction will cost ${txCostPrice}`);
    console.log(`Required tx value: ${value}`);
    const executeTx = await wallet.requestExecute({
        calldata,
        l2GasLimit: gasLimit,
        gasPerPubdataByte,
        contractAddress: contract.address,
        l2Value: value,
        overrides: {
            gasPrice,
        },
    });

    await executeTx.wait();
    console.log(`Buy is performed with tx ${executeTx.hash}`);
}

main().catch(console.error);
