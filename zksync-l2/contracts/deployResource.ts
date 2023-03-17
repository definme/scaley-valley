import { Wallet, utils } from "zksync-web3";
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
  const contractName = "ZksyncForest";
  console.log(`Running deploy script for the ${contractName} contract`);
  const wallet = new Wallet(PRIVATE_KEY);
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact(contractName);
  const args = [400000];
  const deploymentFee = await deployer.estimateDeployFee(artifact, args);
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: deploymentFee.mul(2),
  });
  await depositHandle.wait();
  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);
  const contract = await deployer.deploy(artifact, args);
  const contractAddress = contract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}
