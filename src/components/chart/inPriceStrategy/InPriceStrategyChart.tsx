import { useEffect, useRef, useState } from "react";
import {
	createChart,
	IChartApi,
	DeepPartial,
	CandlestickSeries,
	UTCTimestamp,
	createSeriesMarkers,
	LineSeries,
	HistogramSeries,
	CrosshairMode,
	CandlestickData,
} from "lightweight-charts";
import { ChartDataType, OBKeys } from "../../../types/ChartDataType";
import { ChartConfigType } from "../../../context/ChartsContext";
import { useWebSocketContext } from "../../../context/WebSocketContext";
import { useWebSocketEvent } from "../../../hooks/UseWebSocketEvent";
import { useIndividualChartContext } from "../../../context/IndividualChartContext";
import { useObSuggestionsContext } from "../../../context/ObSuggestionsContext";
import { OrderBlockIndicator, OrderBlockIndicatorDataType } from "../plugins/order-block-indicator";
import AiAnalysisButton from "../AiAnalysisButton";
import { LoaderCircle } from "lucide-react";

function isValidChartData(data: any): data is ChartDataType {
	return (
		typeof data === "object" &&
		Array.isArray(data.candles) &&
		typeof data.indicators === "object" &&
		data.indicators !== null &&
		data.indicators.swings &&
		Array.isArray(data.indicators.swings.swinghighs) &&
		Array.isArray(data.indicators.swings.swinglows) &&
		data.indicators.trend &&
		Array.isArray(data.indicators.trend.downtrend) &&
		Array.isArray(data.indicators.trend.uptrend)
	);
}

function isRelevantChart(data: any, config: ChartConfigType) {
	if (data.config.symbol === config.symbol && data.config.timeframe === config.timeframe) {
		return true;
	} else return false;
}

export function parseAsUTC(s: string): number {
	// expects "YYYY-MM-DD HH:mm:ss"
	const [date, time] = s.split(" ");
	const [year, month, day] = date.split("-").map(Number);
	const [hour, minute, second] = time.split(":").map(Number);
	const d = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
	return Math.floor(d.getTime() / 1000); // UTCTimestamp
}

