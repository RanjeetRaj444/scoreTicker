import React, { useState } from "react";
import { Button, Select, Space, Divider, Tooltip, Tag, Typography } from "antd";
import { ballActions, ballExtras, wicketTypes } from "../constants/enums";
import {
  SwapOutlined,
  UndoOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";

const { Text } = Typography;

const BallActionPanel = ({
  currentBowler,
  currentBatter,
  bowlingPlayingXI,
  battingPairs,
  prevBowler,
  handleBowlerAdding,
  handleCurrentBatter,
  selectedExtra,
  handleActionClick,
  selectedAction,
  handleBallActionSubmit,
  handleUndo,
  overs,
}) => {
  const [wicketType, setWicketType] = useState(null);
  const isBallDisabled = !currentBowler?.player || !currentBatter?.player;
  const isWicketSelected = selectedAction?.name === "W";

  const nonStriker = battingPairs?.find((p) => p._id !== currentBatter?._id);

  return (
    <section className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-zinc-100 relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-zinc-900 rounded-2xl">
            <h3 className="text-orange-500 font-black text-lg m-0 leading-none">
              OVER {overs}
            </h3>
          </div>
          <div className="hidden sm:block">
            <h2 className="text-xl font-black uppercase italic tracking-tight m-0 text-zinc-900">
              Scoring Engine
            </h2>
            <Text className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Real-time Broadcast Control
            </Text>
          </div>
        </div>
        <Tag
          color="gold"
          className="rounded-full px-4 py-1 font-black text-[10px] uppercase border-none shadow-sm"
        >
          Live
        </Tag>
      </div>

      <div className="space-y-8 flex-1">
        {/* Active Combatants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TeamOutlined className="text-5xl" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Current Batter
                </span>
                {currentBatter && (
                  <Tag
                    color="orange"
                    className="font-black text-[9px] uppercase m-0"
                  >
                    Striker
                  </Tag>
                )}
              </div>
              <Select
                className="w-full h-12"
                placeholder="Assign Striker"
                value={
                  currentBatter ? JSON.stringify(currentBatter) : undefined
                }
                onChange={handleCurrentBatter}
                options={battingPairs?.map((p) => ({
                  label: p.player?.name,
                  value: JSON.stringify(p),
                }))}
              />
              {nonStriker && (
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
                    Non-Striker:
                  </span>
                  <span className="text-xs font-bold text-zinc-500">
                    {nonStriker.player?.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ThunderboltFilled className="text-5xl text-orange-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  In Attack
                </span>
                {currentBowler && (
                  <Tag
                    color="orange"
                    className="font-black text-[9px] uppercase m-0"
                  >
                    Bowling
                  </Tag>
                )}
              </div>
              <Select
                className="w-full h-12"
                placeholder="Select Bowler"
                value={
                  currentBowler ? JSON.stringify(currentBowler) : undefined
                }
                onChange={handleBowlerAdding}
                options={bowlingPlayingXI
                  ?.filter((p) => p.player?._id !== prevBowler)
                  .map((p) => ({
                    label: p.player?.name,
                    value: JSON.stringify(p),
                  }))}
              />
            </div>
          </div>
        </div>

        <Divider className="my-0 border-zinc-50" />

        {/* Scoring Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] m-0">
                Runs Selection
              </h4>
              <Tooltip title="Swap Strike">
                <Button
                  shape="circle"
                  icon={<SwapOutlined />}
                  className="bg-zinc-100 border-none hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                  onClick={() => handleActionClick({ name: "swap" }, "action")}
                  disabled={isBallDisabled}
                />
              </Tooltip>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {ballActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleActionClick(action, "action")}
                  disabled={isBallDisabled}
                  className={`h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center ${
                    selectedAction === action
                      ? "bg-zinc-900 text-white shadow-2xl scale-110 z-10"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  } ${action.name === "W" ? "text-red-600 ring-2 ring-transparent hover:ring-red-100" : ""}`}
                >
                  {action.name}
                </button>
              ))}
            </div>

            {isWicketSelected && (
              <div className="animate-slide-up p-5 bg-red-50 rounded-2xl border border-red-100">
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block mb-3">
                  Dismissal Particulars
                </span>
                <Select
                  className="w-full h-12"
                  placeholder="Select Wicket Type"
                  onChange={setWicketType}
                  options={wicketTypes.map((t) => ({ label: t, value: t }))}
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] m-0">
              Extras / Infractions
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {ballExtras.map((extra, i) => (
                <button
                  key={i}
                  onClick={() => handleActionClick(extra, "extra")}
                  disabled={isBallDisabled}
                  className={`h-16 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                    selectedExtra === extra
                      ? "bg-orange-500 text-black shadow-2xl scale-105 z-10"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {extra.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 mt-auto">
          <Button
            className="flex-[3] h-20 bg-orange-500 text-black font-black text-xl rounded-3xl border-none hover:!bg-orange-600 shadow-2xl shadow-orange-500/40 transition-all active:scale-95 flex items-center justify-center gap-4 group"
            disabled={
              (!selectedAction && !selectedExtra) ||
              isBallDisabled ||
              (isWicketSelected && !wicketType)
            }
            onClick={() => {
              handleBallActionSubmit(wicketType);
              setWicketType(null);
            }}
          >
            <CheckCircleOutlined className="text-2xl" />
            <span className="uppercase tracking-widest">Commit Delivery</span>
          </Button>

          <Button
            className="flex-1 h-20 bg-zinc-900 text-white rounded-3xl border-none font-black uppercase tracking-widest text-xs flex flex-col items-center justify-center gap-1 hover:!bg-black shadow-xl"
            onClick={handleUndo}
          >
            <UndoOutlined className="text-lg" />
            <span>Undo Ball</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BallActionPanel;
