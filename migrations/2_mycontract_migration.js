var ForexTrader = artifacts.require("ForexTrader");

const ROPSTEN_LINK_TOKEN_ADDRESS = "0x20fE562d797A42Dcb3399062AE9546cd06f63280"
const ORACLE_ADDRESS = "0x4a3fbbb385b5efeb4bc84a25aaadcd644bd09721"

module.exports = async function(deployer, network, accounts){
  await deployer.deploy(ForexTrader, ROPSTEN_LINK_TOKEN_ADDRESS, ORACLE_ADDRESS, {from: accounts[0]});
  const deployedContract = await ForexTrader.deployed();

  console.log('deployed contract', deployedContract.address)
};