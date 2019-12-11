import React, { useState, useEffect } from "react";
import Headline from "../common/Headline";
import Loading from "../common/Loading";
import InitiateTrade from "./InitiateTrade";
import SubmitButton from "./SubmitButton";
import Select from "react-select";
import {
  createTrade,
  FTFContractEthers
} from "../../services/forexTradeFactory";
import Web3 from "web3";
import "./new.css";

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
}

const TRADE_OPTIONS = ["Long", "Short"];
const CURRENCY_OPTIONS = ["USD", "EUR", "JPY", "GBP"];
const VALUE_OPTIONS = ["0.1", "1", "10", "100"];

const tradeOptions = TRADE_OPTIONS.map(o => {
  return {
    value: o,
    label: o
  };
});

const currencyOptions = CURRENCY_OPTIONS.map(o => {
  return {
    value: o,
    label: o
  };
});

const valueOptions = VALUE_OPTIONS.map(o => {
  return {
    value: o,
    label: o
  };
});

function New() {
  const [txProcessing, toggleTxProcessing] = useState(false);
  const [showConfirm, toggleShowConfirm] = useState(false);

  const [tradeOption, setTradeOption] = useState();
  const [currencyOption, setCurrencyOption] = useState();
  const [currencyOption2, setCurrencyOption2] = useState();
  const [valueOption, setValueOption] = useState();

  const [formFields, toggleFormFields] = useState([false, false, false, false]);

  const [tradeAddress, setTradeAddress] = useState("")

  const setFormFields = idx => {
    const fields = [...formFields];
    fields[idx] = true;
    toggleFormFields(fields);
  };

  const handleTradeChange = selectedOption => {
    setTradeOption(selectedOption);
    setFormFields(0);
  };

  const handleMyAssetChange = selectedOption => {
    setCurrencyOption(selectedOption);
    setFormFields(1);
  };

  const handleCounterpartyAssetChange = selectedOption => {
    setCurrencyOption2(selectedOption);
    setFormFields(2);
  };

  const handleValueChange = selectedOption => {
    setValueOption(selectedOption);
    setFormFields(3);
  };

  const submitTransaction = async () => {
    const firstCurr =
      tradeOption === TRADE_OPTIONS[0] ? currencyOption : currencyOption2;
    const secondCurr =
      tradeOption === TRADE_OPTIONS[0] ? currencyOption2 : currencyOption;

    toggleTxProcessing(true);

    const contr = await FTFContractEthers();
    contr.on("TradeCreated", (oldValue, newValue, event) => {
      console.log("TRADE CREATED");
      toggleTxProcessing(false);
      toggleShowConfirm(true);
      setTradeAddress(event.args.tradeContract)
    });

    await createTrade(firstCurr.value, secondCurr.value);
  };

  if(txProcessing){
    return <Loading />
  }

  if (showConfirm) {
    return (
      <InitiateTrade
        notional={"1"}
        trade={"long"}
        currencyA={"USD"}
        currencyB={"EUR"}
        tradeAddress={tradeAddress}
      />
    );
  }

  return (
    <div className="d-flex flex-column">
      <Headline text="Build a New Trade" />
      <div className="option-line d-flex mx-auto mt-3">
        <div className="d-flex">
          <div className="decision-point my-auto">I want to go</div>
          <Select
            className="react-select-container ml-2"
            value={tradeOption}
            onChange={handleTradeChange} // trade
            options={tradeOptions}
            placeholder="Position"
          />
          <Select
            className="react-select-container ml-2"
            value={currencyOption}
            onChange={handleMyAssetChange} //myasset
            options={currencyOptions}
            placeholder="Currency"
          />
        </div>
      </div>
      <div
        className={`option-line d-flex mx-auto mt-4 ${(!formFields[1] ||
          !formFields[0]) &&
          "add-opacity"}`}
      >
        <div className="d-flex">
          <div className="decision-point my-auto">trading against</div>
          <Select
            className="react-select-container ml-2"
            value={currencyOption2}
            onChange={handleCounterpartyAssetChange} //counterpartyasset
            options={currencyOptions.filter(curr => curr !== currencyOption)}
            isDisabled={!formFields[1] || !formFields[0]}
            placeholder="Currency"
          />
        </div>
      </div>
      <div
        className={`option-line d-flex mx-auto mt-4 ${!formFields[2] &&
          "add-opacity"}`}
      >
        <div className="d-flex">
          <div className="decision-point my-auto">at a notional value of</div>
          <Select
            className="react-select-container ml-2"
            value={valueOption}
            onChange={handleValueChange}
            options={valueOptions}
            placeholder="Value"
          />
          <div className="decision-point my-auto ml-2">ETH.</div>
        </div>
      </div>
      <div
        className={`option-line d-flex mx-auto mt-4 ${!formFields[3] &&
          "add-opacity"}`}
      >
        <div className="d-flex">
          <div className="decision-point my-auto">
            I will submit {valueOption ? Number(valueOption.value / 10) : 0} ETH
            as collateral in the next step.
          </div>
        </div>
      </div>
      <SubmitButton
        onClick={submitTransaction}
        disabled={formFields.filter(ff => ff === false).length}
      />
    </div>
  );
}

export default New;
