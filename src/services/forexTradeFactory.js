import Web3 from "web3";
import ForexTradeFactory from "../contracts/ForexTradeFactory.json";
import ForexTrade from "../contracts/ForexTrade.json";

const LEVERAGE = 5;

let web3;

if(window.ethereum){
    web3 = new Web3(window.ethereum);
}

export const FOREX_TRADE_FACTORY_ADDRESS  = '0x09C8C9a3e98473624eD042d75Fb5f8b3E96198D5'; // ropsten 

/* ForexTradeFactory Contract */
async function FTFContract() {
  return await new web3.eth.Contract(ForexTradeFactory.abi, FOREX_TRADE_FACTORY_ADDRESS);
}

export async function createTrade(currencyA, currencyB){
    const contr = await FTFContract();
    await contr.methods.createTrade("USD", "EUR").send({
        from: web3.eth.accounts.givenProvider.selectedAddress
    })
}

export async function getTradesByAddress(address){
    const contr = await FTFContract();
    const resp = await contr.methods.getTradesByAddress(address).call();
    console.log('resp', resp)
}

/* ForexTrade Contract */
async function FTContract(address){
    return await new web3.eth.Contract(ForexTrade.abi, address);
}

export async function initiateTrade(address, notionalInEth, tradePeriodEnd){
    const contr = await FTContract(address);

    await contr.methods.initiateTrade(String(notionalInEth * 10**18), tradePeriodEnd).send({
        from: web3.eth.accounts.givenProvider.selectedAddress,
        value: web3.utils.toWei(String((notionalInEth / LEVERAGE * 1.01)), "ether")
    })
}

export async function acceptTrade(address){
    const contr = await FTContract(address);

    await contr.methods.acceptTrade().send({
        from: web3.eth.accounts.givenProvider.selectedAddress,
        value: web3.utils.toWei("0.021", "ether") //fix with getNotional()
    })
}
