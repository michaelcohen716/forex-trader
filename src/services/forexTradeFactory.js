import Web3 from "web3";
import { ethers } from "ethers";
import ForexTradeFactory from "../contracts/ForexTradeFactory.json";
import ForexTrade from "../contracts/ForexTrade.json";

const LEVERAGE = 10;

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
}

export const FOREX_TRADE_FACTORY_ADDRESS =
  "0x05b568B5ef06dfe28cD8130d2D6e8B8e4aF4453c"; // ropsten

/* ForexTradeFactory Contract */
export async function FTFContract() {
  return await new web3.eth.Contract(
    ForexTradeFactory.abi,
    FOREX_TRADE_FACTORY_ADDRESS
  );
}

export async function FTFContractEthers() {
  let provider = ethers.getDefaultProvider("ropsten");
  let contract = new ethers.Contract(
    FOREX_TRADE_FACTORY_ADDRESS,
    ForexTradeFactory.abi,
    provider
  );
  return contract;
}

export async function createTrade(currencyA, currencyB) {
  const contr = await FTFContract();
  await contr.methods.createTrade(currencyA, currencyB).send({
    from: web3.eth.accounts.givenProvider.selectedAddress
  });
}

export async function getTradesByAddress(address) {
  const contr = await FTFContract();
  const resp = await contr.methods.getTradesByAddress(address).call();
  return resp;
}

export async function getPastTradeEvents(address) {
  const contr = await FTFContract();
  const tradeCreatedLogs = await contr.getPastEvents(
    "TradeCreated",
    { creator: address },
    { fromBlock: 0, toBlock: "latest" }
  );
  console.log("tradecreatedlogs", tradeCreatedLogs);
}
