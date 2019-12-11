import React, { useState, useMemo } from "react";
import { useTable } from "react-table";

const newTrade = () => {
  return {
    address: "0xirovnr;vrivmovmrpvorpvr",
    notional: "1 ETH",
    originated: "Dec 28",
    pair: "EUR/USD",
    latestRate: "0.934",
    initiated: "No"
  };
};

const data = ["a", "b", "c"].map(obj => newTrade());
console.log("data", data);

function TradeTable() {
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
          Header: "Originated",
          accessor: "originated"
        },
        {
          Header: "Pair",
          accessor: "pair"
        },
        {
          Header: "Latest Rate",
          accessor: "latestRate"
        },
        {
          Header: "Initiated",
          accessor: "initiated"
        }
      ]
    }
  ]);

  return (
    <div className="mt-4">
      <Table columns={columns} data={data} />
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