const InPriceStrategyChart = () => {
	const { client } = useWebSocketContext();
	const chartData = useWebSocketEvent("get_in_price_chart_data");

	const hasFetchedMore = useRef(false);

	const { chartConfig, expandSuggestions } = useIndividualChartContext();

	const { selectedSuggestion, setSelectedSuggestion } = useObSuggestionsContext();

	const [validChartData, setValidChartData] = useState<ChartDataType>();

	const [latestCandleTimeStamp, setLatestCandleTimeStamp] = useState<string>("");
	const [oldestCandleTimeStamp, setOldestCandleTimeStamp] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [legend, setLegend] = useState<{ open: number; high: number; low: number; close: number }>();

	const [offset, setOffset] = useState<number>(0);

	const chartContainerRef = useRef<HTMLDivElement>(null);

	const chartRef = useRef<IChartApi | null>(null);

	const candleSeriesRef = useRef<any | null>(null);

	const volumeSeriesRef = useRef<any | null>(null);

	const swingHighsMarkersRef = useRef<any | null>(null);
	const swingLowsMarkersRef = useRef<any | null>(null);

	const trendSeriesRef = useRef<any | null>(null);

	const bosSeriesRef = useRef<any | null>(null);

	const obSeriesRef_15m = useRef<any | null>(null);
	const obSeriesRef_1h = useRef<any | null>(null);
	const obSeriesRef_4h = useRef<any | null>(null);
	const obSeriesRef_1d = useRef<any | null>(null);

	const selectedObSeriesRef = useRef<any | null>(null);

	const offsetRef = useRef(offset);

	useEffect(() => {
		offsetRef.current = offset;
		console.log(`Offset is ${offset}`);
	}, [offset]);

	// #region Handle Getting Candle Data
	const handleGetCandleData = (index_offset: number) => {
		if (chartConfig === null) {
			console.error("Chart Config is null");
			return;
		}

		if (client?.isConnected()) {
			client.send({
				type: "get_in_price_chart_data",
				data: { symbol: chartConfig.symbol, timeframe: chartConfig.timeframe, index_offset: index_offset },
			});
			if (index_offset === 0) {
				setIsLoading(true);
			}
		}
	};

	useEffect(() => {
		handleGetCandleData(0);
		removeAllObIndicators();
	}, [chartConfig]);
	// #endregion

	// #region Handle Received Candle Data
	useEffect(() => {
		if (chartConfig === null) return;

		if (chartData?.data && isValidChartData(chartData.data) && isRelevantChart(chartData, chartConfig)) {
			setOffset(chartData?.config.offset);

			// ✅ Guard: stop if backend returned no candles
			if (!chartData.data.candles || chartData.data.candles.length === 0) {
				console.info("No more candles available, stopping further history requests.");
				hasFetchedMore.current = true; // prevent further requests
				setIsLoading(false);
				return;
			}

			if (chartData?.config.offset === 0) {
				console.log("Setting New Data");

				chartRef.current?.timeScale().applyOptions({ rightOffset: 0 });

				setValidChartData(chartData?.data);

				// ✅ safely use the last available candle
				const oldestCandle = chartData?.data.candles.at(0);
				if (oldestCandle?.timestamp) {
					setOldestCandleTimeStamp(oldestCandle.timestamp);
				} else {
					console.warn("No valid first candle found");
					setOldestCandleTimeStamp("");
				}

				const lastCandle = chartData?.data.candles.at(-1);
				if (lastCandle?.timestamp) {
					setLatestCandleTimeStamp(lastCandle.timestamp);
				} else {
					console.warn("No valid last candle found");
					setLatestCandleTimeStamp("");
				}
			} else {
				console.log("Appending to Existing Data");

				const oldestCandle = chartData?.data.candles.at(0);
				if (oldestCandle?.timestamp) {
					setOldestCandleTimeStamp(oldestCandle.timestamp);
				} else {
					console.warn("No valid first candle found");
					setOldestCandleTimeStamp("");
				}

				setValidChartData((prev) => {
					// if prev was somehow undefined, just replace
					if (!prev) {
						console.error("Undefined prev");
						return chartData.data!;
					}

					return {
						// keep everything else the same
						...prev,
						// append the new candles array
						candles: [...prev.candles, ...chartData.data.candles]
							// ✅ remove duplicates
							.filter((c, i, arr) => arr.findIndex((x) => x.timestamp === c.timestamp) === i)
							// ✅ sort oldest → newest
							.sort((a, b) => parseAsUTC(a.timestamp) - parseAsUTC(b.timestamp)),

						indicators: {
							swings: {
								swinghighs: [...chartData.data.indicators.swings.swinghighs, ...prev.indicators.swings.swinghighs],
								swinglows: [...chartData.data.indicators.swings.swinglows, ...prev.indicators.swings.swinglows],
							},
							break_of_structure: {
								bearish_bos: [
									...chartData.data.indicators.break_of_structure.bearish_bos,
									...prev.indicators.break_of_structure.bearish_bos,
								],
								bullish_bos: [
									...chartData.data.indicators.break_of_structure.bullish_bos,
									...prev.indicators.break_of_structure.bullish_bos,
								],
							},
							order_blocks_15m: {
								bearish: [...chartData.data.indicators.order_blocks_15m.bearish],
								bullish: [...chartData.data.indicators.order_blocks_15m.bullish],
							},
							order_blocks_1h: {
								bearish: [...chartData.data.indicators.order_blocks_1h.bearish],
								bullish: [...chartData.data.indicators.order_blocks_1h.bullish],
							},
							order_blocks_4h: {
								bearish: [...chartData.data.indicators.order_blocks_4h.bearish],
								bullish: [...chartData.data.indicators.order_blocks_4h.bullish],
							},
							order_blocks_1d: {
								bearish: [...chartData.data.indicators.order_blocks_1d.bearish],
								bullish: [...chartData.data.indicators.order_blocks_1d.bullish],
							},
							trend: {
								uptrend: [...chartData.data.indicators.trend.uptrend, ...prev.indicators.trend.uptrend],
								downtrend: [...chartData.data.indicators.trend.downtrend, ...prev.indicators.trend.downtrend],
							},
						},
					};
				});
				hasFetchedMore.current = false;
			}

			setIsLoading(false);
		}
	}, [chartData]);

	// #endregion

	useEffect(() => {
		console.log("Valid Chart Data : ");
		console.log(validChartData);
	}, [validChartData]);

	//#region Chart Initialization
	useEffect(() => {
		if (!chartContainerRef.current) return;

		const chartOptions: DeepPartial<ReturnType<typeof createChart>["options"]> = {
			layout: {
				textColor: "black",
				background: {
					type: "solid",
					color: "white",
				},
			},
			crosshair: {
				mode: CrosshairMode.Normal,
			},
			timeScale: {
				timeVisible: true, // Enables showing time (not just date)
				secondsVisible: false, // Set true if you want to show seconds as well
			},
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
				const data = param.seriesData.get(candleSeriesRef.current) as CandlestickData;
				if (data) {
					setLegend({ open: data.open, close: data.close, high: data.high, low: data.low });
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
	//#endregion

	// #region Volume Indicator
	useEffect(() => {
		const chart = chartRef.current;
		if (!chart || !validChartData || !chartConfig) return;

		// 1) If user turned it ON:
		if (chartConfig.indicators_config.volume.enabled) {
			// only add once
			if (!volumeSeriesRef.current) {
				volumeSeriesRef.current = chart.addSeries(HistogramSeries, {
					color: "rgba(0, 123, 255, 0.5)",
					priceFormat: {
						type: "volume",
					},
					priceScaleId: "", // set as an overlay by setting a blank priceScaleId
				});

				volumeSeriesRef.current.priceScale().applyOptions({
					scaleMargins: {
						top: 0.75, // highest point of the series will be 70% away from the top
						bottom: 0,
					},
				});
			}
			// update its data
			const volumeData = validChartData.candles.map((c) => ({
				time: parseAsUTC(c.timestamp) as UTCTimestamp,
				value: c.volume,
			}));
			volumeSeriesRef.current.setData(volumeData);
		}
		// 2) If user turned it OFF:
		else {
			if (volumeSeriesRef.current) {
				chart.removeSeries(volumeSeriesRef.current);
				volumeSeriesRef.current = null;
			}
		}
	}, [validChartData, chartConfig?.indicators_config.volume.enabled]);
	//#endregion

	// #region Swings Indicator
	useEffect(() => {
		if (!validChartData || !chartConfig) return;

		if (chartConfig?.indicators_config.swings.enabled) {
			const swingHighs = validChartData.indicators.swings.swinghighs;
			const swingLows = validChartData.indicators.swings.swinglows;

			//Clears existing swings
			if (swingHighsMarkersRef.current && swingLowsMarkersRef.current) {
				swingHighsMarkersRef.current.setMarkers([]);
				swingLowsMarkersRef.current.setMarkers([]);

				swingHighsMarkersRef.current = null;
				swingLowsMarkersRef.current = null;
			}

			const swingHighMarkers = swingHighs.map((swing) => {
				return {
					time: parseAsUTC(swing.timestamp) as UTCTimestamp,
					position: "aboveBar" as const,
					color: "green",
					shape: "arrowUp" as const,
					text: "SH",
				};
			});

			const swingLowMarkers = swingLows.map((swing) => {
				return {
					time: parseAsUTC(swing.timestamp) as UTCTimestamp,
					position: "belowBar" as const,
					color: "red",
					shape: "arrowDown" as const,
					text: "SL",
				};
			});

			swingHighsMarkersRef.current = createSeriesMarkers(candleSeriesRef.current, swingHighMarkers);
			swingLowsMarkersRef.current = createSeriesMarkers(candleSeriesRef.current, swingLowMarkers);
		} else {
			if (swingHighsMarkersRef.current && swingLowsMarkersRef.current) {
				swingHighsMarkersRef.current.setMarkers([]);
				swingLowsMarkersRef.current.setMarkers([]);

				swingHighsMarkersRef.current = null;
				swingLowsMarkersRef.current = null;
			}
		}
	}, [validChartData]);

	useEffect(() => {
		console.warn("outside loop");
		if (swingHighsMarkersRef.current && swingLowsMarkersRef.current) {
			console.warn("inside loop");
			swingHighsMarkersRef.current.setMarkers([]);
			swingLowsMarkersRef.current.setMarkers([]);

			swingHighsMarkersRef.current = null;
			swingLowsMarkersRef.current = null;
		}
	}, [chartConfig?.indicators_config.swings.swing_length]);
	//#endregion

	// #region Trend Indicator
	useEffect(() => {
		const chart = chartRef.current;
		if (!chart || !validChartData || !chartConfig) return;

		if (chartConfig.indicators_config.trend.enabled) {
			if (!trendSeriesRef.current) {
				trendSeriesRef.current = [];
			}

			validChartData.indicators.trend.uptrend.forEach((trend) => {
				const upTrendLine = chart.addSeries(LineSeries, {
					color: "green",
					lineWidth: 3,
					lastValueVisible: false,
					priceLineVisible: false,
				});

				upTrendLine.setData([
					{
						time: parseAsUTC(trend.start.time) as UTCTimestamp,
						value: trend.start.value,
					},
					{
						time: parseAsUTC(trend.end.time) as UTCTimestamp,
						value: trend.end.value,
					},
				]);

				trendSeriesRef.current.push(upTrendLine);
			});

			validChartData.indicators.trend.downtrend.forEach((trend) => {
				const downTrendLine = chart.addSeries(LineSeries, {
					color: "red",
					lineWidth: 3,
					lastValueVisible: false,
					priceLineVisible: false,
				});

				downTrendLine.setData([
					{
						time: parseAsUTC(trend.start.time) as UTCTimestamp,
						value: trend.start.value,
					},
					{
						time: parseAsUTC(trend.end.time) as UTCTimestamp,
						value: trend.end.value,
					},
				]);

				trendSeriesRef.current.push(downTrendLine);
			});
		} else {
			if (trendSeriesRef.current) {
				trendSeriesRef.current.forEach((s: any) => chart.removeSeries(s));

				trendSeriesRef.current = null;
			}
		}
	}, [validChartData]);

	// remove existing trend lines if the length is changed
	useEffect(() => {
		const chart = chartRef.current;
		if (!chart) return;

		if (trendSeriesRef.current) {
			trendSeriesRef.current.forEach((s: any) => chart.removeSeries(s));

			trendSeriesRef.current = null;
		}
	}, [chartConfig?.indicators_config.trend.trend_length]);
	// #endregion

	// #region BoS Indicator
	useEffect(() => {
		const chart = chartRef.current;
		if (!chart || !validChartData || !chartConfig) return;

		if (chartConfig.indicators_config.break_of_structure.enabled) {
			if (!bosSeriesRef.current) {
				bosSeriesRef.current = [];
			}

			// Bullish BoS
			validChartData.indicators.break_of_structure.bullish_bos.forEach((bos) => {
				const bosLine = chart.addSeries(LineSeries, {
					color: "green",
					lineWidth: 3,
					lastValueVisible: false,
					priceLineVisible: false,
				});

				bosLine.setData([
					{
						time: parseAsUTC(bos.start.time) as UTCTimestamp,
						value: bos.start.value,
					},
					{
						time: parseAsUTC(bos.end.time) as UTCTimestamp,
						value: bos.start.value,
					},
				]);

				bosSeriesRef.current.push(bosLine);
			});

			// Bearish BoS
			validChartData.indicators.break_of_structure.bearish_bos.forEach((bos) => {
				const bosLine = chart.addSeries(LineSeries, {
					color: "red",
					lineWidth: 3,
					lastValueVisible: false,
					priceLineVisible: false,
				});

				bosLine.setData([
					{
						time: parseAsUTC(bos.start.time) as UTCTimestamp,
						value: bos.start.value,
					},
					{
						time: parseAsUTC(bos.end.time) as UTCTimestamp,
						value: bos.start.value,
					},
				]);
				bosSeriesRef.current.push(bosLine);
			});
		} else {
			if (bosSeriesRef.current) {
				bosSeriesRef.current.forEach((s: any) => chart.removeSeries(s));

				bosSeriesRef.current = null;
			}
		}
	}, [validChartData]);
	// #endregion

	const compareObTimestamp = (ob_timestamp: string) => {
		const obTimestamp = parseAsUTC(ob_timestamp) as UTCTimestamp;
		const oldestTimestamp = parseAsUTC(oldestCandleTimeStamp) as UTCTimestamp;

		if (obTimestamp < oldestTimestamp) {
			return true;
		} else {
			return false;
		}
	};

	const handleOrderblocks = (configParameterName: string, responseParameterName: OBKeys, seriesRef: any, labelText: string) => {
		const chart = chartRef.current;
		if (!chart || !validChartData || !chartConfig) return;

		if (chartConfig?.strategy_config?.[configParameterName].enabled) {
			// Remove existing suggestion & its indicator
			if (selectedSuggestion && selectedObSeriesRef.current) {
				selectedObSeriesRef.current.remove();
				selectedObSeriesRef.current = null;
				setSelectedSuggestion(null);
			}

			// Craete an empty array for pushing the bullish and bearish OB indicators
			if (!seriesRef.current) {
				seriesRef.current = [];
			} else {
				removeObIndicators(seriesRef);
				seriesRef.current = [];
			}

			const invalidated_bullish_ob_data: OrderBlockIndicatorDataType[] = validChartData.indicators[responseParameterName].bullish
				.filter((ob) => ob.invalidated === true)
				.map((ob) => ({
					start_point: {
						time: compareObTimestamp(ob.timestamp)
							? (parseAsUTC(oldestCandleTimeStamp) as UTCTimestamp)
							: (parseAsUTC(ob.timestamp) as UTCTimestamp),
						price: ob.zone_high,
					},
					end_point: {
						time: parseAsUTC(latestCandleTimeStamp) as UTCTimestamp,
						price: ob.zone_low,
					},
				}));

			console.log(`${labelText} Invalidated Bullish OBs`, invalidated_bullish_ob_data);

			invalidated_bullish_ob_data.forEach((newOB) =>
				seriesRef.current!.push(
					new OrderBlockIndicator(
						candleSeriesRef.current,
						{ fillColor: "rgba(0, 0, 0, 0.15)", labelText: `Invalidated ${labelText} OB (Bullish)`, labelColor: "rgba(0,0,0,1)" },
						[newOB] // push only this block
					)
				)
			);

			const invalid_bearish_ob_data: OrderBlockIndicatorDataType[] = validChartData.indicators[responseParameterName].bearish
				.filter((ob) => ob.invalidated === true)
				.map((ob) => ({
					start_point: {
						time: compareObTimestamp(ob.timestamp)
							? (parseAsUTC(oldestCandleTimeStamp) as UTCTimestamp)
							: (parseAsUTC(ob.timestamp) as UTCTimestamp),
						price: ob.zone_high,
					},
					end_point: {
						time: parseAsUTC(latestCandleTimeStamp) as UTCTimestamp,
						price: ob.zone_low,
					},
				}));

			console.log(`${labelText} Invalidated Bearish OBs`, invalid_bearish_ob_data);

			invalid_bearish_ob_data.forEach((newOB) => {
				seriesRef.current!.push(
					new OrderBlockIndicator(
						candleSeriesRef.current,
						{ fillColor: "rgba(0, 0, 0, 0.15)", labelText: `Invalidated ${labelText} OB (Bearish)`, labelColor: "rgba(0,0,0,1)" },
						[newOB] // push only this block
					)
				);
			});

			const bullish_ob_data: OrderBlockIndicatorDataType[] = validChartData.indicators[responseParameterName].bullish
				.filter((ob) => ob.invalidated === false)
				.map((ob) => ({
					start_point: {
						time: compareObTimestamp(ob.timestamp)
							? (parseAsUTC(oldestCandleTimeStamp) as UTCTimestamp)
							: (parseAsUTC(ob.timestamp) as UTCTimestamp),
						price: ob.zone_high,
					},
					end_point: {
						time: parseAsUTC(latestCandleTimeStamp) as UTCTimestamp,
						price: ob.zone_low,
					},
				}));

			console.log(`${labelText} Bullish OBs`, bullish_ob_data);

			bullish_ob_data.forEach((newOB) =>
				seriesRef.current!.push(
					new OrderBlockIndicator(
						candleSeriesRef.current,
						{ fillColor: "rgba(0, 255, 0, 0.25)", labelText: `${labelText} Orderblock` },
						[newOB] // push only this block
					)
				)
			);

			const bearish_ob_data: OrderBlockIndicatorDataType[] = validChartData.indicators[responseParameterName].bearish
				.filter((ob) => ob.invalidated === false)
				.map((ob) => ({
					start_point: {
						time: compareObTimestamp(ob.timestamp)
							? (parseAsUTC(oldestCandleTimeStamp) as UTCTimestamp)
							: (parseAsUTC(ob.timestamp) as UTCTimestamp),
						price: ob.zone_high,
					},
					end_point: {
						time: parseAsUTC(latestCandleTimeStamp) as UTCTimestamp,
						price: ob.zone_low,
					},
				}));

			console.log(`${labelText} Bearish OBs`, bearish_ob_data);

			bearish_ob_data.forEach((newOB) => {
				seriesRef.current!.push(
					new OrderBlockIndicator(
						candleSeriesRef.current,
						{ fillColor: "rgba(255, 0, 0, 0.25)", labelText: `${labelText} Orderblock` },
						[newOB] // push only this block
					)
				);
			});
		} else {
			if (seriesRef.current) {
				seriesRef.current.forEach((s: OrderBlockIndicator) => s.remove());
				seriesRef.current = null;
			}
		}
	};

	const removeAllObIndicators = () => {
		removeObIndicators(obSeriesRef_15m);
		removeObIndicators(obSeriesRef_1h);
		removeObIndicators(obSeriesRef_4h);
		removeObIndicators(obSeriesRef_1d);
	};

	const removeObIndicators = (seriesRef: React.MutableRefObject<OrderBlockIndicator[] | null>) => {
		const arr = seriesRef.current;
		if (!arr || !Array.isArray(arr) || arr.length === 0) {
			seriesRef.current = []; // keep it an array to simplify callers
			return;
		}
		for (const ob of arr) {
			try {
				ob.remove();
			} catch (e) {
				console.warn("OB detach failed:", e);
			}
		}
		seriesRef.current = [];
		// nudge a repaint
		candleSeriesRef.current?.priceScale().applyOptions({});
	};

	// #region OB 15m Indicator
	useEffect(() => {
		handleOrderblocks("orderblock_parameters_15m", "order_blocks_15m", obSeriesRef_15m, "15m");
	}, [validChartData, oldestCandleTimeStamp]);
	//#endregion
	// #region OB 1h Indicator
	useEffect(() => {
		handleOrderblocks("orderblock_parameters_1h", "order_blocks_1h", obSeriesRef_1h, "1h");
	}, [validChartData, oldestCandleTimeStamp]);
	//#endregion
	// #region OB 4h Indicator
	useEffect(() => {
		handleOrderblocks("orderblock_parameters_4h", "order_blocks_4h", obSeriesRef_4h, "4h");
	}, [validChartData, oldestCandleTimeStamp]);
	//#endregion
	// #region OB 1d Indicator
	useEffect(() => {
		handleOrderblocks("orderblock_parameters_1d", "order_blocks_1d", obSeriesRef_1d, "1d");
	}, [validChartData, oldestCandleTimeStamp]);
	//#endregion

	useEffect(() => {
		if (chartConfig === null) return;

		if (!validChartData) return;
		if (!chartContainerRef.current || !candleSeriesRef.current) return;

		//#region CandleSticks Series
		const formattedCandleData = validChartData?.candles
			.filter((candle) => candle && candle.timestamp) // ✅ drop broken candles
			.map((candle) => ({
				time: parseAsUTC(candle.timestamp) as UTCTimestamp,
				...candle,
			}))
			.sort((a, b) => a.time - b.time); // ✅ enforce ascending order

		candleSeriesRef.current.setData(formattedCandleData);
		//#endregion

		chartRef.current!.timeScale().subscribeVisibleLogicalRangeChange((logicalRange) => {
			if (!logicalRange) return;

			// only fire the first time we hit the left edge
			if (logicalRange.from <= 0 && !hasFetchedMore.current) {
				hasFetchedMore.current = true;
				handleGetCandleData(offsetRef.current + 500);
				console.log(`Getting candle data for offset ${offsetRef.current + 500}`);
			}
		});
	}, [validChartData, chartConfig?.indicators_config, expandSuggestions, selectedSuggestion]);

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
					C: <span className="text-blue-500 font-semibold">{legend?.close}</span>
				</div>
			</div>
			<div ref={chartContainerRef} style={{ width: "100%", height: "100%" }} />
			{chartContainerRef.current && chartConfig && (
				<div className="absolute top-1 right-20 z-40">
					<AiAnalysisButton
						chartContainerRefProp={chartContainerRef}
						selectedSuggestionProp={selectedSuggestion ? selectedSuggestion : null}
						chartConfigProp={{ symbol: chartConfig.symbol, timeframe: chartConfig.timeframe }}
					/>
				</div>
			)}
			{isLoading && (
				<div className="absolute bg-white inset-0 flex items-center justify-center text-2xl text-gray-400 font-semibold gap-2 z-40">
					<LoaderCircle className="animate-spin" />
					Loading Chart Data
				</div>
			)}
		</div>
	);
};

export default InPriceStrategyChart;
