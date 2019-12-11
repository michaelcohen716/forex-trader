import Web3 from "web3";
import { ethers } from "ethers";
import LinkToken from "../contracts/LinkToken";

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
}

const ROPSTEN_LINK_TOKEN_ADDRESS = "0x20fE562d797A42Dcb3399062AE9546cd06f63280";
const FOREX_TRADE_ADDRESS = "0x5D6793d96e8E3D35b0CD615c0A062190d7c043B4"; // dynamic...this is placeholder

async function LinkContract() {
  return await new web3.eth.Contract(LinkToken.abi, ROPSTEN_LINK_TOKEN_ADDRESS);
}

export async function transferLink(tradeContractAddress) {
  const linkTokenContract = await LinkContract();
  await linkTokenContract.methods
    .transfer(tradeContractAddress, web3.utils.toWei("0.1", "ether"))
    .send({
      from: web3.eth.accounts.givenProvider.selectedAddress
    });
}

export async function LinkContractEthers() {
  let provider = ethers.getDefaultProvider("ropsten");
  let contract = new ethers.Contract(
    ROPSTEN_LINK_TOKEN_ADDRESS,
    LinkToken.abi,
    provider
  );
  return contract;
}

export async function getPastLinkEvents() {
  const linkTokenContract = await LinkContract();

  const filter = {
    from: "0x5fC4630B22539c1853920c5bE0539b8Ed60EE039",
    topics: [
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    ]
  };
  const past = await linkTokenContract.getPastEvents("Transfer", {
    filter,
    fromBlock: 6945000,
    toBlock: "latest"
  });
  console.log("past", past);
}

export async function getLinkBalance(address) {
  const linkTokenContract = await LinkContract();
  const bal = await linkTokenContract.methods.balanceOf(address).call();
  console.log("bal", bal);
  return bal;
}
