import React from "react";
import { Table } from "antd";

const StatsTable = ({ type, data, currentId }) => {
  const columns =
    type === "batting"
      ? [
          {
            title: "BATSMAN",
            dataIndex: "batsman",
            render: (t, r) => (
              <div className="flex flex-col">
                <span
                  className={
                    r.id === currentId
                      ? "text-orange-500 font-black"
                      : "font-bold"
                  }
                >
                  {t} {r.id === currentId && "*"}
                </span>
                {r.isOut && (
                  <span className="text-[10px] text-zinc-400 uppercase tracking-tighter">
                    Out
                  </span>
                )}
              </div>
            ),
          },
          {
            title: "R",
            dataIndex: "runs",
            align: "right",
            className: "font-mono font-black",
          },
          {
            title: "B",
            dataIndex: "balls",
            align: "right",
            className: "font-mono text-zinc-400",
          },
          {
            title: "4s",
            dataIndex: "fours",
            align: "right",
            className: "font-mono",
          },
          {
            title: "6s",
            dataIndex: "sixes",
            align: "right",
            className: "font-mono",
          },
          {
            title: "SR",
            dataIndex: "strikeRate",
            align: "right",
            className: "font-mono font-bold",
          },
        ]
      : [
          {
            title: "BOWLER",
            dataIndex: "bowler",
            render: (t, r) => (
              <span
                className={
                  r.id === currentId
                    ? "text-orange-500 font-black"
                    : "font-bold"
                }
              >
                {t}
              </span>
            ),
          },
          {
            title: "O",
            dataIndex: "overs",
            align: "right",
            className: "font-mono font-bold",
          },
          {
            title: "M",
            dataIndex: "maidens",
            align: "right",
            className: "font-mono text-zinc-400",
          },
          {
            title: "R",
            dataIndex: "runs",
            align: "right",
            className: "font-mono",
          },
          {
            title: "W",
            dataIndex: "wickets",
            align: "right",
            className: "text-red-500 font-bold",
          },
          {
            title: "ECO",
            dataIndex: "economy",
            align: "right",
            className: "font-mono font-bold",
          },
        ];

  return (
    <div className="stats-table-wrapper">
      <Table
        dataSource={data}
        pagination={false}
        rowKey="id"
        size="small"
        columns={columns}
        className="custom-admin-table text-xs md:text-sm"
      />
    </div>
  );
};

export default StatsTable;
