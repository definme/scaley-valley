const { expect } = require('chai')
const { ethers } = require('hardhat')
const BASE_URI = 'ipfs://ipfs'

describe('ScaleyValleyCollection', function () {
  before(async function () {
    this.signers = await ethers.getSigners()
    this.deployer = this.signers[0]
    this.recipient = this.signers[1]
    this.minter = this.signers[2]
    this.stranger = this.signers[3]
    this.CollectionFactory = await ethers.getContractFactory(
      'ScaleyValleyCollection'
    )
  })

  beforeEach(async function () {
    this.collection = await this.CollectionFactory.deploy(BASE_URI)
    await this.collection.deployed()

    await this.collection.grantRole(
      await this.collection.MINTER_ROLE(),
      this.minter.address
    )
  })

  it('has a name', async function () {
    expect(await this.collection.name()).to.equal('ScaleyValleyCollection')
  })

  it('has a symbol', async function () {
    expect(await this.collection.symbol()).to.equal('SVC')
  })

  describe('mint', async function () {
    beforeEach(async function () {
      this.druidKind = await this.collection.DRUID_KIND()
    })
    it('deployer can mint', async function () {
      await this.collection
        .connect(this.deployer)
        .mintKind(this.recipient.address, this.druidKind)

      expect(await this.collection.balanceOf(this.recipient.address)).to.equal(
        1
      )
    })

    it('minter can mint', async function () {
      await this.collection
        .connect(this.minter)
        .mintKind(this.recipient.address, this.druidKind)

      expect(await this.collection.balanceOf(this.recipient.address)).to.equal(
        1
      )
    })

    it('stranger cannot mint', async function () {
      await expect(
        this.collection
          .connect(this.stranger)
          .mintKind(this.recipient.address, this.druidKind)
      ).to.be.reverted

      expect(await this.collection.balanceOf(this.recipient.address)).to.equal(
        0
      )
    })

    it('mint should correctly set kindSupply', async function () {
      expect(await this.collection.getNFTKindSupply(this.druidKind)).to.equal(0)
      await this.collection
        .connect(this.minter)
        .mintKind(this.recipient.address, this.druidKind)
      expect(await this.collection.getNFTKindSupply(this.druidKind)).to.equal(1)
      await this.collection
        .connect(this.minter)
        .mintKind(this.recipient.address, this.druidKind)
      expect(await this.collection.getNFTKindSupply(this.druidKind)).to.equal(2)
    })
  })

  describe('check isKind function', async function () {
    it('should correctly check for Aquatique', async function () {
      const aquatiqueKind = await this.collection.AQUATIQUE_KIND()
      const aquatiqueTokenId = (aquatiqueKind << 16) | 1
      const result = await this.collection.isKind(
        aquatiqueTokenId,
        aquatiqueKind
      )
      expect(result).to.be.true
    })

    it('should correctly check for Druid', async function () {
      const druidKind = await this.collection.DRUID_KIND()
      const druidTokenId = (druidKind << 16) | 2
      const result = await this.collection.isKind(druidTokenId, druidKind)
      expect(result).to.be.true
    })

    it('should correctly check for Illuminator', async function () {
      const illuminatorKind = await this.collection.ILLUMINATOR_KIND()
      const illuminatorTokenId = (illuminatorKind << 16) | 3
      const result = await this.collection.isKind(
        illuminatorTokenId,
        illuminatorKind
      )
      expect(result).to.be.true
    })

    it('should correctly check for Hermes', async function () {
      const hermesKind = await this.collection.HERMES_KIND()
      const hermesTokenId = (hermesKind << 16) | 3
      const result = await this.collection.isKind(hermesTokenId, hermesKind)
      expect(result).to.be.true
    })

    it('should fail check for bad value', async function () {
      const badDruidKind = 0xfff
      const druidKind = await this.collection.DRUID_KIND()
      const druidTokenId = (badDruidKind << 16) | 1
      const result = await this.collection.isKind(druidTokenId, druidKind)
      expect(result).to.be.false
    })
  })

  describe('check token URI functions', async function () {
    beforeEach(async function () {
      this.druidKind = await this.collection.DRUID_KIND()
      this.tokenId = (this.druidKind << 16) | 0
    })

    it('should give token uri correctly', async function () {
      await this.collection
        .connect(this.minter)
        .mintKind(this.recipient.address, this.druidKind)
      const tokenURI = await this.collection.tokenURI(this.tokenId)
      expect(tokenURI).to.be.eq(BASE_URI + '/' + this.tokenId + '.json')
    })

    it('should fail tokenURI function if token is not minted', async function () {
      await expect(this.collection.tokenURI(this.druidKind)).to.be.reverted
    })

    it('should change base token uri when admin', async function () {
      await this.collection
        .connect(this.minter)
        .mintKind(this.recipient.address, this.druidKind)

      const tokenURIBefore = await this.collection.tokenURI(this.tokenId)
      expect(tokenURIBefore).to.be.eq(BASE_URI + '/' + this.tokenId + '.json')

      const changedURI = 'new.host/api'
      await this.collection.setBaseURI(changedURI)

      const tokenURIAfter = await this.collection.tokenURI(this.tokenId)
      expect(tokenURIAfter).to.be.eq(changedURI + '/' + this.tokenId + '.json')
    })

    it('should deny change token uri when stranger', async function () {
      await this.collection
        .connect(this.minter)
        .mintKind(this.stranger.address, this.druidKind)

      const tokenURIBefore = await this.collection
        .connect(this.stranger)
        .tokenURI(this.tokenId)
      expect(tokenURIBefore).to.be.eq(BASE_URI + '/' + this.tokenId + '.json')

      const changedURI = 'new.host/api'
      const attemptToChange = this.collection
        .connect(this.stranger)
        .setBaseURI(changedURI)
      expect(attemptToChange).to.be.revertedWith('need DEFAULT_ADMIN_ROLE')

      const tokenURIAfter = await this.collection
        .connect(this.stranger)
        .tokenURI(this.tokenId)
      expect(tokenURIAfter).to.be.eq(BASE_URI + '/' + this.tokenId + '.json')
    })
  })
})
