import { LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ObChartType } from "../../../types/ObChartType";
import {
  CandlestickData,
  CandlestickSeries,
  createChart,
  createSeriesMarkers,
  CrosshairMode,
  DeepPartial,
  IChartApi,
  UTCTimestamp,
} from "lightweight-charts";
import { parseAsUTC } from "../../chart/Chart";
import {
  OrderBlockIndicator,
  OrderBlockIndicatorDataType,
} from "../../chart/plugins/order-block-indicator";

interface ExitInfo {
  exit_type: string;
  portion_pnl: number;
  portion_closed?: number | string;
  exit_timestamp: string;
  exit_price: number | string;
}

interface ReportOBChartProps {
  candleDataProp: ObChartType | null;
  isLoadingProp: boolean;
  reportDataProp: {
    zone_high: number;
    zone_low: number;
    ob_timestamp: string;
    ob_type: string;
    entry_timestamp: string;
    entry_price: number;
    exit_timestamp: string;
    exit_price: number;
  };
  exits_info?: ExitInfo[];
}

const ReportOBChart: React.FC<ReportOBChartProps> = ({
  candleDataProp,
  isLoadingProp,
  reportDataProp,
  exits_info,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<any | null>(null);
  const selectedObSeriesRef = useRef<any | null>(null);
  const priceLinesRef = useRef<any[]>([]);

  const [latestCandleTimeStamp, setLatestCandleTimeStamp] =
    useState<string>("");
  const [legend, setLegend] = useState<{
    open: number;
    high: number;
    low: number;
    close: number;
  }>();
  const [exitsOpen, setExitsOpen] = useState<boolean>(true);
  const exits: ExitInfo[] = (exits_info ??
    (reportDataProp as any).exits_info ??
    []) as ExitInfo[];

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartOptions: DeepPartial<ReturnType<typeof createChart>["options"]> =
      {
        layout: {
          textColor: "black",
          background: {
            type: "solid",
            color: "white",
          },
        },
        crosshair: { mode: CrosshairMode.Normal },
        timeScale: { timeVisible: true, secondsVisible: false },
      };

    const chart = createChart(chartContainerRef.current, chartOptions);
    chartRef.current = chart;

    candleSeriesRef.current = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const data = param.seriesData.get(
          candleSeriesRef.current
        ) as CandlestickData;
        if (data) {
          setLegend({
            open: data.open,
            close: data.close,
            high: data.high,
            low: data.low,
          });
        }
      }
    });

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === chartContainerRef.current) {
          chart.applyOptions({ width: entry.contentRect.width });
        }
      }
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      chart.remove();
      resizeObserver.disconnect();
    };
  }, []);

  // Set Candle Data
  useEffect(() => {
    if (candleDataProp && candleDataProp?.data.candles) {
      const formattedCandleData = candleDataProp?.data.candles
        .filter((candle) => candle && candle.timestamp)
        .map((candle) => ({
          time: parseAsUTC(candle.timestamp) as UTCTimestamp,
          ...candle,
        }))
        .sort((a, b) => a.time - b.time);

      const lastCandle =
        candleDataProp?.data.candles[candleDataProp?.data.candles.length - 1];
      if (lastCandle?.timestamp) {
        setLatestCandleTimeStamp(lastCandle.timestamp);
      } else {
        console.warn("No valid last candle found");
        setLatestCandleTimeStamp("");
      }

      candleSeriesRef.current.setData(formattedCandleData);
      requestAnimationFrame(() => {
        chartRef.current?.timeScale().fitContent();
      });
    }
  }, [candleDataProp]);

  // Set OB data
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !latestCandleTimeStamp) return;

    // Create OB Data
    const ob_data: OrderBlockIndicatorDataType[] = [
      {
        start_point: {
          time: parseAsUTC(reportDataProp.ob_timestamp) as UTCTimestamp,
          price: reportDataProp.zone_high,
        },
        end_point: {
          time: parseAsUTC(latestCandleTimeStamp) as UTCTimestamp,
          price: reportDataProp.zone_low,
        },
      },
    ];

    // create / recreate OB indicator early so it draws underneath markers/lines
    if (selectedObSeriesRef.current) {
      try {
        selectedObSeriesRef.current.destroy?.();
      } catch (e) {
        // ignore
      }
    }

    selectedObSeriesRef.current = new OrderBlockIndicator(
      candleSeriesRef.current,
      {
        fillColor:
          reportDataProp.ob_type === "bullish"
            ? "rgba(0,255,0,0.25)"
            : "rgba(255,0,0,0.25)",
      },
      ob_data
    );

    // Add Entry & Exit Markers
    const entryExitMarkers: any[] = [
      {
        time: parseAsUTC(reportDataProp.entry_timestamp) as UTCTimestamp,
        position: "aboveBar" as const,
        color: "#16a34a",
        shape: "arrowDown" as const,
        size: 2,
        text: `Entry - ${reportDataProp.entry_price}`,
      },
    ];

    for (const ex of exits) {
      const exPrice =
        typeof ex.exit_price === "number"
          ? ex.exit_price
          : Number(ex.exit_price);
      const exTime = ex.exit_timestamp ? parseAsUTC(ex.exit_timestamp) : null;
      if (!exTime || !isFinite(exPrice)) continue;
      const isTP =
        typeof ex.exit_type === "string" &&
        ex.exit_type.toUpperCase().startsWith("TP");
      entryExitMarkers.push({
        time: exTime as UTCTimestamp,
        position: isTP ? "belowBar" : "aboveBar",
        color: isTP ? "#16a34a" : "#dc2626",
        shape: isTP ? "arrowUp" : "arrowDown",
        size: 2,
        text: `${ex.exit_type ?? "Exit"} - ${exPrice.toFixed(2)}`,
      } as any);
    }

    createSeriesMarkers(candleSeriesRef.current, []);
    createSeriesMarkers(candleSeriesRef.current, entryExitMarkers);

    // Clear old price lines
    if (
      priceLinesRef.current.length &&
      candleSeriesRef.current?.removePriceLine
    ) {
      priceLinesRef.current.forEach((pl) =>
        candleSeriesRef.current.removePriceLine(pl)
      );
    }
    priceLinesRef.current = [];

    // Entry line
    if (reportDataProp.entry_price) {
      const entryLine = candleSeriesRef.current.createPriceLine({
        price: reportDataProp.entry_price,
        color: "#16a34a",
        lineWidth: 2,
        lineStyle: 2, // dashed
        title: "Entry",
      });
      priceLinesRef.current.push(entryLine);
    }

    // Exit lines
    exits.forEach((ex) => {
      const price = Number(ex.exit_price);
      if (!isFinite(price)) return;
      const isTP = ex.exit_type?.toUpperCase().startsWith("TP");
      const line = candleSeriesRef.current.createPriceLine({
        price,
        color: isTP ? "#16a34a" : "#dc2626",
        lineWidth: 2,
        lineStyle: 1,
        title: ex.exit_type,
      });
      priceLinesRef.current.push(line);
    });

    // Create the OB Indicator
  }, [reportDataProp, latestCandleTimeStamp]);

  return (
    <div className="relative w-full h-full">
      {/* Legend */}
      <div className="absolute top-1 left-1 z-30 flex gap-2 bg-white/80 backdrop-blur-sm px-2 border rounded-lg text-sm">
        <div className="flex gap-1">
          O: <span className="text-blue-500 font-semibold">{legend?.open}</span>
        </div>
        <div className="flex gap-1">
          H: <span className="text-blue-500 font-semibold">{legend?.high}</span>
        </div>
        <div className="flex gap-1">
          L: <span className="text-blue-500 font-semibold">{legend?.low}</span>
        </div>
        <div className="flex gap-1">
          C:{" "}
          <span className="text-blue-500 font-semibold">{legend?.close}</span>
        </div>
      </div>

      {/* Right-side Exits panel */}
      <div className="absolute top-1 right-20 z-40 flex flex-col items-start gap-2 ">
        <button
          onClick={() => setExitsOpen((s) => !s)}
          aria-expanded={exitsOpen}
          className="ml-auto px-3 py-1 bg-white/95 rounded-md shadow-sm text-sm font-medium border border-gray-500"
        >
          {exitsOpen ? "Hide Exits" : "Show Exits"}
        </button>

        <div
          className={`transition-all duration-300 ease-in-out border border-gray-300 origin-top-right overflow-hidden rounded-lg shadow-md bg-white/95 p-3 text-sm ${
            exitsOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{ pointerEvents: exitsOpen ? "auto" : "none", width: 400 }}
        >
          <div className="font-semibold mb-2">Exits</div>

          {exits && exits.length > 0 ? (
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-1 px-2">Type</th>
                  <th className="py-1 px-2">Closed</th>
                  <th className="py-1 px-2">PnL</th>
                  <th className="py-1 px-2">Price</th>
                  <th className="py-1 px-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {exits.map((ex: ExitInfo, idx: number) => {
                  const isTP = ex.exit_type?.toUpperCase().startsWith("TP");
                  return (
                    <tr key={idx} className="border-b last:border-0">
                      <td
                        className={`py-1 px-2 font-medium ${
                          isTP ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {ex.exit_type}
                      </td>
                      <td className="py-1 px-2">{ex.portion_closed ?? "—"}%</td>
                      <td className="py-1 px-2">{ex.portion_pnl ?? "—"}%</td>
                      <td className="py-1 px-2 font-semibold">
                        {Number(ex.exit_price).toFixed(2)}
                      </td>
                      <td className="py-1 px-2 text-gray-600">
                        {ex.exit_timestamp}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-xs text-gray-600">No exits</div>
          )}
        </div>
      </div>
      <div ref={chartContainerRef} style={{ width: "100%", height: "100%" }} />
      {isLoadingProp && (
        <div className="absolute bg-white inset-0 flex items-center justify-center text-2xl text-gray-400 font-semibold gap-2 z-40">
          <LoaderCircle className="animate-spin" /> Loading Chart Data
        </div>
      )}
    </div>
  );
};

export default ReportOBChart;
