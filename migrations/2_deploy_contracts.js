const EbikeTokenCrowdsale = artifacts.require('./EbikeTokenCrowdsale.sol');
const EbikeToken = artifacts.require('./EbikeToken.sol');

module.exports = function(deployer, network, accounts) {
    // 150 Second in future
    const openingTime = web3.eth.getBlock('latest').timestamp + 150; 
    // Set Limit to 20 days
    const closingTime = openingTime + 86400 * 20;
    const rate = new web3.BigNumber(1000);
    const wallet = accounts[1];

    return deployer
        .then(() => {
            return deployer.deploy(EbikeToken);
        })
        .then(() => {
            return deployer.deploy(
                EbikeTokenCrowdsale,
                openingTime,
                closingTime,
                rate,
                wallet,
                EbikeToken.address
            );
        });
};