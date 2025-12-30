import { CopyPlus, LoaderCircle } from "lucide-react";

import { useChartsContext } from "../../context/ChartsContext";
import ChartContainer from "./ChartContainer";
import { useEffect, useState } from "react";
import AddChartPopup from "./AddChartPopup";
import { useWebSocketContext } from "../../context/WebSocketContext";
import { useWebSocketEvent } from "../../hooks/UseWebSocketEvent";
import { IndividualChartContextProvider } from "../../context/IndividualChartContext";
import AddInPriceChartPopup from "./inPriceStrategy/AddInPriceChartPopup";

interface ChartSectionProps {
  getChartConfigEventProp: "get_chart_config" | "get_in_price_chart_config";
  symbol?: string;
}

const ChartSection: React.FC<ChartSectionProps> = ({
  getChartConfigEventProp,
  symbol,
}) => {
  const { chartsConfigs, setChartsConfigs } = useChartsContext();
  const [addChartPopupVisibility, setAddChartPopupVisibility] =
    useState<boolean>(false);

  const { client } = useWebSocketContext();

  const chartsConfigsData =
    getChartConfigEventProp === "get_chart_config"
      ? useWebSocketEvent("get_chart_config")
      : useWebSocketEvent("get_in_price_chart_config");

  const isLoading = !chartsConfigsData ? true : false;

  useEffect(() => {
    if (!client?.isConnected()) return;

    // clear previous configs immediately to avoid stale charts flashing
    setChartsConfigs([]);

    const payload: any = { type: getChartConfigEventProp };
    if (symbol) {
      payload.data = { symbol };
    }

    client.send(payload);
  }, [client, getChartConfigEventProp, symbol, setChartsConfigs]);

  useEffect(() => {
    if (!chartsConfigsData) return;
    const incoming = Array.isArray(chartsConfigsData.chart_configs)
      ? chartsConfigsData.chart_configs
      : [];

    if (symbol) {
      const filtered = incoming.filter((c: any) => c && c.symbol === symbol);
      setChartsConfigs(filtered);
    } else {
      setChartsConfigs(incoming);
    }
  }, [chartsConfigsData, symbol, setChartsConfigs]);

  return (
    <div className="flex flex-col gap-2 w-full">
      {chartsConfigs
        .filter(Boolean) // protect against undefined/null entries
        .map((chartConfig, idx) => {
          // safe key: prefer symbol+timeframe but fall back to index if missing
          const key =
            (chartConfig?.symbol && chartConfig?.timeframe
              ? `${chartConfig.symbol}-${chartConfig.timeframe}`
              : `chart-${idx}`);

          return (
            <IndividualChartContextProvider key={key}>
              <ChartContainer
                chartConfigProp={chartConfig}
                strategyProp={
                  getChartConfigEventProp === "get_chart_config"
                    ? "ob-strategy"
                    : "in-price-strategy"
                }
              />
            </IndividualChartContextProvider>
          );
        })}
      {isLoading ? (
        <div className="border border-dashed border-gray-500 bg-gray-100 rounded-lg  text-gray-500 font-semibold py-4 flex items-center justify-center gap-2">
          <LoaderCircle className="animate-spin" />
          Loading Chart Configurations
        </div>
      ) : (
        <button
          className="border border-dashed border-blue-500 bg-blue-100 rounded-lg  text-blue-500 font-semibold py-4 flex items-center justify-center gap-2"
          onClick={() => setAddChartPopupVisibility(true)}
        >
          <CopyPlus />
          Add Chart
        </button>
      )}

      {addChartPopupVisibility &&
        getChartConfigEventProp === "get_chart_config" && (
          <AddChartPopup 
            setPopupVisibilityProp={setAddChartPopupVisibility}
            fixedSymbol={symbol}
          />
        )}
      {addChartPopupVisibility &&
        getChartConfigEventProp === "get_in_price_chart_config" && (
          <AddInPriceChartPopup
            setPopupVisibilityProp={setAddChartPopupVisibility}
            fixedSymbol={symbol} 
          />
        )}
    </div>
  );
};

export default ChartSection;
