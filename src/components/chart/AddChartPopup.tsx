import { SetStateAction, useEffect, useState } from "react";
import { useChartsContext } from "../../context/ChartsContext";
import { useWebSocketContext } from "../../context/WebSocketContext";
import { useWebSocketEvent } from "../../hooks/UseWebSocketEvent";
import PopupContainer from "../common/PopupContainer";
import { AvailableCryptos } from "../../configs/AvailableCryptos";
import { AvailableTimeFrames } from "../../configs/AvailableTimeframes";
import TitleHeading from "../common/TitleHeading";

interface AddChartPopupProps {
	setPopupVisibilityProp: React.Dispatch<SetStateAction<boolean>>;
	fixedSymbol?: string;
}

const AddChartPopup: React.FC<AddChartPopupProps> = ({ setPopupVisibilityProp, fixedSymbol }) => {
	const { client } = useWebSocketContext();
	const confirmation = useWebSocketEvent("create_chart_config");

	const { setChartsConfigs } = useChartsContext();

	const [symbol, setSymbol] = useState<string>(fixedSymbol ?? "BTC");
	const [timeframe, setTimeframe] = useState<string>("15m");

	const [obStrategyConfig, setObStrategyConfig] = useState<{ impulse_threshold: number; impulse_window: number }>({
		impulse_threshold: 1.5,
		impulse_window: 3,
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
				type: "create_chart_config",
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
						orderblock_parameters: {
							impulse_threshold: obStrategyConfig.impulse_threshold,
							impulse_window: obStrategyConfig.impulse_window,
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
				<TitleHeading titleProp="Chart Parameters" />
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
						{AvailableTimeFrames.map((tf) => (
							<option key={tf} value={tf}>
								{tf}
							</option>
						))}
					</select>
				</div>
			</div>
			{/* OB Strategy Parameters */}
			<div className="flex flex-col gap-4">
				<TitleHeading titleProp="OB Strategy Parameters" />
				<div className="flex justify-between items-center">
					<div>Impulse Threshold</div>
					<input
						className="p-2 w-24 rounded-xl border-2 shadow"
						type="number"
						step={0.5}
						value={obStrategyConfig.impulse_threshold}
						onChange={(e) => setObStrategyConfig((prev) => ({ ...prev, impulse_threshold: parseFloat(e.target.value) }))}
					/>
				</div>
				<div className="flex justify-between items-center">
					<div>Impulse Window</div>
					<input
						className="p-2 w-24 rounded-xl border-2 shadow"
						type="number"
						step={1}
						value={obStrategyConfig.impulse_window}
						onChange={(e) => setObStrategyConfig((prev) => ({ ...prev, impulse_window: parseFloat(e.target.value) }))}
					/>
				</div>
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

export default AddChartPopup;
