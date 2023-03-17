import { Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import {config} from "dotenv";
config();

const PRIVATE_KEY: string = process.env.PRIVATE_KEY || "";
if (!PRIVATE_KEY) {
  throw new Error("Please set PRIVATE_KEY in the environment variables.");
}

export default async function (hre: HardhatRuntimeEnvironment) {
  const contractName = "TradeContract";
  console.log(`Running deploy script for the ${contractName} contract`);
  const wallet = new Wallet(PRIVATE_KEY);
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact(contractName);
  const initialPrice = ethers.utils.parseEther("100");
  const mintTokenDelta = ethers.utils.parseEther("1");
  const kindToBeTraded = 0x0001;
  const args = [process.env.TOKEN_ADDRESS, initialPrice, mintTokenDelta, kindToBeTraded];
  const contract = await deployer.deploy(artifact, args);
  const contractAddress = contract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}
