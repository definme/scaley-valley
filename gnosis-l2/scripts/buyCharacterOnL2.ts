import {ethers} from "hardhat";


const main = async () => {
    const tradeContract = await ethers.getContractAt("TradeContract", process.env.TRADE_CONTRACT_ADDRESS as string);
    const resourceContract = await ethers.getContractAt("GnosisRiver", process.env.TOKEN_ADDRESS_L2 as string);
    const price = await tradeContract.getPrice(await tradeContract.tradedKind())
    await resourceContract.mint("0x86FDc46FB29bB33acD48583bF361C21Cc88bc065", price, {
        gasPrice: 20,
        gasLimit: 500000
    });
    await resourceContract.transfer(tradeContract.address, price, {
        gasPrice: 20,
        gasLimit: 500000
    });
}

main().catch(console.error);
