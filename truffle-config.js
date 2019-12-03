const HDWalletProvider = require('truffle-hdwallet-provider');
const walletFile = require('./wallet.json');

module.exports = {
  // network: "test",
  networks: {
    // development: {
    //   host: "127.0.0.1",
    //   port: 8545,
    //   network_id: "*",
    // },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(walletFile.ropsten_mnemonics, walletFile.ropsten_provider);
      },
      network_id: 3,
      gasPrice: 10000000000
    }
  },
  compilers: {
    solc: {
      version: "0.4.24"
    }
  }
};
