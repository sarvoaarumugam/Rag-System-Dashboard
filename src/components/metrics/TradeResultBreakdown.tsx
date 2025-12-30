import { useEffect, useState } from "react";
import { useWebSocketContext } from "../../context/WebSocketContext";
import TradeResultBreakdownChart from "./TradeResultBreakdownChart";
import { useWebSocketEvent } from "../../hooks/UseWebSocketEvent";
import { BreakdownDataType } from "../../types/MetricsType";

const TradeResultBreakdown = () => {
	const { client } = useWebSocketContext();

	const [tradeBreakdownData, setTradeBreakdownData] = useState<BreakdownDataType>();

	const tradesBreakdown = useWebSocketEvent("trade_result_breakdown");

	useEffect(() => {
		if (tradesBreakdown && tradesBreakdown?.breakdown) {
			setTradeBreakdownData(tradesBreakdown.breakdown);
		}
	}, [tradesBreakdown]);

	useEffect(() => {
		if (client?.isConnected()) {
			client.send({ type: "trade_result_breakdown" });
		}
	}, []);

	return (
		<div className="w-1/3 h-full border rounded-2xl p-5">
			<div className="flex flex-col items-center w-full h-full">
				{tradeBreakdownData ? (
					<>
						{tradeBreakdownData.profitable + tradeBreakdownData.non_profitable === 0 ? (
							<div className="w-full h-full flex flex-col gap-2 items-center justify-center text-center">
								<div className=" text-black/50 font-semibold rounded-xl text-2xl">No Trades Found</div>
								<div className="text-black/40">Log trades to see the breakdown</div>
							</div>
						) : (
							<>
								<div className="text-2xl font-semibold text-black/50">
									Total Trades : {tradeBreakdownData.profitable + tradeBreakdownData.non_profitable}
								</div>

								<div className="w-full h-full">
									<TradeResultBreakdownChart breakdownDataProp={tradeBreakdownData} />
								</div>
							</>
						)}
					</>
				) : (
					<div className="flex flex-col gap-6 items-center justify-center">
						<div className="w-48 h-12 border-gray-300 animate-pulse border bg-gray-100 rounded-xl"></div>
						<div className="w-64 h-48 border-gray-300 animate-pulse border bg-gray-100 rounded-xl"></div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TradeResultBreakdown;
