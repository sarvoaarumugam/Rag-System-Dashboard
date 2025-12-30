import { useEffect, useState } from "react";
import { ActiveTradesLogType } from "../../../types/LogsType";
import PopupContainer from "../../common/PopupContainer";
import { useWebSocketEvent } from "../../../hooks/UseWebSocketEvent";
import { useWebSocketContext } from "../../../context/WebSocketContext";

interface ExitTradePopupProps {
	logDataProp: ActiveTradesLogType;
	handleVisibilityProp: () => void;
}

const ExitTradePopup: React.FC<ExitTradePopupProps> = ({ logDataProp, handleVisibilityProp }) => {
	const [capitalAtExit, setCapitalAtExit] = useState<number>();
	const [exitDateTime, setExitDateTime] = useState<{ date: string; time: string }>({ date: "", time: "" });

	const [tradeRemarks, setTradeRemarks] = useState<string>(logDataProp.remarks);

	const confirmation = useWebSocketEvent("end_trade_task");
	const { client } = useWebSocketContext();

	useEffect(() => {
		if (!confirmation) return;

		if (confirmation?.status === "success") {
			handleVisibilityProp();
		}
	}, [confirmation]);

	const handleSubmit = () => {
		const data = {
			...logDataProp,
			exit_capital: capitalAtExit,
			end_time: `${exitDateTime.date} ${exitDateTime.time}`,
		};

		console.log(data);

		if (client?.isConnected()) {
			client?.send({
				type: "end_trade_task",
				data: data,
			});
		}
	};

	return (
		<PopupContainer
			titleProp="Exit Trade Log"
			handleVisibilityProp={handleVisibilityProp}
			isChildProp={true}
			handleSubmitProp={handleSubmit}
			submitDisabledProp={!capitalAtExit || !exitDateTime.date || !exitDateTime.time}
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
					<div className="p-2  rounded-xl border-2 shadow text-center bg-white">{logDataProp.symbol}</div>
				</div>
				{/* Timeframe */}
				<div className="flex justify-between items-center">
					<div>Timeframe</div>
					<div className="p-2  rounded-xl border-2 shadow text-center bg-white">{logDataProp.timeframe}</div>
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
					<div className="p-2  rounded-xl border-2 shadow text-center bg-white">{logDataProp.initial_capital}</div>
				</div>
				{/* Entry Date % */}
				<div className="flex justify-between items-center">
					<div>Entry Date & Time</div>
					<div className="p-2  rounded-xl border-2 shadow text-center bg-white">{logDataProp.entry_time}</div>
				</div>
			</div>
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-4">
					<div className="w-full border"></div>
					<div className="whitespace-nowrap font-semibold text-black/50">Exit Parameters</div>
					<div className="w-full border"></div>
				</div>
				<div className="flex justify-between items-center">
					<div>Capital at exit</div>
					<input
						className="p-2 w-36 rounded-xl border-2 shadow"
						type="number"
						value={capitalAtExit}
						onChange={(e) => setCapitalAtExit(parseInt(e.target.value))}
					/>
				</div>
				{/* Exit Date % */}
				<div className="flex justify-between items-center">
					<div>Exit Date</div>
					<input
						className="p-2 w-36 rounded-xl border-2 shadow"
						type="date"
						value={exitDateTime.date}
						onChange={(e) => setExitDateTime((prev) => ({ ...prev, date: e.target.value }))}
					/>
				</div>
				{/* Exit Time % */}
				<div className="flex justify-between items-center">
					<div>Exit Time</div>
					<input
						className="p-2 w-36 rounded-xl border-2 shadow"
						type="time"
						step={1}
						value={exitDateTime.time}
						onChange={(e) => setExitDateTime((prev) => ({ ...prev, time: e.target.value }))}
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

export default ExitTradePopup;
