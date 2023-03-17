const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("TradeContract", () => {

    before(async () => {
        const tradeContractFactory = await ethers.getContractFactory("TradeContract");
        this.initialPrice = ethers.utils.parseEther("300"); // 300 resource tokens are expected as initial price
        this.mintBatchSize = 1; // how many tokens are minted during 1 batch sent by PriceController off-chain worker
        this.priceDeltaPerMintedToken = ethers.utils.parseEther("1");

        this.stranger = (await ethers.getSigners())[1];

        const resourceTokenFactory = await ethers.getContractFactory("ResourceToken");
        this.gnosisRiverResourceERC20 = await resourceTokenFactory.deploy("GnosisRiver", "WATR", 100);
        this.zkSyncForestResourceERC20 = await resourceTokenFactory.deploy("ZkSyncForest", "WOOD", 100);
        this.optimisticLightResourceERC20 = await resourceTokenFactory.deploy("OptimisticLight", "OPTIC", 100);
        this.polyAirResourceERC20 = await resourceTokenFactory.deploy("PolyAir", "AIR", 100);

        // the 0x... constants were taken directly from contract
        this.contractGnosis = await tradeContractFactory.deploy(this.gnosisRiverResourceERC20.address, this.initialPrice, this.priceDeltaPerMintedToken, 0x0000);
        this.contractZksync = await tradeContractFactory.deploy(this.zkSyncForestResourceERC20.address, this.initialPrice, this.priceDeltaPerMintedToken, 0x0001);
        this.contractOptimism = await tradeContractFactory.deploy(this.optimisticLightResourceERC20.address, this.initialPrice, this.priceDeltaPerMintedToken, 0x0002);
        this.contractPolygon = await tradeContractFactory.deploy(this.polyAirResourceERC20.address, this.initialPrice, this.priceDeltaPerMintedToken, 0x0003);

        // since there are four resource L2 chains we have 4 identical contracts
        this.contracts = [this.contractGnosis, this.contractZksync, this.contractOptimism, this.contractPolygon];

        // since all contracts are the same we can take any of them to get list of kinds
        this.aquatique_kind = await this.contractGnosis.AQUATIQUE_KIND();
        this.druid_kind = await this.contractGnosis.DRUID_KIND();
        this.illuminator_kind = await this.contractGnosis.ILLUMINATOR_KIND();
        this.hermes_kind = await this.contractGnosis.HERMES_KIND();

        this.kinds = [
            this.aquatique_kind,
            this.druid_kind,
            this.illuminator_kind,
            this.hermes_kind,
        ];

        this.mockMessageTokenMinted = async (kind, amountMinted) => {
            this.contracts.forEach(async (contract) => {
                await contract.calculatePrices(kind, amountMinted)
            });
        }

        this.assertTokenPrices = async (kind, expectedPrices) => {
            this.contracts.forEach(async (contract) => {
                this.kinds.forEach(async (kind) => {
                    const price = await contract.getPrice(kind);
                    expect(price).eq(expectedPrices[kind]);
                });
            });
        }
    });

    describe("Price management", () => {

        it("should initialize prices properly", async () => {
            this.contracts.forEach(async (contract) => {
                this.kinds.forEach(async (kind) => {
                    const price = await contract.getPrice(kind);
                    expect(price).eq(this.initialPrice);
                });
            });
        });

        it("should revert price management for non-PRICE_CONTROL_ROLE", async () => {
            // here we can take any TradeController contract
            const attempt = this.contractGnosis.connect(this.stranger).calculatePrices(0, 100);
            await expect(attempt).to.be.reverted;
        });

        it("should revert price management for bad kind id", async () => {
            // here we can take any contract
            const attempt = this.contractOptimism.calculatePrices(0xdeadbeef, 100);
            await expect(attempt).to.be.revertedWith("CALCULATE_BAD_KIND");
        });

        it("should revert price management for bad mint amount", async () => {
            // here we can take any contract
            const attempt = this.contractZksync.calculatePrices(this.aquatique_kind, 0);
            await expect(attempt).to.be.revertedWith("CALCULATE_BAD_MINT_BATCH_SIZE");
        });


        it("should change prices on all 4 contracts when mint token of kind 0", async () => {
            const kind = 0;
            await this.mockMessageTokenMinted(kind, this.mintBatchSize);
            const expectedPrices = {}
            expectedPrices[this.aquatique_kind] = this.initialPrice.sub(this.priceDeltaPerMintedToken);
            expectedPrices[this.druid_kind] = this.initialPrice.add(this.priceDeltaPerMintedToken);
            expectedPrices[this.illuminator_kind] = this.initialPrice.add(this.priceDeltaPerMintedToken);
            expectedPrices[this.hermes_kind] = this.initialPrice.add(this.priceDeltaPerMintedToken);
            await this.assertTokenPrices(kind, expectedPrices);
        });

        it("should change prices on all 4 contracts when mint token of kind 1", async () => {
            const kind = 1;
            await this.mockMessageTokenMinted(kind, this.mintBatchSize);
            const expectedPrices = {}
            expectedPrices[this.aquatique_kind] = this.initialPrice;
            expectedPrices[this.druid_kind] = this.initialPrice;
            expectedPrices[this.illuminator_kind] = this.initialPrice.add(this.priceDeltaPerMintedToken).add(this.priceDeltaPerMintedToken);
            expectedPrices[this.hermes_kind] = this.initialPrice.add(this.priceDeltaPerMintedToken).add(this.priceDeltaPerMintedToken);
            await this.assertTokenPrices(kind, expectedPrices);
        });

        it("should change prices on all 4 contracts when mint token of kind 2", async () => {
            const kind = 2;
            await this.mockMessageTokenMinted(kind, this.mintBatchSize);
            const expectedPrices = {}
            expectedPrices[this.aquatique_kind] = this.initialPrice.add(this.priceDeltaPerMintedToken);
            expectedPrices[this.druid_kind] = this.initialPrice.add(this.priceDeltaPerMintedToken);
            expectedPrices[this.illuminator_kind] = this.initialPrice.add(this.priceDeltaPerMintedToken);
            expectedPrices[this.hermes_kind] = this.initialPrice.add(this.priceDeltaPerMintedToken).add(this.priceDeltaPerMintedToken).add(this.priceDeltaPerMintedToken);
            await this.assertTokenPrices(kind, expectedPrices);
        });

        it("should change prices on all 4 contracts when mint token of kind 3", async () => {
            const kind = 3;
            await this.mockMessageTokenMinted(kind, this.mintBatchSize);
            const expectedPrices = {}
            expectedPrices[this.aquatique_kind] = this.initialPrice.add(this.priceDeltaPerMintedToken).add(this.priceDeltaPerMintedToken);
            expectedPrices[this.druid_kind] = this.initialPrice.add(this.priceDeltaPerMintedToken).add(this.priceDeltaPerMintedToken);
            expectedPrices[this.illuminator_kind] = this.initialPrice.add(this.priceDeltaPerMintedToken).add(this.priceDeltaPerMintedToken);
            expectedPrices[this.hermes_kind] = this.initialPrice.add(this.priceDeltaPerMintedToken).add(this.priceDeltaPerMintedToken);
            await this.assertTokenPrices(kind, expectedPrices);
        });
    });

    describe("Trade validation", () => {
        it("should pass a valid trade through validation method", async () => {
            const token = this.gnosisRiverResourceERC20.address;
            const kind = await this.contractGnosis.tradedKind();
            const amount = await this.contractGnosis.getPrice(kind);
            expect(await this.contractGnosis.isTradeValid(token, amount, kind)).eq(true);
        });

        it("should mark trade is invalid: bad payment token", async () => {
            const token = this.polyAirResourceERC20.address;
            const kind = await this.contractOptimism.tradedKind();
            const amount = await this.contractOptimism.getPrice(kind);
            expect(await this.contractOptimism.isTradeValid(token, amount, kind)).eq(false);
        });

        it("should mark trade is invalid: bad kind to be bought", async () => {
            const token = this.polyAirResourceERC20.address;
            const kind = await this.contractOptimism.tradedKind();
            const amount = await this.contractPolygon.getPrice(kind);
            expect(await this.contractPolygon.isTradeValid(token, amount, kind)).eq(false);
        });

        it("should mark trade is invalid: bad amount provided", async () => {
            const token = this.zkSyncForestResourceERC20.address;
            const kind = await this.contractZksync.tradedKind();
            const amount = (await this.contractZksync.getPrice(kind)).sub(123);
            expect(await this.contractZksync.isTradeValid(token, amount, kind)).eq(false);
        });
    });
});
