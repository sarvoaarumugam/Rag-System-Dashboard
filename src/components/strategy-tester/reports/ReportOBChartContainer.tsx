import { SetStateAction, useEffect, useState } from "react";
import { useWebSocketContext } from "../../../context/WebSocketContext";

import { useWebSocketEvent } from "../../../hooks/UseWebSocketEvent";
import { ObChartType } from "../../../types/ObChartType";
import { X } from "lucide-react";
import ReportOBChart from "./ReportOBChart";

interface ReportOBChartContainerProps {
	symbolProp: string;
	timeframeProp: string;
	reportDataProp: {
		zone_high: number;
		zone_low: number;
		ob_timestamp: string;
		ob_type: string;
		entry_timestamp: string;
		entry_price: number;
		exit_timestamp: string;
		exit_price: number;

		exits_info?: Array<{
			exit_type?: string;
			exit_timestamp?: string;
			exit_price?: number | null;
			portion_closed?: number | null;
			// include any other fields your exits objects have
			[key: string]: any;
		}>;
	};
	setPopupVisibilityProp: React.Dispatch<SetStateAction<boolean>>;
}

const ReportOBChartContainer: React.FC<ReportOBChartContainerProps> = ({
	symbolProp,
	timeframeProp,
	reportDataProp,
	setPopupVisibilityProp,
}) => {
	const { client } = useWebSocketContext();

	const rawCandleData = useWebSocketEvent("get_candles_around_ob");

	const [candleData, setCandleData] = useState<ObChartType | null>(null);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (client?.isConnected()) {
			setIsLoading(true);

			client?.send({
				type: "get_candles_around_ob",
				data: {
					symbol: symbolProp,
					timeframe: timeframeProp,
					ob_time: reportDataProp.ob_timestamp,
					exit_time: reportDataProp.exit_timestamp,
				},
			});
		}
	}, []);

	useEffect(() => {
		if (rawCandleData && rawCandleData?.status === "success") {
			setCandleData(rawCandleData);
			setIsLoading(false);
		}
	}, [rawCandleData]);

	return (
		<div className="inset-0 fixed z-50 flex items-center justify-center bg-black/20 shadow-[inset_0px_4px_80px_0px_rgba(157,44,255,1),inset_0px_-3px_210px_rgba(44,83,255,1)]">
			<div className="bg-[#F6F6F6] w-screen h-screen max-w-[calc(100vw-128px)] max-h-[calc(100vh-128px)] rounded-2xl border border-[#BABABA] shadow-[0px_4px_45px_0px_rgba(0,0,0,0.25)] p-6 relative min-w-[460px]">
				{/* Close Button */}
				<button
					onClick={() => setPopupVisibilityProp(false)}
					className="absolute -top-4 -right-12 rounded-full bg-black/60 cursor-pointer text-white p-1 hover:opacity-50"
				>
					<X />
				</button>
				<div className="w-full h-full flex flex-col items-center gap-2">
					<div className="font-semibold text-2xl">{`OB Chart - (timestamp : ${reportDataProp.ob_timestamp})`}</div>
					<ReportOBChart candleDataProp={candleData} isLoadingProp={isLoading} reportDataProp={reportDataProp} />
				</div>
			</div>
		</div>
	);
};

export default ReportOBChartContainer;
