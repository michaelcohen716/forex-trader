import React, { useState } from "react";
import Headline from "../common/Headline";
import Select from "react-select";
import "./new.css";

const TRADE_OPTIONS = ["Long", "Short"];
const CURRENCY_OPTIONS = ["USD", "EUR", "JPY", "GBP"]
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
  const [valueOption, setValueOption] = useState();

  const handleTradeChange = selectedOption => {
    setTradeOption(selectedOption);
  };

  const handleCurrencyChange = selectedOption => {
    setCurrencyOption(selectedOption);
  };

  const handleValueChange = selectedOption => {
    setValueOption(selectedOption);
  };

  console.log('trade option', tradeOption)
  console.log('currency option', currencyOption)
  console.log('value option', valueOption)

  return (
    <div className="d-flex flex-column">
      <Headline text="Build a New Trade" />
      <div className="option-line d-flex mx-auto mt-3">
        <div className="d-flex">
          <div className="decision-point my-auto">I want to go</div>
          <Select
            className="react-select-container ml-2"
            value={tradeOption}
            onChange={handleTradeChange}
            options={tradeOptions}
            placeholder="Position"
            />
          <Select
            className="react-select-container ml-2"
            value={currencyOption}
            onChange={handleCurrencyChange}
            options={currencyOptions}
            placeholder="Currency"
            />
        </div>
      </div>
      <div className="option-line d-flex mx-auto mt-4">
        <div className="d-flex">
          <div className="decision-point my-auto">trading against</div>
          <Select
            className="react-select-container ml-2"
            value={tradeOption}
            onChange={handleTradeChange}
            options={tradeOptions}
            placeholder="Currency"
          />
        </div>
      </div>
      <div className="option-line d-flex mx-auto mt-4">
        <div className="d-flex">
          <div className="decision-point my-auto">at a notional value of</div>
          <Select
            className="react-select-container ml-2"
            value={valueOption}
            onChange={handleValueChange}
            options={valueOptions}
            placeholder="Value"
          />
          <div className="decision-point my-auto ml-2">ETH</div>
        </div>
      </div>
    </div>
  );
}

export default New;
