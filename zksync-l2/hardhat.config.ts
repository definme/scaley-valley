import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import {config} from "dotenv";
config();

module.exports = {
    zksolc: {
        version: "1.3.1",
        compilerSource: "binary",
        settings: {},
    },
    defaultNetwork: "zkSyncTestnet",

    networks: {
        zkSyncTestnet: {
            url: process.env.ZKSYNC_URL,
            ethNetwork: process.env.GOERLI_URL,
            zksync: true,
        },
    },
    solidity: {
        version: "0.8.17",
    },
};
