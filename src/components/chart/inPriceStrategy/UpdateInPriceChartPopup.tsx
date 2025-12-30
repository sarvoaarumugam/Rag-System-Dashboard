import { SetStateAction, useEffect, useState } from "react";

import { useWebSocketContext } from "../../../context/WebSocketContext";
import { useWebSocketEvent } from "../../../hooks/UseWebSocketEvent";
import PopupContainer from "../../common/PopupContainer";

import TitleHeading from "../../common/TitleHeading";
import { useIndividualChartContext } from "../../../context/IndividualChartContext";
import { ObStrategyType } from "./AddInPriceChartPopup";
import InPriceConfigInputs from "./InPriceConfigInputs";

interface UpdateInPriceChartPopupProps {
	setPopupVisibilityProp: React.Dispatch<SetStateAction<boolean>>;
}

const UpdateInPriceChartPopup: React.FC<UpdateInPriceChartPopupProps> = ({ setPopupVisibilityProp }) => {
	const { client } = useWebSocketContext();
	const confirmation = useWebSocketEvent("update_in_price_chart_config");

	const { chartConfig, setChartConfig } = useIndividualChartContext();

	const [obStrategyConfig_15m, setObStrategyConfig_15m] = useState<ObStrategyType>({
		enabled: chartConfig?.strategy_config?.orderblock_parameters_15m?.enabled || false,
		impulse_threshold: chartConfig?.strategy_config?.orderblock_parameters_15m?.impulse_threshold || 0,
		impulse_window: chartConfig?.strategy_config?.orderblock_parameters_15m?.impulse_window || 0,
		invalidation_candle: chartConfig?.strategy_config?.orderblock_parameters_15m?.inv_candle || 0,
		include_invalidated_obs: chartConfig?.strategy_config?.orderblock_parameters_15m?.include_invalidated_obs || false,
		max_orderblocks: chartConfig?.strategy_config?.orderblock_parameters_15m?.max_orderblocks || 0,
	});
	const [obStrategyConfig_1h, setObStrategyConfig_1h] = useState<ObStrategyType>({
		enabled: chartConfig?.strategy_config?.orderblock_parameters_1h?.enabled || false,
		impulse_threshold: chartConfig?.strategy_config?.orderblock_parameters_1h?.impulse_threshold || 0,
		impulse_window: chartConfig?.strategy_config?.orderblock_parameters_1h?.impulse_window || 0,
		invalidation_candle: chartConfig?.strategy_config?.orderblock_parameters_1h?.inv_candle || 0,
		include_invalidated_obs: chartConfig?.strategy_config?.orderblock_parameters_1h?.include_invalidated_obs || false,
		max_orderblocks: chartConfig?.strategy_config?.orderblock_parameters_1h?.max_orderblocks || 0,
	});
	const [obStrategyConfig_4h, setObStrategyConfig_4h] = useState<ObStrategyType>({
		enabled: chartConfig?.strategy_config?.orderblock_parameters_4h?.enabled || false,
		impulse_threshold: chartConfig?.strategy_config?.orderblock_parameters_4h?.impulse_threshold || 0,
		impulse_window: chartConfig?.strategy_config?.orderblock_parameters_4h?.impulse_window || 0,
		invalidation_candle: chartConfig?.strategy_config?.orderblock_parameters_4h?.inv_candle || 0,
		include_invalidated_obs: chartConfig?.strategy_config?.orderblock_parameters_4h?.include_invalidated_obs || false,
		max_orderblocks: chartConfig?.strategy_config?.orderblock_parameters_4h?.max_orderblocks || 0,
	});

	const [obStrategyConfig_1d, setObStrategyConfig_1d] = useState<ObStrategyType>({
		enabled: chartConfig?.strategy_config?.orderblock_parameters_1d?.enabled || false,
		impulse_threshold: chartConfig?.strategy_config?.orderblock_parameters_1d?.impulse_threshold || 0,
		impulse_window: chartConfig?.strategy_config?.orderblock_parameters_1d?.impulse_window || 0,
		invalidation_candle: chartConfig?.strategy_config?.orderblock_parameters_1d?.inv_candle || 0,
		include_invalidated_obs: chartConfig?.strategy_config?.orderblock_parameters_1d?.include_invalidated_obs || false,
		max_orderblocks: chartConfig?.strategy_config?.orderblock_parameters_1d?.max_orderblocks || 0,
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
	}>({
		volume_enabled: chartConfig?.indicators_config.volume.enabled || false,
		bos_enabled: chartConfig?.indicators_config.break_of_structure.enabled || false,
	});

	const handleAddChart = () => {
		if (client?.isConnected()) {
			client?.send({
				type: "update_in_price_chart_config",
				data: {
					symbol: chartConfig?.symbol,
					timeframe: chartConfig?.timeframe,
					indicators_config: {
						swings: { swing_length: swingsConfig.swing_length, enabled: swingsConfig.enabled },
						trend: { trend_length: trendConfig.trend_length, enabled: trendConfig.enabled },
						volume: { enabled: indicatorsConfig.volume_enabled },
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
			titleProp="Update Chart"
			handleVisibilityProp={() => setPopupVisibilityProp(false)}
			handleSubmitProp={handleAddChart}
		>
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

export default UpdateInPriceChartPopup;
