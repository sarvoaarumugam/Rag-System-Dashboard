import { SetStateAction, useEffect, useState } from "react";
import { useWebSocketContext } from "../../context/WebSocketContext";
import { useWebSocketEvent } from "../../hooks/UseWebSocketEvent";
import { useIndividualChartContext } from "../../context/IndividualChartContext";
import PopupContainer from "../common/PopupContainer";
import TitleHeading from "../common/TitleHeading";

interface UpdateChartPopupProps {
	setPopupVisibilityProp: React.Dispatch<SetStateAction<boolean>>;
}

const UpdateChartPopup: React.FC<UpdateChartPopupProps> = ({ setPopupVisibilityProp }) => {
	const { client } = useWebSocketContext();
	const confirmation = useWebSocketEvent("update_chart_config");

	const { chartConfig, setChartConfig } = useIndividualChartContext();

	const [obStrategyConfig, setObStrategyConfig] = useState<{ impulse_threshold: number; impulse_window: number; inv_candle: number; }>({
		impulse_threshold: chartConfig?.strategy_config.orderblock_parameters.impulse_threshold || 0,
		impulse_window: chartConfig?.strategy_config.orderblock_parameters.impulse_window || 0,
		inv_candle: chartConfig?.strategy_config.orderblock_parameters.inv_candle  ?? 2,
	});

	const [swingsConfig, setSwingsConfig] = useState<{ enabled: boolean; swing_length: number }>({
		enabled: chartConfig?.indicators_config.swings.enabled || false,
		swing_length: chartConfig?.indicators_config.swings.swing_length || 0,
	});

	const [trendConfig, setTrendConfig] = useState<{ enabled: boolean; trend_length: number }>({
		enabled: chartConfig?.indicators_config.trend.enabled || false,
		trend_length: chartConfig?.indicators_config.trend.trend_length || 0,
	});

	const [indicatorsConfig, setIndicatorsConfig] = useState<{
		volume_enabled: boolean;
		bos_enabled: boolean;
		ob_enabled: boolean;
	}>({
		volume_enabled: chartConfig?.indicators_config.volume.enabled || false,
		bos_enabled: chartConfig?.indicators_config.break_of_structure.enabled || false,
		ob_enabled: chartConfig?.indicators_config.order_blocks.enabled || false,
	});

	const handleUpdateChart = () => {
		if (client?.isConnected()) {
			client?.send({
				type: "update_chart_config",
				data: {
					symbol: chartConfig?.symbol,
					timeframe: chartConfig?.timeframe,
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
							inv_candle: obStrategyConfig.inv_candle,
						},
					},
				},
			});
		}
	};

	const handleUpdateAfterConfirmation = () => {
		if (chartConfig === null) return;

		setChartConfig(confirmation?.chart_config);
		setPopupVisibilityProp(false);
	};

	useEffect(() => {
		if (
			confirmation?.status === "success" &&
			confirmation?.chart_config?.symbol === chartConfig?.symbol &&
			confirmation?.chart_config?.timeframe === chartConfig?.timeframe
		) {
			handleUpdateAfterConfirmation();
		}
	}, [confirmation]);

	return (
		<PopupContainer
			handleVisibilityProp={() => setPopupVisibilityProp(false)}
			titleProp="Update Chart"
			handleSubmitProp={handleUpdateChart}
		>
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
				<div className="flex justify-between items-center">
					<div>Invalidation Candle</div>
					<input
						className="p-2 w-24 rounded-xl border-2 shadow"
						type="number"
						step={1}
						value={obStrategyConfig.inv_candle}
						onChange={(e) => setObStrategyConfig((prev) => ({ ...prev, inv_candle: parseFloat(e.target.value) }))}
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

export default UpdateChartPopup;
