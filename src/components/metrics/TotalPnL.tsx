import { useEffect, useState } from "react";
import { useWebSocketContext } from "../../context/WebSocketContext";
import { useWebSocketEvent } from "../../hooks/UseWebSocketEvent";
import { TotalPnLType } from "../../types/MetricsType";

const TotalPnL = () => {
	const { client } = useWebSocketContext();

	const [pnlData, setPnlData] = useState<TotalPnLType>();

	const pnlInfoRawData = useWebSocketEvent("total_pnl");

	useEffect(() => {
		if (client?.isConnected()) {
			client.send({ type: "total_pnl" });
		}
	}, []);

	useEffect(() => {
		if (pnlInfoRawData && pnlInfoRawData?.status === "success") {
			setPnlData(pnlInfoRawData);
		}
	}, [pnlInfoRawData]);

	return (
		<div className="w-2/3 h-full flex gap-5 ">
			<div className="w-1/2 h-full border rounded-2xl p-5">
				<div className="flex flex-col h-full gap-6 items-center justify-center">
					<div className="text-2xl font-semibold text-black/50">Total PnL ( in % ) </div>
					{pnlData ? (
						<div
							className={`p-1 text-5xl rounded-xl font-semibold ${
								pnlData?.pnl.pnl_status === "profit"
									? "bg-green-50 border border-green-400 text-green-500"
									: "bg-red-50 border border-red-400 text-red-500"
							}`}
						>
							{pnlData?.pnl.percent} %
						</div>
					) : (
						<div className="w-64 h-16 border-gray-300 animate-pulse border bg-gray-100 rounded-xl"></div>
					)}
				</div>
			</div>
			<div className="w-1/2 h-full border rounded-2xl p-5">
				<div className="flex flex-col h-full gap-6 items-center justify-center">
					<div className="text-2xl font-semibold text-black/50">Total PnL ( in USD ) </div>
					{pnlData ? (
						<div
							className={`flex gap-1 text-5xl font-semibold items-end rounded-xl p-1 ${
								pnlData?.pnl.pnl_status === "profit"
									? "bg-green-50 border border-green-400 text-green-500"
									: "bg-red-50 border border-red-400 text-red-500"
							}`}
						>
							<span>{pnlData?.pnl.pnl_status === "profit" ? "+" : "-"}</span>
							<span>{pnlData?.pnl.amount}</span>
						</div>
					) : (
						<div className="w-64 h-16 border-gray-300 animate-pulse border bg-gray-100 rounded-xl"></div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TotalPnL;
