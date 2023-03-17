const optimismSDK = require("@eth-optimism/sdk");
require("dotenv").config();

exports.main = async (l1SignerOrProvider, l2SignerOrProvider) => {
    return new optimismSDK.CrossChainMessenger({
        l1ChainId: Number.parseInt(process.env.CHAIN_ID_L1),
        l2ChainId: Number.parseInt(process.env.CHAIN_ID_L2),
        l1SignerOrProvider,
        l2SignerOrProvider,
        bedrock: true
    });
}
