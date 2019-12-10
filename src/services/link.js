import Web3 from "web3";
import LinkToken from "../contracts/LinkToken";

let web3;

if(window.ethereum){
    web3 = new Web3(window.ethereum);
}

const ROPSTEN_LINK_TOKEN_ADDRESS = "0x20fE562d797A42Dcb3399062AE9546cd06f63280"
const FOREX_TRADE_ADDRESS = "0x5D6793d96e8E3D35b0CD615c0A062190d7c043B4" // dynamic...this is placeholder

export async function transferLink(tradeContractAddress){ // replace FOREX_TRADE_ADDRESS with this param
    const linkTokenContract = await new web3.eth.Contract(LinkToken.abi, ROPSTEN_LINK_TOKEN_ADDRESS);
    await linkTokenContract.methods.transfer(FOREX_TRADE_ADDRESS, web3.utils.toWei('0.1', 'ether')).send({
        from: web3.eth.accounts.givenProvider.selectedAddress
    });

}