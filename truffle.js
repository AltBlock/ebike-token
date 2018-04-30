const env = require('dotenv').config()["parsed"]
const Web3 = require("web3")
const HDWalletProvider = require('truffle-hdwallet-provider')

const ropstenNetwork = "https://ropsten.infura.io/Ufdlod6ilFQfJwtGTz92"
const seed_words = env["SEED_CODE"]

const ropstenProvider = new HDWalletProvider(seed_words, ropstenNetwork)
const web3 = new Web3()

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: ropstenProvider,
      gas: 6721975,
      gasPrice: web3.toWei("20", "gwei"),
      network_id: "3",
    }
  }
};