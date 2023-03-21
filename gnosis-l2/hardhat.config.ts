import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import {config as envs} from "dotenv";

envs();

const config: HardhatUserConfig = {
    solidity: "0.8.18",
    networks: {
        chiado: {
            url: process.env.CHIADO_URL,
            accounts: [process.env.PRIVATE_KEY as string]
        },
        goerli: {
            url: process.env.GOERLI_URL,
            accounts: [process.env.PRIVATE_KEY as string]
        },
        mumbai: {
            url: "https://rpc-mumbai.maticvigil.com",
            accounts: [process.env.PRIVATE_KEY as string]
        }
    }
};

export default config;
