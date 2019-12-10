import React from "react";
import Web3 from "web3";
import {
  createTrade,
  getTradesByAddress,
  initiateTrade,
  acceptTrade
} from "./services/forexTradeFactory";
import { transferLink } from "./services/link";
import Home from "./components/Home";
import TopNav from "./components/TopNav";
import "./App.css";


let web3;

if(window.ethereum){
    web3 = new Web3(window.ethereum);
}
const tradeContractAddress = "0x5D6793d96e8E3D35b0CD615c0A062190d7c043B4";
const endTrade = 1580601600; // timestamp for 2/2/20 - placeholder for now

const notional = 0.1; //eth

function App() {
  return (
    <div className="App d-flex flex-column">
      <TopNav />
      <Home />
      {/* <button onClick={() => createTrade("USD", "EUR")}>createTrade</button>
      
      <button onClick={() => getTradesByAddress(web3.eth.accounts.givenProvider.selectedAddress)}>  
        getTrades by address
      </button>
      <button onClick={() => initiateTrade(tradeContractAddress, notional, endTrade)}>  
        initiateTrade
      </button>
      <button onClick={() => acceptTrade(tradeContractAddress)}>  
        acceptTrade
      </button>
      <button onClick={() => transferLink()}>  
        transferLink
      </button>

      <button onClick={window.ethereum.enable}>
        Enable Web3
      </button> */}
    </div>
  );
}

export default App;
