import React, { useState } from "react";
import Headline from "../common/Headline";
import Select from "react-select";
import "./new.css";

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
  const [tradeOption, setTradeOption] = useState();
  const [currencyOption, setCurrencyOption] = useState();
  const [currencyOption2, setCurrencyOption2] = useState();
  const [valueOption, setValueOption] = useState();

  const [formFields, toggleFormFields] = useState([false, false, false, false]);

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

  console.log("formfields", formFields);

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
            I will submit {valueOption ? Number(valueOption.value / 10) : 0} ETH as collateral.
          </div>
        </div>
      </div>
      <button
        className="submit-button mx-auto mt-4 p-2"
        disabled={formFields.filter(ff => ff === false).length}
      >
        Submit
      </button>
    </div>
  );
}

export default New;
