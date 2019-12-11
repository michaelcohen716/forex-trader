import Web3 from "web3";
import { ethers } from "ethers";
import ForexTrade from "../contracts/ForexTrade.json";

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
}

const LEVERAGE = 10;

/* ForexTrade Contract */
async function FTContract(address) {
  return await new web3.eth.Contract(ForexTrade.abi, address);
}

export async function FTContractEthers(address) {
  let provider = ethers.getDefaultProvider("ropsten");
  let contract = new ethers.Contract(address, ForexTrade.abi, provider);
  return contract;
}

export async function initiateTrade(address, notionalInEth, tradePeriodEnd) {
  const contr = await FTContract(address);

  await contr.methods
    .initiateTrade(String(notionalInEth * 10 ** 18), tradePeriodEnd)
    .send({
      from: web3.eth.accounts.givenProvider.selectedAddress,
      value: web3.utils.toWei(String(notionalInEth / LEVERAGE), "ether")
    });
}

export async function acceptTrade(address) {
  const contr = await FTContract(address);
  const trade = await getTrade(address);
  const notional = trade._notional;
  console.log("value", notional / LEVERAGE);

  await contr.methods.acceptTrade().send({
    from: web3.eth.accounts.givenProvider.selectedAddress,
    value: notional / LEVERAGE
  });
}

export async function getTrade(address) {
  const contr = await FTContract(address);

  const trade = await contr.methods.getTrade().call();
  console.log("trade", trade);
  return trade;
}
