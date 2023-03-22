import { ethers } from "hardhat";

async function main() {
  const contractFactory = await ethers.getContractFactory("GnosisRiver");
  const price = 1000000;
  const contract = await contractFactory.deploy(price, {
    gasLimit: 5000000,
    gasPrice: 10
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
