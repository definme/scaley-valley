const {ethers}  = require("hardhat");


const main = async() => {
    const contract =await ethers.getContractAt("OptimisticLight", '0xcb3D2498E189f4D0C5e3cDaBc96ad4469f5478d3');
    const price = await contract.price();
    console.log(price)
}

main().catch(console.error);
