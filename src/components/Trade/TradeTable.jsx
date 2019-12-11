import React, { useState, useEffect, useMemo } from "react";
import { useTable } from "react-table";
import { getTrade } from "../../services/forexTrade";
import Loading from "../common/Loading";
import Web3 from "web3";

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
}

const newTrade = () => {
  return {
    address: "0xirovnr;vrivmovmrpvorpvr",
    notional: "1 ETH",
    initialRate: "",
    pair: "EUR/USD",
    latestRate: "0.934",
    active: "No"
  };
};

const sanitizeTradeData = (data, addr) => {
  const {
    _accountCollateral,
    _counterparties,
    _currencyA,
    _currencyB,
    _notional,
    _rate,
    _initialRate,
    _tradePeriodEnd,
    _tradePeriodStart
  } = data;
  const notInitiated = Number(_notional) === 0;

  let trader1, counterpartyAddress;

  if (_counterparties[1] === "0x0000000000000000000000000000000000000000") {
    trader1 = true;
    counterpartyAddress = "n/a";
  } else {
    if (
      _counterparties[0] === web3.eth.accounts.givenProvider.selectedAddress
    ) {
      trader1 = true;
      counterpartyAddress = _counterparties[1];
    } else {
      trader1 = false;
      counterpartyAddress = _counterparties[0];
    }
  }

  const calcRate = str => Number(str) / 10000;

  return {
    address: addr,
    //   counterpartyAddress.slice(0, 6) + "..." + counterpartyAddress.slice(36),
    notional: notInitiated
      ? "n/a"
      : String(Number(_notional) / 10 ** 18) + " ETH",
    initialRate: notInitiated ? "n/a" : calcRate(_initialRate),
    pair: `${_currencyA}/${_currencyB}`,
    latestRate: calcRate(_rate),
    active: calcRate(_initialRate) === 0 ? "No" : "Yes"
  };
};

const data = ["a", "b", "c"].map(obj => newTrade());
console.log("data", data);

function TradeTable({ trades }) {
  const [tradeData, setTradeData] = useState([]);
  const [loading, toggleLoading] = useState(true);
  useEffect(() => {
    const build = async () => {
      const allTrades = [];
      for (var i = 0; i < trades.length; i++) {
        let trade = await getTrade(trades[i]);
        trade = sanitizeTradeData(trade, trades[i]);
        console.log("trade", trade);
        allTrades.push(trade);
      }
      setTradeData(allTrades);
      toggleLoading(false);
    };
    build();
  }, [trades]);

  const columns = useMemo(() => [
    {
      Header: "Current Trades",
      columns: [
        {
          Header: "Address",
          accessor: "address"
        },
        {
          Header: "Notional",
          accessor: "notional"
        },
        {
          Header: "Pair",
          accessor: "pair"
        },
        {
          Header: "Initial Rate",
          accessor: "initialRate"
        },
        {
          Header: "Latest Rate",
          accessor: "latestRate"
        },
        {
          Header: "Active",
          accessor: "active"
        }
      ]
    }
  ]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mt-4 pb-5">
      <Table columns={columns} data={tradeData} />
    </div>
  );
}

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });

  return (
    <table {...getTableProps()} className="mx-auto">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TradeTable;
