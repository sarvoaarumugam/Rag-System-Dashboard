import { SetStateAction, useEffect, useState } from "react";
import { useWebSocketEvent } from "../../hooks/UseWebSocketEvent";
import { AgentStrategyReportType } from "../../types/strategyAgent/StrategyAgentType";
import StrategyAgentReportTable from "./StrategyAgentReportTable";
import TitleHeading from "../common/TitleHeading";
import { useParams } from "react-router-dom";
import { useWebSocketContext } from "../../context/WebSocketContext";
import StrategyAgentReportStatus from "./StrategyAgentReportStatus";

import StrategyTradesTable from "../strategy-tester/reports/StrategyTradesTable";
import { JsonKeyFormatter } from "../../utils/TextFormatter";
// ---------- Collapsible helper (supports global control and force-sync) ----------
const Collapsible: React.FC<{
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  globalOpen?: boolean;
  forceToggle?: number;
}> = ({ title, defaultOpen = true, children, globalOpen, forceToggle }) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  useEffect(() => {
    if (typeof globalOpen === "boolean") {
      setOpen(globalOpen);
    }
  }, [globalOpen]);
  useEffect(() => {
    if (typeof globalOpen === "boolean") {
      setOpen(globalOpen);
    }
  }, [forceToggle]);

  return (
    <div className="w-full">
      <div
        onClick={() => setOpen((s) => !s)}
        className="cursor-pointer select-none flex items-center justify-between mb-3"
      >
        <TitleHeading titleProp={title} />
        <button
          aria-expanded={open}
          className="px-4 py-1 rounded-lg text-sm font-medium shadow-sm bg-indigo-100 text-indigo-600 border border-indigo-300 hover:bg-indigo-200"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((s) => !s);
          }}
        >
          {open ? "Hide" : "View"}
        </button>
      </div>
      <div className={`${open ? "block" : "hidden"} transition-all`}>
        {children}
      </div>
    </div>
  );
};
// ---------- end Collapsible ----------

interface StrategyAgentMetricsProps {
  setIsProcessingProp: React.Dispatch<SetStateAction<boolean>>;
  isProcessingProp: boolean;
}

const SHOW_KEYS = new Set([
  "impulse_window",
  "impulse_percentage",
  "take_profit",
  "stop_loss",
]);

