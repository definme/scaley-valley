import { ethers } from "hardhat";
import {config as envs} from "dotenv";
envs();

async function main() {
  const contractFactory = await ethers.getContractFactory("TradeContract");
  const initialPrice = ethers.utils.parseEther("100");
  const mintTokenDelta = ethers.utils.parseEther("1");
  const kindToBeTraded = 0;
  const contract = await contractFactory.deploy(process.env.TOKEN_ADDRESS_L2 as string, initialPrice, mintTokenDelta, kindToBeTraded, {
    gasPrice: 10,
    gasLimit: 10000000
  });
  await contract.deployed();

  console.log(`${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
