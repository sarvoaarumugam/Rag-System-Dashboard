import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWebSocketContext } from "../context/WebSocketContext";
import { useWebSocketEvent } from "../hooks/UseWebSocketEvent";
import Header from "../components/common/Header";
import PageTitle from "../components/common/PageTitle";
import AddInPriceChartPopup from "../components/chart/inPriceStrategy/AddInPriceChartPopup";
import AddChartPopup from "../components/chart/AddChartPopup";

interface CoinsListPageProps {
  strategyType: "in-price" | "ob";
}

interface ChartConfigsResponse {
  chart_configs: { symbol: string }[];
}

const CoinsListPage: React.FC<CoinsListPageProps> = ({ strategyType }) => {
  const { client } = useWebSocketContext();
  const chartsConfigsData = useWebSocketEvent<ChartConfigsResponse>(
    strategyType === "in-price" ? "get_in_price_chart_config" : "get_chart_config"
  );

  const [symbols, setSymbols] = useState<string[]>([]);
  
  const [addChartPopupVisible, setAddChartPopupVisible] = useState<boolean>(false);

  const eventType = strategyType === "in-price" ? "get_in_price_chart_config" : "get_chart_config";
  const handleSetPopupVisibility: React.Dispatch<React.SetStateAction<boolean>> = (value) => {
    setAddChartPopupVisible((prev) => {
      const visible = typeof value === "function" ? (value as (p: boolean) => boolean)(prev) : value;
      if (!visible && client?.isConnected()) {
        client.send({ type: eventType });
      }
      return visible;
    });
  };

  useEffect(() => {
    if (client?.isConnected()) {
      client.send({
        type: eventType,
      });
    }
  }, [client, eventType]);

  useEffect(() => {
    if (chartsConfigsData?.chart_configs) {
      const uniqueSymbols = Array.from(new Set(chartsConfigsData.chart_configs.map((c) => c.symbol)));
      setSymbols(uniqueSymbols);
    }
  }, [chartsConfigsData]);

  return (
    <>
      <Header />
      <PageTitle
        titleProp={`${strategyType === "in-price" ? "In Price" : "OB"} Strategy — Select a Coin`}
        backButtonLinkProp="/"
      />

      <div className="px-6 bg-white flex justify-center mb-6">
        <div className="max-w-[1440px] w-full bg-white p-6 flex flex-col gap-6">
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {symbols.map((s) => (
              <Link
                key={s}
                to={`/${strategyType}-strategy/charts/${s}`}
                className="group p-10 border border-blue-200 bg-blue-50 rounded-lg text-center font-semibold text-blue-600 transition duration-200"
              >
                <span className="inline-block transition-transform duration-200 group-hover:scale-110">
                  {s}
                </span>
              </Link>
            ))}
          </div>

          <button
            className="border border-dashed border-blue-500 bg-blue-100 rounded-lg text-blue-500 font-semibold py-4 flex items-center justify-center gap-2"
            onClick={() => setAddChartPopupVisible(true)}
          >
            Add Symbol
          </button>
          {addChartPopupVisible &&
            (strategyType === "in-price" ? (
              <AddInPriceChartPopup setPopupVisibilityProp={handleSetPopupVisibility} />
            ) : (
              <AddChartPopup setPopupVisibilityProp={handleSetPopupVisibility} />
            ))}
        </div>
      </div>
    </>
  );
};

export default CoinsListPage;
