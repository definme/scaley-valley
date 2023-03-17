const fs = require("fs");
const hre = require("hardhat");
require('dotenv').config();

const main = async () => {
    const filename = "node_modules/@eth-optimism/contracts-bedrock/artifacts/contracts/universal/OptimismMintableERC20Factory.sol/OptimismMintableERC20Factory.json"
    const contents = fs.readFileSync(filename).toString().replace(/\n/g, "")
    const optimismMintableERC20FactoryData = JSON.parse(contents);
    const optimismMintableERC20Factory = await hre.ethers.getContractAt(optimismMintableERC20FactoryData.abi, "0x4200000000000000000000000000000000000012");

    const deployTx = await optimismMintableERC20Factory.createOptimismMintableERC20(
        process.env.TOKEN_ADDRESS_L1,
        "OptimisticLight",
        "OPTIC"
    );
    const receipt = await deployTx.wait();
    const event = receipt.events.filter(x => x.event === "OptimismMintableERC20Created")[0];
    const l2Addr = event.args["localToken"];
    console.log(l2Addr);
}

main().catch(console.error);
