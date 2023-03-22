import { ethers } from "hardhat";

async function main() {
  const contractFactory = await ethers.getContractFactory("GnosisBridgeL1");
  const price = 1000000;
  const contract = await contractFactory.deploy(price);
  await contract.deployed();

  console.log(`${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
