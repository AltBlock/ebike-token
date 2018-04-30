const EbikeToken = artifacts.require("EbikeToken")
const EbikeTokenCrowdsale = artifacts.require("EbikeTokenCrowdsale")

contract('EbikeTokenCrowdsale', function (accounts) {
    it("should deploy the token and store the address", function (done) {
        EbikeTokenCrowdsale.deployed().then(async function (instance) {
            const token = await instance.token.call();
            assert(token, 'Token address could\'t be stored');
            done();
        })
    })

    it('one ETH should buy 2500 BIKE Tokens', function (done) {
        EbikeTokenCrowdsale.deployed().then(async function (instance) {
            const data = await instance.sendTransaction({from: accounts[5],value: web3.toWei(1, "ether")});
            const tokenAddress = await instance.token.call();
            const BIKEToken = EbikeToken.at(tokenAddress);
            const tokenAmount = await BIKEToken.balanceOf(accounts[5])
            assert.equal(tokenAmount.toNumber(), 2500000000000000000000, 'The Sender didn\'t received the token as per rate.');
            done();
        })
    })


})