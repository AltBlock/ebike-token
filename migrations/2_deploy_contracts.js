const EbikeTokenCrowdsale = artifacts.require('./EbikeTokenCrowdsale.sol');
const EbikeToken = artifacts.require('./EbikeToken');

module.exports = function (deployer, network, accounts) {
    // Start time now
    const startTime = Math.round((new Date(Date.now() + 86400000).getTime()) / 1000);
    // 6 months duration from start time
    const endTime = startTime + duration.days(180);
    // Rate 3600 EBK per ETH
    const rate = 3600;    
    const wallet = accounts[0];
    return deployer
        .then(() => {
            return deployer.deploy(EbikeToken);
        })
        .then(() => {
            return deployer.deploy(
                EbikeTokenCrowdsale,
                startTime,
                endTime,
                rate,
                wallet,
                EbikeToken.address
            );
        })
        .catch(error => {
            console.log(error)
        })
};


const duration = {
    seconds: function (val) { return val; },
    minutes: function (val) { return val * this.seconds(60); },
    hours: function (val) { return val * this.minutes(60); },
    days: function (val) { return val * this.hours(24); },
    weeks: function (val) { return val * this.days(7); },
    years: function (val) { return val * this.days(365); },
};