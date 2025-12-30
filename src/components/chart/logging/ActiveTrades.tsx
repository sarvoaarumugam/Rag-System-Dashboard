import { useEffect, useState } from "react";
import { useIndividualChartContext } from "../../../context/IndividualChartContext";
import PopupContainer from "../../common/PopupContainer";
import { List, LogOut } from "lucide-react";
import ExitTradePopup from "./ExitTradePopup";
import { useWebSocketContext } from "../../../context/WebSocketContext";
import { useWebSocketEvent } from "../../../hooks/UseWebSocketEvent";
import { ActiveTradesLogType } from "../../../types/LogsType";

const ActiveTrades = () => {
	const { chartConfig } = useIndividualChartContext();
	const [listPopupVisibility, setListPopupVisibility] = useState<boolean>(false);

	const [formPopupVisibility, setFormPopupVisibility] = useState<boolean>(false);

	const activeTradesData = useWebSocketEvent("get_active_trades");

	const [activeTradeLogs, setActiveTradeLogs] = useState<ActiveTradesLogType[]>([]);

	const [selectedLog, setSelectedLog] = useState<ActiveTradesLogType>();

	const { client } = useWebSocketContext();

	useEffect(() => {
		if (!chartConfig || !listPopupVisibility) return;

		if (client?.isConnected()) {
			client.send({
				type: "get_active_trades",
				data: {
					symbol: chartConfig?.symbol,
					timeframe: chartConfig?.timeframe,
				},
			});
		}
	}, [listPopupVisibility]);

	useEffect(() => {
		if (activeTradesData && activeTradesData?.status === "success") {
			console.log(activeTradesData);
			setActiveTradeLogs(activeTradesData?.trades);
		}
	}, [activeTradesData]);

	return (
		<>
			{/* List Button */}
			<button
				className="rounded-full group bg-blue-100 cursor-pointer text-blue-500 h-10 w-10 flex items-center justify-center p-1 hover:opacity-50"
				onClick={() => setListPopupVisibility(true)}
			>
				<List className="group-hover:p-0 p-[2px] transition-all duration-500 ease-in-out" />
			</button>
			{/* Popup */}
			{listPopupVisibility && (
				<PopupContainer
					titleProp={`Active Trades for ${chartConfig?.symbol} - ${chartConfig?.timeframe}`}
					handleVisibilityProp={() => {
						setListPopupVisibility(false);
					}}
				>
					{/* Active Trades List */}
					<div className="w-full flex flex-col gap-2">
						{activeTradeLogs.length > 0 &&
							activeTradeLogs.map((log) => (
								<div
									key={log.ob_timestamp}
									className="border w-full rounded-lg p-2 hover:cursor-pointer flex flex-col gap-1 hover:shadow"
								>
									<div className="flex justify-between">
										<div className="text-sm">
											<span className="font-bold text-black/50">OB Timestamp :</span> {log.ob_timestamp}
										</div>
									</div>
									<div className="flex justify-between">
										<div className="text-sm">
											<span className="font-bold text-black/50">Capital Invested :</span> {log.initial_capital}
										</div>
									</div>
									<div className="flex justify-between">
										<div className="text-sm">
											<span className="font-bold text-black/50">Entry Time :</span> {log.entry_time}
										</div>
									</div>
									<button
										className="bg-blue-200 gap-1 flex items-center justify-center rounded-xl text-blue-500  group hover:opacity-50 p-1"
										onClick={() => {
											setSelectedLog(log);
											setListPopupVisibility(false);
											setFormPopupVisibility(true);
										}}
									>
										<div>Log Exit</div>
										<LogOut className="group-hover:p-0 p-[2px] duration-300 ease-in-out" />
									</button>
								</div>
							))}
					</div>
					{/* Exit Trade Popup */}
				</PopupContainer>
			)}
			{formPopupVisibility && selectedLog && (
				<ExitTradePopup
					handleVisibilityProp={() => {
						setListPopupVisibility(true);
						setFormPopupVisibility(false);
					}}
					logDataProp={selectedLog}
				/>
			)}
		</>
	);
};

export default ActiveTrades;
