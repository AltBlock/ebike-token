const ether = require("./helpers/ether").ether;
const Block = require('./helpers/advanceToBlock');
const Times = require('./helpers/increaseTime');
const latestTime = require('./helpers/latestTime').latestTime;
const EVMRevert = 'revert'

const duration = Times.duration;
const increaseTimeTo = Times.increaseTimeTo;

const advanceBlock = Block.advanceBlock;
const advanceToBlock = Block.advanceToBlock;

const BigNumber = web3.BigNumber;

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

const EbikeTokenCrowdsale = artifacts.require('EbikeTokenCrowdsale');
const EbikeToken = artifacts.require('EbikeToken');

contract("EbikeTokenCrowdsale", function ([owner, wallet, investor]) {
    console.log(owner, wallet, investor)
    const _rate = 5000;
    const _goal = ether(10);
    const _cap = ether(20);

    before(async function () {
        // Advance to next block to correctly read time.
        await advanceBlock();
    });

    before(async function () {
        this.openingTime = latestTime() + duration.weeks(1);
        this.closingTime = this.openingTime + duration.weeks(4);

        this.token = await EbikeToken.new({ from: owner });
        this.crowdsale = await EbikeTokenCrowdsale.new(
            this.openingTime, this.closingTime, _rate, wallet, this.token.address
        );

        let owner_ = await this.token.owner();

        await this.token.transferOwnership(this.crowdsale.address, { from: owner })
    })

    it('should create crowdsale with correct parameters', async function () {
        this.crowdsale.should.exist;
        this.token.should.exist;

        const openingTime = await this.crowdsale.openingTime();
        const closingTime = await this.crowdsale.closingTime();
        const rate = await this.crowdsale.rate();
        const t = await this.token.owner();
        const publicMaxTokens = await this.crowdsale.publicMaxTokens();
        const totalTokensForPreSale = await this.crowdsale.totalTokensForPreSale();
        const totalTokensForPrivateSale = await this.crowdsale.totalTokensForPrivateSale();
        const totalTokensForDevelopers = await this.crowdsale.totalTokensForDevelopers();
        const totalTokensForTeam = await this.crowdsale.totalTokensForTeam();
        const totalTokensForBounty = await this.crowdsale.totalTokensForBounty();


        this._publicMaxTokens = ether(1) * 60000000;
        this._totalTokensForPreSale = ether(1) * 10000000;
        this._totalTokensForPrivateSale = ether(1) * 4000000;
        this._totalTokensForDevelopers = ether(1) * 20000000;
        this._totalTokensForTeam = ether(1) * 10000000;
        this._totalTokensForBounty = ether(1) * 5000000;



        openingTime.should.be.bignumber.equal(this.openingTime);
        closingTime.should.be.bignumber.equal(this.closingTime);
        rate.should.be.bignumber.equal(_rate);
        this.crowdsale.address.should.be.equal(t);
        publicMaxTokens.should.be.bignumber.equal(this._publicMaxTokens);
        totalTokensForPreSale.should.be.bignumber.equal(this._totalTokensForPreSale);
        totalTokensForPrivateSale.should.be.bignumber.equal(this._totalTokensForPrivateSale);
        totalTokensForDevelopers.should.be.bignumber.equal(this._totalTokensForDevelopers);
        totalTokensForTeam.should.be.bignumber.equal(this._totalTokensForTeam);
        totalTokensForBounty.should.be.bignumber.equal(this._totalTokensForBounty);
    });

    it('Should not accept payments before start', async function () {
        await this.crowdsale.send(ether(1)).should.be.rejectedWith(EVMRevert);
        await this.crowdsale.buyTokens(investor, { from: investor, value: ether(1) }).should.be.rejectedWith(EVMRevert);
    });

    it('should accept payments during the sale', async function () {
        const investmentAmount = ether(1);
        const bonus_coff = 1000;
        const bonus_rate = 500;
        this.expectedTokenAmount = (_rate * investmentAmount * ((bonus_coff + bonus_rate) / bonus_coff));
        
        await increaseTimeTo(this.openingTime);
        await this.crowdsale.buyTokens(investor, { value: investmentAmount, from: investor }).should.be.fulfilled;

        (await this.token.balanceOf(investor)).should.be.bignumber.equal(this.expectedTokenAmount);
        (await this.token.totalSupply()).should.be.bignumber.equal(this.expectedTokenAmount);
    });

    it('should set variable `totalWeiRaisedDuringPreSale` correctly', async function () {
        const investmentAmount = ether(1);
        const amountRaised = await this.crowdsale.totalWeiRaisedDuringPreSale.call();
        amountRaised.should.be.bignumber.equal(investmentAmount);
    })

    it('should change `publicMaxTokens` and also update `totalTokenLimit`', async function () {
        const _prvCirculating = await this.crowdsale.publicMaxTokens();
        this._publicMaxTokens = ether(1) * 80000000;
        const _total = ether(1) * 109000000 + (this._publicMaxTokens - _prvCirculating);
        await this.crowdsale.setMaxTokenForPublic(this._publicMaxTokens);
        // Get circulating tokens
        const _currentCirculating = await this.crowdsale.publicMaxTokens();
        const _currentTotalLimit = await this.crowdsale.totalTokenLimit();

        _currentCirculating.should.be.bignumber.equal(this._publicMaxTokens);
        _currentTotalLimit.should.be.bignumber.equal(_total);
    });

    it('should finish PreSale and set stage to ICO.', async function () {        
        const stage = new BigNumber(1); // 1 denotes ICO where as 0 denotes PreSale.
        (await this.crowdsale.FinishPreSale());
        const _stage = await this.crowdsale.stage();
        _stage.should.be.bignumber.equal(stage);
    });

    it('should add the unsold tokens to `publicMaxTokens` after Finishing the PreSale.', async function () {
        const newPublicSaleTokens = this._publicMaxTokens + (this._totalTokensForPreSale - this.expectedTokenAmount);
        const publicMaxTokens = await this.crowdsale.publicMaxTokens();
        publicMaxTokens.should.be.bignumber.equal(newPublicSaleTokens);
    });
});