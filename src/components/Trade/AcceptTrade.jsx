import React, { useState } from "react";
import {
  acceptTrade,
  FTContractEthers,
  updateRates,
  getTrade
} from "../../services/forexTrade";
import { transferLink, LinkContractEthers } from "../../services/link";
import { isValidAddress } from "../../utils";
import Loading from "../common/Loading";
import Web3 from "web3";
import flip from "../../assets/flip.png";
import "./Trade.css";

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
}

function AcceptTrade() {
  const [tradeAddress, setTradeAddress] = useState("");
  const [txProcessing, toggleTxProcessing] = useState(false);
  const [transferProcessing, toggleTransferProcessing] = useState(false);

  const [acceptView, toggleAcceptView] = useState(true);

  const accept = async e => {
    e.preventDefault();
    toggleTxProcessing(true);

    const contr = await FTContractEthers(tradeAddress);
    contr.on("TradeAccepted", (oldValue, newValue, event) => {
      toggleTxProcessing(false); // event not catchin
    });

    await acceptTrade(tradeAddress);
  };

  const update = async e => {
    e.preventDefault();
    toggleTxProcessing(true);

    const contr = await FTContractEthers(tradeAddress);
    contr.on("TradeRepriced", (oldVal, newVal, event) => {
      toggleTxProcessing(false);
    });

    await updateRates(tradeAddress);
  };

  const fundLink = async () => {
    if (isValid()) {
      toggleTransferProcessing(true);
      setTimeout(() => {
        toggleTransferProcessing(false);
      }, 15000);

      await transferLink(tradeAddress);
    }
  };

  const isValid = () => {
    return isValidAddress(tradeAddress);
  };

  if (txProcessing) {
    return <Loading />;
  }

  return (
    <div className="mx-auto d-flex flex-column">
      <form className="d-flex my-auto">
        <input
          value={tradeAddress}
          onChange={e => setTradeAddress(e.target.value)}
          className="address-input px-2"
          placeholder="Trade Address"
        />
        <button
          className="accept-button ml-2"
          onClick={acceptView ? accept : update}
          disabled={!isValid()}
        >
          {acceptView ? "Accept Trade" : "Update Price"}
        </button>
        <img
          src={flip}
          className="img-fluid flip-img my-auto ml-2"
          onClick={() => toggleAcceptView(!acceptView)}
        />
      </form>
      {transferProcessing ? (
        <div className="transfer-text">Processing...</div>
      ) : (
        <div
          className={`transfer-text ${!isValid() && "inactive-transfer"}`}
          onClick={fundLink}
        >
          Transfer LINK
        </div>
      )}
    </div>
  );
}

export default AcceptTrade;
