const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("ResourceToken", () => {

    before(async () => {
        this.factory = await ethers.getContractFactory("ResourceToken");
        this.price = 1000; // 1 wei of ether is 1000 wei of RTN
        this.contract = await this.factory.deploy("ResourceToken", "RTN", this.price);
        this.stranger = (await ethers.getSigners())[1];
    })

    describe("Mint", async () => {
        it("should revert direct mint when non minter", async () => {
            const attempt = this.contract.connect(this.stranger).mint(await this.stranger.getAddress(), 100);
            await expect(attempt).to.be.reverted;
        });

        it("should mint tokens when minter role", async () => {
            await this.contract.mint(await this.stranger.getAddress(), 100);
        });
    });

    describe("Buy", async () => {
        it("should perform buying tokens", async () => {
            const requestedTokenAmount = ethers.utils.parseEther("1000");
            const neededNative = await this.contract.getRequiredNativeCurrencyToBuy(requestedTokenAmount);
            await this.contract.buy(requestedTokenAmount, {
                value: neededNative
            });
        });

        it("should revert buying when not enough native provided", async () => {
            const requestedTokenAmount = ethers.utils.parseEther("1000");
            const attempt = this.contract.buy(requestedTokenAmount, {
                value: 1
            });
            await expect(attempt).to.be.revertedWith("BUY_RESOURCE_BAD_AMOUNT");
        });

        it("should revert buying when not enough native provided", async () => {
            const requestedTokenAmount = ethers.utils.parseEther("1000");
            const neededNative = await this.contract.getRequiredNativeCurrencyToBuy(requestedTokenAmount);
            const someExtraNative = neededNative.add(10000);
            const attempt = this.contract.buy(requestedTokenAmount, {
                value: someExtraNative
            });
            await expect(attempt).to.be.revertedWith("BUY_RESOURCE_BAD_AMOUNT");
        });
    });
});
