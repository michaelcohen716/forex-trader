import React, { useState, useEffect } from "react";
import Headline from "../common/Headline";
import Loading from "../common/Loading";
import OptionLine from "./OptionLine";
import SubmitButton from "./SubmitButton";
import Select from "react-select";
import { withRouter } from "react-router";
import { initiateTrade, FTContractEthers } from "../../services/forexTrade";

const WEEKS_OPTIONS = ["1", "4", "12", "20"];

const weeksOptions = WEEKS_OPTIONS.map(o => {
  return {
    value: o,
    label: o
  };
});

function InitiateTrade({
  notional,
  trade,
  currencyA,
  currencyB,
  tradeAddress,
  history
}) {
  const [tradeLengthWeeks, setTradeLengthWeeks] = useState("");
  const [txProcessing, toggleTxProcessing] = useState(false);

  const handleWeeksValueChange = selectedOption => {
    setTradeLengthWeeks(selectedOption);
  };

  const initiate = async () => {
    const contr = await FTContractEthers(tradeAddress);
    contr.on("TradeInitiated", () => {
      toggleTxProcessing(false);
      history.push("/trade");
    });

    toggleTxProcessing(true);

    const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
    const timeUntilEnd = Number(tradeLengthWeeks.value) * WEEK_IN_SECONDS;
    const tradePeriodEnd = Math.ceil(Date.now() / 1000) + timeUntilEnd;

    await initiateTrade(tradeAddress, notional, String(tradePeriodEnd));
  };

  if (txProcessing) {
    return <Loading />;
  }

  return (
    <div className="d-flex flex-column">
      <Headline text="Initiate Trade" />
      <OptionLine>
        My trade's address: <code>{tradeAddress}</code>
      </OptionLine>
      <OptionLine>
        I'm going {trade} {currencyA} vs. {currencyB}
      </OptionLine>
      <OptionLine>I'm depositing {Number(notional) / 10} ETH</OptionLine>
      <OptionLine>
        <div className="d-flex">
          for a trade that expires in
          <Select
            className="react-select-container ml-2"
            value={tradeLengthWeeks}
            onChange={handleWeeksValueChange} // trade
            options={weeksOptions}
            placeholder="Num"
          />
          <div className="ml-2">weeks</div>
        </div>
      </OptionLine>
      <SubmitButton onClick={initiate} disabled={!tradeLengthWeeks} />
    </div>
  );
}

export default withRouter(InitiateTrade);
