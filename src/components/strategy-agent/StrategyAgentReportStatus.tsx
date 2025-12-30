import { useEffect, useState } from "react";
import { useWebSocketEvent } from "../../hooks/UseWebSocketEvent";

type AgentReportStatus = {
	status: "multi_backtest_orderblocks_progress";
	message: string;
	progress?: {
		progress: number;
		current_combo: number;
		total_combination: number;
	};
};

const StrategyAgentReportStatus = () => {
	const statusUpdate = useWebSocketEvent("backtest_orderblock_status");

	const [status, setStatus] = useState<AgentReportStatus>();

	useEffect(() => {
		if (statusUpdate) {
			setStatus(statusUpdate);
		}
	}, [statusUpdate]);

	return (
		<div className="text-2xl font-semibold text-black/20 h-[calc(100vh-160px)]  flex items-center justify-center">
			{status?.message}
		</div>
	);
};

export default StrategyAgentReportStatus;
