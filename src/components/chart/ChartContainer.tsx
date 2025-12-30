import Chart from "../../components/chart/Chart";
import { ChartConfigType, useChartsContext } from "../../context/ChartsContext";
import {
  ChevronDown,
  ChevronUp,
  Maximize,
  Minimize,
  Settings,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useWebSocketContext } from "../../context/WebSocketContext";
import { useWebSocketEvent } from "../../hooks/UseWebSocketEvent";
import Suggestions from "./suggestions/Suggestions";
import { ObSuggestionsContextProvider } from "../../context/ObSuggestionsContext";
import { useIndividualChartContext } from "../../context/IndividualChartContext";
import UpdateChartPopup from "./UpdateChartPopup";
import ActiveTrades from "./logging/ActiveTrades";
import InPriceStrategyChart from "./inPriceStrategy/InPriceStrategyChart";
import UpdateInPriceChartPopup from "./inPriceStrategy/UpdateInPriceChartPopup";
import { StrategyType } from "../../types/StrategyTypes";

interface ChartContainerProps {
  chartConfigProp: ChartConfigType;
  strategyProp: StrategyType;
  symbol?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  chartConfigProp,
  strategyProp,
}) => {
  const { setChartsConfigs, setFullscreenConfig, setFullscreen, fullscreen } =
    useChartsContext();
  const { expandSuggestions } = useIndividualChartContext();

  const [expandedChart, setExpandedChart] = useState<boolean>(false);

  const [compareSelected, setCompareSelected] = useState<boolean>(false);

  const [updateConfigPopupVisibility, setUpdateConfigPopupVisibility] =
    useState<boolean>(false);

  const { setChartConfig } = useIndividualChartContext();
  const { client } = useWebSocketContext();
  const deleteConfirmation =
    strategyProp === "ob-strategy"
      ? useWebSocketEvent("delete_chart_config")
      : useWebSocketEvent("delete_in_price_chart_config");

  // Sets the Individual Chart Context
  useEffect(() => {
    if (chartConfigProp !== null) {
      console.log("Setting the chart config");
      setChartConfig(chartConfigProp);
    }
  }, [chartConfigProp]);

  useEffect(() => {
    if (
      deleteConfirmation?.status === "success" &&
      deleteConfirmation?.deleted_configs[0].symbol ===
        chartConfigProp.symbol &&
      deleteConfirmation?.deleted_configs[0].timeframe ===
        chartConfigProp.timeframe
    ) {
      console.log(
        `Deleting the chart configuration : ${chartConfigProp.symbol} ${chartConfigProp.timeframe}`
      );
      setChartsConfigs((prev) =>
        prev.filter(
          (config) =>
            !(
              config.symbol === chartConfigProp.symbol &&
              config.timeframe === chartConfigProp.timeframe
            )
        )
      );
    }
  }, [deleteConfirmation]);

  const handleDeleteChart = () => {
    if (client?.isConnected()) {
      client.send({
        type:
          strategyProp === "ob-strategy"
            ? "delete_chart_config"
            : "delete_in_price_chart_config",
        data: {
          symbol: chartConfigProp.symbol,
          timeframe: chartConfigProp.timeframe,
        },
      });
    }
  };

  useEffect(() => {
    if (fullscreen) {
      setExpandedChart(true);
    }
  }, [fullscreen]);

  const handleFullScreen = (fullScreen: boolean) => {
    if (fullScreen) {
      setFullscreen(fullScreen);
      setFullscreenConfig(chartConfigProp);
    } else {
      setFullscreen(fullScreen);
      setFullscreenConfig(null);
    }
  };

  return (
    <ObSuggestionsContextProvider>
      <div
        className={`flex flex-col gap-6 border rounded-lg p-6 ${
          fullscreen ? "h-full" : ""
        }`}
      >
        {/* Header */}
        <div className="flex w-full justify-between">
          {/* Symbol & TimeFrame */}
          <button
            className="flex items-center justify-start gap-4  hover:opacity-50"
            onClick={() => setExpandedChart((prev) => !prev)}
          >
            {expandedChart ? <ChevronUp /> : <ChevronDown />}
            <div className="text-xl font-semibold ">
              {chartConfigProp.symbol}
            </div>
            <div className="border h-full"></div>
            <div className="text-xl">{chartConfigProp.timeframe}</div>
          </button>
          {/* Buttons */}
          <div className="flex gap-4 items-center">
            {expandedChart && (
              <>
                {/* Settings Button */}
                <button
                  className="rounded-full group bg-blue-100 cursor-pointer text-blue-500 h-10 w-10 flex items-center justify-center p-1 hover:opacity-50"
                  onClick={() => setUpdateConfigPopupVisibility(true)}
                >
                  <Settings className="group-hover:rotate-90 transition-transform duration-500 ease-in-out" />
                </button>
              </>
            )}

            {/* Active Trades */}
            <ActiveTrades />

            {/* Maximize Button */}
            <button
              className="group rounded-full  bg-blue-100 cursor-pointer text-blue-500 h-10 w-10 flex items-center justify-center p-1 hover:opacity-50"
              onClick={() =>
                fullscreen ? handleFullScreen(false) : handleFullScreen(true)
              }
            >
              {fullscreen ? (
                <Minimize className="group-hover:p-[2px] p-0 transition-all duration-300 ease-in-out" />
              ) : (
                <Maximize className="group-hover:p-0 p-[2px] transition-all duration-300 ease-in-out" />
              )}
            </button>
            {/* Close Button */}
            {!fullscreen && (
              <button
                className="rounded-full bg-black/60 cursor-pointer text-white h-10 w-10 flex items-center justify-center hover:opacity-50"
                onClick={handleDeleteChart}
              >
                <X />
              </button>
            )}
          </div>
        </div>
        {expandedChart && (
          <>
            <div className="border"></div>
            <div
              className={`flex w-full gap-2 ${
                fullscreen ? "h-[calc(100vh-185px)]" : ""
              }`}
            >
              {/* Suggestions */}
              <Suggestions strategyProp={strategyProp} />
              {/* Main Chart */}
              <div
                className={`${
                  expandSuggestions ? "w-3/4" : "w-full"
                } flex flex-col gap-6 p-8 border rounded-lg`}
              >
                <div
                  className={`w-full ${fullscreen ? "h-full" : "h-[480px]"}`}
                >
                  {strategyProp === "ob-strategy" ? (
                    <Chart />
                  ) : (
                    <InPriceStrategyChart />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {/* Comparison Chart */}
        {compareSelected && (
          <div className="w-full flex flex-col gap-6 p-8 border rounded-lg">
            {/* Header */}
            <div className="flex w-full justify-between">
              <div className="flex items-center justify-start gap-4">
                <div className="text-xl font-semibold">
                  {chartConfigProp.symbol}
                </div>
                <div className="border h-full"></div>
                <div className="text-xl">{chartConfigProp.timeframe}</div>
              </div>
              <div className="flex gap-4 items-center">
                <button
                  className="rounded-full bg-black/60 cursor-pointer text-white p-1 hover:opacity-50"
                  onClick={() => setCompareSelected(false)}
                >
                  <X />
                </button>
              </div>
            </div>
            <div className="border"></div>
            {/* Chart */}
            <div className="h-[480px] w-full">
              {strategyProp === "ob-strategy" ? (
                <Chart />
              ) : (
                <InPriceStrategyChart />
              )}
            </div>
          </div>
        )}
      </div>
      {updateConfigPopupVisibility && strategyProp === "ob-strategy" && (
        <UpdateChartPopup
          setPopupVisibilityProp={setUpdateConfigPopupVisibility}
        />
      )}
      {updateConfigPopupVisibility && strategyProp === "in-price-strategy" && (
        <UpdateInPriceChartPopup
          setPopupVisibilityProp={setUpdateConfigPopupVisibility}
        />
      )}
    </ObSuggestionsContextProvider>
  );
};

export default ChartContainer;
