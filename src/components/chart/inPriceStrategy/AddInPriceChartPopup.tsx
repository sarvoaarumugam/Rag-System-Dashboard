import { SetStateAction, useEffect, useState } from "react";
import { useChartsContext } from "../../../context/ChartsContext";
import { useWebSocketContext } from "../../../context/WebSocketContext";
import { useWebSocketEvent } from "../../../hooks/UseWebSocketEvent";
import PopupContainer from "../../common/PopupContainer";
import { AvailableCryptos } from "../../../configs/AvailableCryptos";

import TitleHeading from "../../common/TitleHeading";
import InPriceConfigInputs from "./InPriceConfigInputs";

interface AddInPriceChartPopupProps {
	setPopupVisibilityProp: React.Dispatch<SetStateAction<boolean>>;
	fixedSymbol?: string;
}

const InPriceStrategyAvailableTimeframes = ["1m", "3m", "5m", "15m"];

export type ObStrategyType = {
	impulse_threshold: number;
	impulse_window: number;
	enabled: boolean;
	invalidation_candle: number;
	include_invalidated_obs: boolean;
	max_orderblocks: number;
};

const AddInPriceChartPopup: React.FC<AddInPriceChartPopupProps> = ({ setPopupVisibilityProp, fixedSymbol }) => {
	const { client } = useWebSocketContext();
	const confirmation = useWebSocketEvent("create_in_price_chart_config");

	const { setChartsConfigs } = useChartsContext();

	const [symbol, setSymbol] = useState<string>(fixedSymbol ?? "BTC");
	const [timeframe, setTimeframe] = useState<string>("1m");

	const [obStrategyConfig_15m, setObStrategyConfig_15m] = useState<ObStrategyType>({
		enabled: false,
		impulse_threshold: 1.5,
		impulse_window: 3,
		invalidation_candle: 2,
		include_invalidated_obs: false,
		max_orderblocks: 50,
	});
	const [obStrategyConfig_1h, setObStrategyConfig_1h] = useState<ObStrategyType>({
		enabled: false,
		impulse_threshold: 1.5,
		impulse_window: 3,
		invalidation_candle: 2,
		include_invalidated_obs: false,
		max_orderblocks: 50,
	});
	const [obStrategyConfig_4h, setObStrategyConfig_4h] = useState<ObStrategyType>({
		enabled: false,
		impulse_threshold: 1.5,
		impulse_window: 3,
		invalidation_candle: 2,
		include_invalidated_obs: false,
		max_orderblocks: 50,
	});
	const [obStrategyConfig_1d, setObStrategyConfig_1d] = useState<ObStrategyType>({
		enabled: false,
		impulse_threshold: 1.5,
		impulse_window: 3,
		invalidation_candle: 2,
		include_invalidated_obs: false,
		max_orderblocks: 50,
	});

	const [swingsConfig, setSwingsConfig] = useState<{ enabled: boolean; swing_length: number }>({
		enabled: false,
		swing_length: 8,
	});

	const [trendConfig, setTrendConfig] = useState<{ enabled: boolean; trend_length: number }>({
		enabled: false,
		trend_length: 3,
	});

	const [indicatorsConfig, setIndicatorsConfig] = useState<{
		volume_enabled: boolean;
		bos_enabled: boolean;
		ob_enabled: boolean;
	}>({ volume_enabled: true, bos_enabled: false, ob_enabled: true });

	const handleAddChart = () => {
		if (client?.isConnected()) {
			client?.send({
				type: "create_in_price_chart_config",
				data: {
					symbol: fixedSymbol ?? symbol,
					timeframe: timeframe,
					indicators_config: {
						swings: { swing_length: swingsConfig.swing_length, enabled: swingsConfig.enabled },
						trend: { trend_length: trendConfig.trend_length, enabled: trendConfig.enabled },
						volume: { enabled: indicatorsConfig.volume_enabled },
						order_blocks: { enabled: indicatorsConfig.ob_enabled },
						break_of_structure: { enabled: indicatorsConfig.bos_enabled },
					},
					strategy_config: {
						orderblock_parameters_15m: {
							enabled: obStrategyConfig_15m.enabled,
							impulse_threshold: obStrategyConfig_15m.impulse_threshold,
							impulse_window: obStrategyConfig_15m.impulse_window,
							inv_candle: obStrategyConfig_15m.invalidation_candle,
							include_invalidated_obs: obStrategyConfig_15m.include_invalidated_obs,
							max_orderblocks: obStrategyConfig_15m.max_orderblocks,
						},
						orderblock_parameters_1h: {
							enabled: obStrategyConfig_1h.enabled,
							impulse_threshold: obStrategyConfig_1h.impulse_threshold,
							impulse_window: obStrategyConfig_1h.impulse_window,
							inv_candle: obStrategyConfig_1h.invalidation_candle,
							include_invalidated_obs: obStrategyConfig_1h.include_invalidated_obs,
							max_orderblocks: obStrategyConfig_1h.max_orderblocks,
						},
						orderblock_parameters_4h: {
							enabled: obStrategyConfig_4h.enabled,
							impulse_threshold: obStrategyConfig_4h.impulse_threshold,
							impulse_window: obStrategyConfig_4h.impulse_window,
							inv_candle: obStrategyConfig_4h.invalidation_candle,
							include_invalidated_obs: obStrategyConfig_4h.include_invalidated_obs,
							max_orderblocks: obStrategyConfig_4h.max_orderblocks,
						},
						orderblock_parameters_1d: {
							enabled: obStrategyConfig_1d.enabled,
							impulse_threshold: obStrategyConfig_1d.impulse_threshold,
							impulse_window: obStrategyConfig_1d.impulse_window,
							inv_candle: obStrategyConfig_1d.invalidation_candle,
							include_invalidated_obs: obStrategyConfig_1d.include_invalidated_obs,
							max_orderblocks: obStrategyConfig_1d.max_orderblocks,
						},
					},
				},
			});
		}
	};

	const handleUpdateAfterConfirmation = () => {
		setPopupVisibilityProp(false);
		setChartsConfigs((prev) => [...prev, confirmation.chart_config]);
	};

useEffect(() => {
  if (
    confirmation?.status === "success" &&
    confirmation?.chart_config?.symbol === (fixedSymbol ?? symbol) &&
    confirmation?.chart_config?.timeframe === timeframe
  ) {
    handleUpdateAfterConfirmation();
  }
}, [confirmation, fixedSymbol, symbol, timeframe]);


	return (
		<PopupContainer
			titleProp="Add Chart"
			handleVisibilityProp={() => setPopupVisibilityProp(false)}
			handleSubmitProp={handleAddChart}
		>
			{/* Chart Parameters */}
			<div className="flex flex-col gap-4">
				{fixedSymbol ? (
				<div className="flex justify-between items-center">
					<div>Symbol</div>
					<div className="mt-1 inline-flex items-center gap-2">
					<span className="px-3 py-2 bg-gray-100 rounded-md font-semibold">{fixedSymbol}</span>
					<input type="hidden" name="symbol" value={fixedSymbol} />
					</div>
				</div>
				) : (
				<div className="flex justify-between items-center">
					<div>Symbol</div>
					<select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="p-2 rounded-xl border-2 shadow">
					{AvailableCryptos.map((crypto) => (
						<option key={crypto} value={crypto}>
						{crypto}
						</option>
					))}
					</select>
				</div>
				)}

				<div className="flex justify-between items-center">
					<div>Timeframe</div>
					<select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="p-2 rounded-xl border-2 shadow">
						{InPriceStrategyAvailableTimeframes.map((tf) => (
							<option key={tf} value={tf}>
								{tf}
							</option>
						))}
					</select>
				</div>
			</div>
			{/* 15m OB Strategy Parameters */}
			<div className="flex flex-col gap-4">
				<TitleHeading titleProp="15m OB Strategy Parameters" />
				<div className="flex justify-between items-center">
					<div>Enabled</div>
					<input
						className="form-checkbox mr-4 h-5 w-5 text-blue-600"
						type="checkbox"
						checked={obStrategyConfig_15m.enabled}
						onChange={(e) => setObStrategyConfig_15m((prev) => ({ ...prev, enabled: e.target.checked }))}
					/>
				</div>
				{obStrategyConfig_15m.enabled && (
					<InPriceConfigInputs obStrategyConfigProp={obStrategyConfig_15m} setObStrategyConfigProp={setObStrategyConfig_15m} />
				)}
			</div>
			{/* 1h OB Strategy Parameters */}
			<div className="flex flex-col gap-4">
				<TitleHeading titleProp="1h OB Strategy Parameters" />
				<div className="flex justify-between items-center">
					<div>Enabled</div>
					<input
						className="form-checkbox mr-4 h-5 w-5 text-blue-600"
						type="checkbox"
						checked={obStrategyConfig_1h.enabled}
						onChange={(e) => setObStrategyConfig_1h((prev) => ({ ...prev, enabled: e.target.checked }))}
					/>
				</div>
				{obStrategyConfig_1h.enabled && (
					<InPriceConfigInputs obStrategyConfigProp={obStrategyConfig_1h} setObStrategyConfigProp={setObStrategyConfig_1h} />
				)}
			</div>
			{/* 4h OB Strategy Parameters */}
			<div className="flex flex-col gap-4">
				<TitleHeading titleProp="4h OB Strategy Parameters" />
				<div className="flex justify-between items-center">
					<div>Enabled</div>
					<input
						className="form-checkbox mr-4 h-5 w-5 text-blue-600"
						type="checkbox"
						checked={obStrategyConfig_4h.enabled}
						onChange={(e) => setObStrategyConfig_4h((prev) => ({ ...prev, enabled: e.target.checked }))}
					/>
				</div>
				{obStrategyConfig_4h.enabled && (
					<InPriceConfigInputs obStrategyConfigProp={obStrategyConfig_4h} setObStrategyConfigProp={setObStrategyConfig_4h} />
				)}
			</div>
			{/* 1d OB Strategy Parameters */}
			<div className="flex flex-col gap-4">
				<TitleHeading titleProp="1d OB Strategy Parameters" />
				<div className="flex justify-between items-center">
					<div>Enabled</div>
					<input
						className="form-checkbox mr-4 h-5 w-5 text-blue-600"
						type="checkbox"
						checked={obStrategyConfig_1d.enabled}
						onChange={(e) => setObStrategyConfig_1d((prev) => ({ ...prev, enabled: e.target.checked }))}
					/>
				</div>
				{obStrategyConfig_1d.enabled && (
					<InPriceConfigInputs obStrategyConfigProp={obStrategyConfig_1d} setObStrategyConfigProp={setObStrategyConfig_1d} />
				)}
			</div>
			{/* Swings Indicator */}
			<div className="flex flex-col gap-4">
				<TitleHeading titleProp="Swing Indicator" />
				<div className="flex justify-between items-center">
					<div>Swings Length</div>
					<input
						className="p-2 w-24 rounded-xl border-2 shadow"
						type="number"
						step={0.5}
						value={swingsConfig.swing_length}
						onChange={(e) => setSwingsConfig((prev) => ({ ...prev, swing_length: parseFloat(e.target.value) }))}
					/>
				</div>
				<div className="flex justify-between items-center">
					<div>Enabled</div>
					<input
						className="form-checkbox mr-4 h-5 w-5 text-blue-600"
						type="checkbox"
						checked={swingsConfig.enabled}
						onChange={(e) => setSwingsConfig((prev) => ({ ...prev, enabled: e.target.checked }))}
					/>
				</div>
			</div>
			{/* Trend Indicator */}
			<div className="flex flex-col gap-4">
				<TitleHeading titleProp="Trend Indicator" />
				<div className="flex justify-between items-center">
					<div>Trend Length</div>
					<input
						className="p-2 w-24 rounded-xl border-2 shadow"
						type="number"
						step={1}
						value={trendConfig.trend_length}
						onChange={(e) => setTrendConfig((prev) => ({ ...prev, trend_length: parseFloat(e.target.value) }))}
					/>
				</div>
				<div className="flex justify-between items-center">
					<div>Enabled</div>
					<input
						className="form-checkbox mr-4 h-5 w-5 text-blue-600"
						type="checkbox"
						checked={trendConfig.enabled}
						onChange={(e) => setTrendConfig((prev) => ({ ...prev, enabled: e.target.checked }))}
					/>
				</div>
			</div>
			{/* Volume Indicator */}
			<div className="flex flex-col gap-4">
				<TitleHeading titleProp="Volume Indicator" />

				<div className="flex justify-between items-center">
					<div>Enabled</div>
					<input
						className="form-checkbox mr-4 h-5 w-5 text-blue-600"
						type="checkbox"
						checked={indicatorsConfig.volume_enabled}
						onChange={(e) => setIndicatorsConfig((prev) => ({ ...prev, volume_enabled: e.target.checked }))}
					/>
				</div>
			</div>
			{/* OB Indicator */}
			<div className="flex flex-col gap-4">
				<TitleHeading titleProp="OB Indicator" />

				<div className="flex justify-between items-center">
					<div>Enabled</div>
					<input
						className="form-checkbox mr-4 h-5 w-5 text-blue-600"
						type="checkbox"
						checked={indicatorsConfig.ob_enabled}
						onChange={(e) => setIndicatorsConfig((prev) => ({ ...prev, ob_enabled: e.target.checked }))}
					/>
				</div>
			</div>
			{/* BoS Indicator */}
			<div className="flex flex-col gap-4">
				<TitleHeading titleProp="BoS Indicator" />
				<div className="flex justify-between items-center">
					<div>Enabled</div>
					<input
						className="form-checkbox mr-4 h-5 w-5 text-blue-600"
						type="checkbox"
						checked={indicatorsConfig.bos_enabled}
						onChange={(e) => setIndicatorsConfig((prev) => ({ ...prev, bos_enabled: e.target.checked }))}
					/>
				</div>
			</div>
		</PopupContainer>
	);
};

export default AddInPriceChartPopup;
