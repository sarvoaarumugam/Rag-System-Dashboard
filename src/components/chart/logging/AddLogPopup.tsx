import React, { SetStateAction, useEffect, useState } from "react";
import { useObSuggestionsContext } from "../../../context/ObSuggestionsContext";
import { useIndividualChartContext } from "../../../context/IndividualChartContext";
import PopupContainer from "../../common/PopupContainer";
import { useWebSocketContext } from "../../../context/WebSocketContext";
import { useWebSocketEvent } from "../../../hooks/UseWebSocketEvent";
interface AddLogPopupProps {
	setPopupVisibilityProp: React.Dispatch<SetStateAction<boolean>>;
}

const AddLogPopup: React.FC<AddLogPopupProps> = ({ setPopupVisibilityProp }) => {
	const { selectedSuggestion, setSuggestions } = useObSuggestionsContext();
	const confirmation = useWebSocketEvent("log_trade_data");

	const { chartConfig } = useIndividualChartContext();

	const [capitalInvested, setCapitalInvested] = useState<number>(1000);
	const [entryDateTime, setEntryDateTime] = useState<{ date: string; time: string }>({ date: "", time: "" });
	const [prices, setPrices] = useState<{ entry: number; stop_loss: number; take_profit: number }>({
		entry: selectedSuggestion?.type === "bullish" ? selectedSuggestion!.zone_high : selectedSuggestion!.zone_low,
		stop_loss:
			selectedSuggestion?.type === "bullish" ? selectedSuggestion!.zone_low * 0.99 : selectedSuggestion!.zone_high * 0.99,
		take_profit:
			selectedSuggestion?.type === "bullish" ? selectedSuggestion!.zone_low * 1.01 : selectedSuggestion!.zone_high * 1.01,
	});

	const [tradeRemarks, setTradeRemarks] = useState<string>("");

	const { client } = useWebSocketContext();

	useEffect(() => {
		if (!confirmation) return;

		if (confirmation?.status === "success") {
			setPopupVisibilityProp(false);
			setSuggestions((prev) => prev.filter((suggestion) => suggestion.timestamp !== confirmation.ob_timestamp));
		}
	}, [confirmation]);

	const handleSubmit = () => {
		const data = {
			symbol: chartConfig?.symbol,
			timeframe: chartConfig?.timeframe,

			impulse_threshold: chartConfig?.strategy_config.orderblock_parameters.impulse_threshold,
			impulse_window: chartConfig?.strategy_config.orderblock_parameters.impulse_window,

			initial_capital: capitalInvested,
			entry_time: `${entryDateTime.date} ${entryDateTime.time}`,
			entry_price: prices.entry,

			take_profit: prices.take_profit,
			stop_loss: prices.stop_loss,

			remarks: tradeRemarks,
			ob_timestamp: selectedSuggestion?.timestamp,
		};
		console.log(data);

		if (client?.isConnected()) {
			client?.send({
				type: "log_trade_data",
				data: data,
			});
		}
	};

	return (
		<PopupContainer
			handleSubmitProp={handleSubmit}
			submitDisabledProp={!entryDateTime.date || !entryDateTime.time}
			titleProp="Add Trade Log"
			handleVisibilityProp={() => setPopupVisibilityProp(false)}
		>
			{/* Chart Parameters */}
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-4">
					<div className="w-full border"></div>
					<div className="whitespace-nowrap font-semibold text-black/50">Chart Parameters</div>
					<div className="w-full border"></div>
				</div>
				{/* Symbol */}
				<div className="flex justify-between items-center">
					<div>Symbol</div>
					<div className="p-2  rounded-xl border-2 shadow text-center bg-white">{chartConfig?.symbol}</div>
				</div>
				{/* Timeframe */}
				<div className="flex justify-between items-center">
					<div>Timeframe</div>
					<div className="p-2  rounded-xl border-2 shadow text-center bg-white">{chartConfig?.timeframe}</div>
				</div>
			</div>
			{/* Strategy Parameters */}
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-4">
					<div className="w-full border"></div>
					<div className="whitespace-nowrap font-semibold text-black/50">Strategy Parameters</div>
					<div className="w-full border"></div>
				</div>
				{/* Impulse Threshold */}
				<div className="flex justify-between items-center">
					<div>Impulse Threshold</div>
					<div className="p-2  rounded-xl border-2 shadow text-center bg-white">
						{chartConfig?.strategy_config.orderblock_parameters.impulse_threshold} %
					</div>
				</div>
				{/* Impulse Window */}
				<div className="flex justify-between items-center">
					<div>Impulse Window</div>
					<div className="p-2 min-w-12 rounded-xl border-2 shadow text-center bg-white">
						{chartConfig?.strategy_config.orderblock_parameters.impulse_window}
					</div>
				</div>
			</div>
			{/* Entry Parameters */}
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-4">
					<div className="w-full border"></div>
					<div className="whitespace-nowrap font-semibold text-black/50">Entry Parameters</div>
					<div className="w-full border"></div>
				</div>
				{/* Capital */}
				<div className="flex justify-between items-center">
					<div>Capital Invested</div>
					<input
						className="p-2 w-36 rounded-xl border-2 shadow"
						type="number"
						value={capitalInvested}
						onChange={(e) => setCapitalInvested(parseInt(e.target.value))}
					/>
				</div>
				{/* Entry Date % */}
				<div className="flex justify-between items-center">
					<div>Entry Date</div>
					<input
						className="p-2 w-36 rounded-xl border-2 shadow"
						type="date"
						value={entryDateTime.date}
						onChange={(e) => setEntryDateTime((prev) => ({ ...prev, date: e.target.value }))}
					/>
				</div>
				{/* Entry Time % */}
				<div className="flex justify-between items-center">
					<div>Entry Time</div>
					<input
						className="p-2 w-36 rounded-xl border-2 shadow"
						type="time"
						step={1}
						value={entryDateTime.time}
						onChange={(e) => setEntryDateTime((prev) => ({ ...prev, time: e.target.value }))}
					/>
				</div>
				{/* Entry Price % */}
				<div className="flex justify-between items-center">
					<div>Entry Price</div>
					<input
						className="p-2 w-36 rounded-xl border-2 shadow"
						type="number"
						value={prices.entry}
						onChange={(e) => setPrices((prev) => ({ ...prev, entry: parseFloat(e.target.value) }))}
					/>
				</div>
			</div>
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-4">
					<div className="w-full border"></div>
					<div className="whitespace-nowrap font-semibold text-black/50">Exit Parameters</div>
					<div className="w-full border"></div>
				</div>
				{/* Stop Loss % */}
				<div className="flex justify-between items-center">
					<div>Stop Loss</div>
					<input
						className="p-2 w-36 rounded-xl border-2 shadow"
						type="number"
						value={prices.stop_loss}
						onChange={(e) => setPrices((prev) => ({ ...prev, stop_loss: parseFloat(e.target.value) }))}
					/>
				</div>
				{/* Take Profit % */}
				<div className="flex justify-between items-center">
					<div>Take Profit</div>
					<input
						className="p-2 w-36 rounded-xl border-2 shadow"
						type="number"
						value={prices.take_profit}
						onChange={(e) => setPrices((prev) => ({ ...prev, take_profit: parseFloat(e.target.value) }))}
					/>
				</div>
			</div>
			{/* Trade Remarks */}
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-4">
					<div className="w-full border"></div>
					<div className="whitespace-nowrap font-semibold text-black/50">Trade Remarks</div>
					<div className="w-full border"></div>
				</div>

				<textarea
					className="p-2 w-full rounded-xl border-2 shadow"
					value={tradeRemarks}
					onChange={(e) => setTradeRemarks(e.target.value)}
				/>
			</div>
		</PopupContainer>
	);
};

export default AddLogPopup;