const StrategyAgentMetrics: React.FC<StrategyAgentMetricsProps> = ({
  isProcessingProp,
  setIsProcessingProp,
}) => {
  const rawData = useWebSocketEvent("multi_backtest_orderblocks");
  const rawLoadedData = useWebSocketEvent("load_multi_backtest_report");
  const [reportData, setReportData] = useState<AgentStrategyReportType>();
  // replace existing states:
  const [allOpen, setAllOpen] = useState<boolean>(true);
  const [groupOpen, setGroupOpen] = useState<boolean>(false);
  const [forceToggle, setForceToggle] = useState<number>(0);
  const [tpOpen, setTpOpen] = useState<boolean>(false);
  const [prOpen, setPrOpen] = useState<boolean>(false);
  const [bestOpen, setBestOpen] = useState<boolean>(true);
  const [bestOpenTrades, setBestOpenTrades] = useState<boolean>(false);

  const { agent_report_id } = useParams();
  const { client } = useWebSocketContext();

  useEffect(() => {
    if (rawData !== null) {
      setIsProcessingProp(false);
      setReportData(rawData);
    }
  }, [rawData]);

  useEffect(() => {
    if (agent_report_id) {
      if (client?.isConnected()) {
        setIsProcessingProp(true);
        client?.send({
          type: "load_multi_backtest_report",
          data: { redis_key: agent_report_id },
        });
      }
    }
  }, []);

  useEffect(() => {
    if (
      agent_report_id &&
      rawLoadedData &&
      agent_report_id === rawLoadedData?.redis_key
    ) {
      setReportData(rawLoadedData);
      setIsProcessingProp(false);
    }
  }, [rawLoadedData]);

  useEffect(() => {
    if (isProcessingProp && reportData) {
      setReportData(undefined);
    }
  }, [isProcessingProp]);

  return (
    <div>
      {isProcessingProp && <StrategyAgentReportStatus />}
      {!reportData && !isProcessingProp && (
        <div className="text-2xl font-semibold max-w-[480px] mx-auto text-black/20 h-[calc(100vh-160px)] text-center flex items-center justify-center">
          Find the best parameters & analyse the strategy
        </div>
      )}
      {reportData && (
        <div className="flex flex-col gap-5">
          {/* compact master + group toggles */}
          <div className="flex justify-end items-center gap-3 mb-2">
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors
      ${
        allOpen
          ? "bg-red-100 text-red-600 border border-red-300 hover:bg-red-200"
          : "bg-green-100 text-green-600 border border-green-300 hover:bg-green-200"
      }`}
                onClick={() => {
                  setAllOpen((prev) => {
                    const next = !prev;
                    setGroupOpen(next);
                    setTpOpen(next);
                    setPrOpen(next);
                    setBestOpen(next);
                    setBestOpenTrades(next);
                    setForceToggle((f) => f + 1);
                    return next;
                  });
                }}
              >
                {allOpen ? "Hide All" : "View All"}
              </button>

              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors
      ${
        groupOpen
          ? "bg-blue-100 text-blue-600 border border-blue-300 hover:bg-blue-200"
          : "bg-indigo-100 text-indigo-600 border border-indigo-300 hover:bg-indigo-200"
      }`}
                onClick={() => {
                  setGroupOpen((prev) => {
                    const next = !prev;
                    setForceToggle((f) => f + 1);
                    return next;
                  });
                }}
              >
                {groupOpen ? "Hide Parameters" : "View Parameters"}
              </button>
            </div>
          </div>

          <Collapsible
            title="Agent Report Parameters"
            globalOpen={groupOpen}
            forceToggle={forceToggle}
            defaultOpen={false}
          >
            {/* ----- top-level parameters grid ----- */}
            <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-5 md:grid-cols-2 gap-2">
              {Object.entries(reportData.optimization_config).map(
                ([key, value]) => {
                  if (key === "parameter_ranges") return null;
                  return (
                    <div
                      key={key}
                      className="border flex flex-col py-6 rounded-2xl items-center justify-center text-center xl:gap-1 min-h-[120px]"
                    >
                      <span className="font-semibold whitespace-normal leading-snug">
                        {JsonKeyFormatter(key)}
                      </span>
                      <span className="text-black/50 mt-3">
                        {value !== null && typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                      </span>
                    </div>
                  );
                }
              )}
            </div>

            {/* ----- Take Profit Configs subsection (now inside Agent Report Parameters) ----- */}
            <div className="mt-6">
              <Collapsible
                title="Take Profit Configs"
                globalOpen={tpOpen}
                forceToggle={forceToggle}
                defaultOpen={false}
              >
                <div className="space-y-6">
                  {(() => {
                    const pr = reportData.optimization_config.parameter_ranges;
                    if (!pr?.take_profit_configs?.length) return null;

                    const fields = [
                      { key: "tp_min", label: "Take Profit Minimum" },
                      { key: "tp_max", label: "Take Profit Maximum" },
                      { key: "tp_step", label: "Take Profit Step" },
                      { key: "position_min", label: "Position Minimum" },
                      { key: "position_max", label: "Position Maximum" },
                      { key: "position_step", label: "Position Step" },
                    ];

                    return pr.take_profit_configs.map(
                      (cfg: any, idx: number) => (
                        <div key={idx} className="border rounded-2xl p-6">
                          <div className="text-lg font-semibold text-center mb-4">
                            TP config #{idx + 1}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {fields.map(({ key, label }) => (
                              <div
                                key={key}
                                className="border rounded-lg p-3 flex flex-col items-center min-h-[80px]"
                              >
                                <span className="font-semibold text-sm">
                                  {label}
                                </span>
                                <span className="text-xs text-black/60 mt-2">
                                  {cfg[key] ?? "-"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    );
                  })()}
                </div>
              </Collapsible>
            </div>

            {/* ----- Parameter Ranges subsection (now inside Agent Report Parameters) ----- */}
            <div className="mt-6">
              <Collapsible
                title="Parameter Ranges"
                globalOpen={prOpen}
                forceToggle={forceToggle}
              >
                <div className="grid grid-cols-1 top-10 xl:grid-cols-3 2xl:grid-cols-4 md:grid-cols-2 gap-2">
                  {(() => {
                    const pr = reportData.optimization_config.parameter_ranges;
                    if (!pr) return null;
                    const items = [
                      {
                        key: "impulse_window",
                        label: "Impulse Window",
                        val: pr.impulse_window,
                      },
                      {
                        key: "impulse_percentage",
                        label: "Impulse Percentage",
                        val: pr.impulse_percentage,
                      },
                      {
                        key: "stop_loss",
                        label: "Stop Loss",
                        val: pr.stop_loss,
                      },
                      {
                        key: "tp_combinations_tested",
                        label: "Tp Combinations Tested",
                        val:
                          pr.tp_combinations_tested ??
                          pr.tp_combinations_tested,
                      },
                    ];
                    return items.map((it) => (
                      <div
                        key={it.key}
                        className="border flex flex-col py-8 rounded-2xl items-center justify-center text-center xl:gap-1 min-h-[120px]"
                      >
                        <span className="font-semibold">{it.label}</span>
                        <span className="text-black/50">
                          {it.val !== undefined && it.val !== null
                            ? String(it.val)
                            : "-"}
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              </Collapsible>
            </div>
          </Collapsible>

          {/* ---------- end insert ---------- */}
          <Collapsible
            title="Best Strategy Parameters"
            globalOpen={bestOpen}
            forceToggle={forceToggle}
            defaultOpen={false}
          >
            <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 md:grid-cols-2 2xl:gap-4 gap-2">
              {Object.entries(reportData.best_parameters || {}).map(
                ([key, value]) => {
                  if (!SHOW_KEYS.has(key)) return null;

                  // make a consistent, centered card for every parameter
                  return (
                    <div key={key} className="w-full">
                      <div className="border flex flex-col py-6 rounded-2xl items-center justify-center text-center xl:gap-1 min-h-[120px]">
                        <span className="font-semibold whitespace-normal leading-snug">
                          {JsonKeyFormatter(key)}
                        </span>
                        <span className="text-black/50 mt-3">
                          {value !== null && typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                        </span>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </Collapsible>

          <Collapsible
            title="Agent Report Data"
            globalOpen={allOpen}
            forceToggle={forceToggle}
          >
            <StrategyAgentReportTable dataProp={reportData} />
          </Collapsible>

          {reportData.best_parameters?.trades && (
            <Collapsible
              title="Best Strategy Parameter Trades"
              globalOpen={bestOpenTrades}
              forceToggle={forceToggle}
            >
              <StrategyTradesTable
                data={reportData.best_parameters.trades}
                configProp={{
                  symbol: reportData.optimization_config.symbol,
                  timeframe: reportData.optimization_config.timeframe,
                  start_date: reportData.optimization_config.start_date,
                  end_date: reportData.optimization_config.end_date,
                  ob_type: reportData.optimization_config.ob_type,
                  impulse_window:
                    reportData.best_parameters.impulse_window.toString(),
                  impulse_percentage:
                    reportData.best_parameters.impulse_percentage.toString(),
                  take_profit:
                    reportData.best_parameters.take_profit.toString(),
                  stop_loss: reportData.best_parameters.stop_loss.toString(),
                }}
                timeframeProp={reportData.optimization_config.timeframe}
              />
            </Collapsible>
          )}
        </div>
      )}
    </div>
  );
};

export default StrategyAgentMetrics;
