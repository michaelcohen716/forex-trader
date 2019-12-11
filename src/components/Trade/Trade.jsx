import React, { useState, useEffect } from "react";
import Headline from "../common/Headline";
import Loading from "../common/Loading";
import AcceptTrade from "./AcceptTrade";
import TradeTable from "./TradeTable";
import Web3 from "web3";
import { getTradesByAddress } from "../../services/forexTradeFactory";
// import "./new.css";

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
}

function Trade() {
  const [loading, toggleLoading] = useState(true);
  const [myTrades, setMyTrades] = useState([]);

  useEffect(() => {
    const getTrades = async () => {
      setTimeout(async () => {
        const addr = web3.eth.accounts.givenProvider.selectedAddress;
        const trades = await getTradesByAddress(addr);
        console.log("trades", trades);

        setMyTrades(trades.reverse());
        toggleLoading(false);
        // const pastEvents = await getPastTradeEvents(addr)
        // console.log('pastEvents', pastEvents);
      }, 500);
    };
    getTrades();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="d-flex flex-column trade-table">
      <Headline text="Trade" />
      <AcceptTrade />
      <TradeTable trades={myTrades} />
    </div>
  );
}

export default Trade;
