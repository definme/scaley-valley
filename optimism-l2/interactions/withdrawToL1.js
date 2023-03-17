const optimismSDK = require("@eth-optimism/sdk");
const setup = require("./setup");
const {ethers} = require("ethers");
require("dotenv").config();
const bridgeAmount = ethers.utils.parseEther("1");

const main = async () => {
    const l1Provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_URL_L1);
    const l2Signer = new ethers.Wallet(process.env.PRIVATE_KEY, new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_URL_L2));
    const messenger = await setup.main(l1Provider, l2Signer);
    const start = new Date();
    const response = await messenger.withdrawERC20(process.env.TOKEN_ADDRESS_L1, process.env.TOKEN_ADDRESS_L2, bridgeAmount);
    console.log(`Transaction hash (on L2): ${response.hash}`);
    await response.wait();

    console.log("Waiting for status to be READY_TO_PROVE");
    await messenger.waitForMessageStatus(response.hash, optimismSDK.MessageStatus.READY_TO_PROVE);
    await messenger.proveMessage(response.hash);

    console.log("In the challenge period, waiting for status READY_FOR_RELAY");
    await messenger.waitForMessageStatus(response.hash, optimismSDK.MessageStatus.READY_FOR_RELAY);
    console.log("Ready for relay, finalizing message now");
    await messenger.finalizeMessage(response.hash);

    console.log("Waiting for status to change to RELAYED");
    await messenger.waitForMessageStatus(response, optimismSDK.MessageStatus.RELAYED);
    console.log(`withdrawERC20 took ${(new Date() - start) / 1000} seconds\n\n\n`);
}

main().catch(console.error);
