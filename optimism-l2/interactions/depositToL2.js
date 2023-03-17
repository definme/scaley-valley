const optimismSDK = require("@eth-optimism/sdk");
const setup = require("./setup.js");
const {ethers} = require("ethers");
require("dotenv").config();

const bridgeAmount = ethers.utils.parseEther("500");

const main = async () => {
    const l2Provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_URL_L2);
    const l1Signer = new ethers.Wallet(process.env.PRIVATE_KEY, new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_URL_L1));
    const messenger = await setup.main(l1Signer, l2Provider);
    const start = new Date();
    const allowanceResponse = await messenger.approveERC20(process.env.TOKEN_ADDRESS_L1, process.env.TOKEN_ADDRESS_L2, bridgeAmount);
    await allowanceResponse.wait();
    console.log(`Allowance given by tx ${allowanceResponse.hash}`);

    const depositResponse = await messenger.depositERC20(process.env.TOKEN_ADDRESS_L1, process.env.TOKEN_ADDRESS_L2, bridgeAmount);
    console.log(`Deposit transaction hash (on L1): ${depositResponse.hash}`);
    await depositResponse.wait();
    console.log("Waiting for status to change to RELAYED");
    await messenger.waitForMessageStatus(depositResponse.hash, optimismSDK.MessageStatus.RELAYED);
    console.log(`depositERC20 took ${(new Date() - start) / 1000} seconds\n\n`)
};

main().catch(console.error);
