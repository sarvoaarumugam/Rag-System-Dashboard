import { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import PageTitle from "../../components/common/PageTitle";
import StrategyAgentInputs from "../../components/strategy-agent/StrategyAgentInputs";
import StrategyAgentMetrics from "../../components/strategy-agent/StrategyAgentMetrics";
import { useParams } from "react-router-dom";
import { useWebSocketEvent } from "../../hooks/UseWebSocketEvent";
import { useNotificationContext } from "../../context/NotificationContext";

const StrategyAgentCreatePage = () => {
	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	const savedConfirmation = useWebSocketEvent("multi_backtest_report_saved");

	const { agent_report_id } = useParams();

	const { addNotifications } = useNotificationContext();

	useEffect(() => {
		if (savedConfirmation) {
			if (savedConfirmation) {
				addNotifications({ type: "success", message: "Saved Report Successfully" });
			}
		}
	}, [savedConfirmation]);

	return (
		<div>
			<Header />
			<PageTitle titleProp="Create Strategy Agent Report" backButtonLinkProp="/strategy-agent" />
			<div className="max-w-[1440px] mx-auto bg-white w-full p-6 flex flex-col gap-6">
				<div className="flex w-full gap-4">
					{!agent_report_id && (
						<div className="w-1/3 max-w-[250px]">
							<StrategyAgentInputs isProcessingProp={isProcessing} setIsProcessingProp={setIsProcessing} />
						</div>
					)}
					<div
						className={` ${
							agent_report_id !== undefined ? "w-full" : "min-w-2/3 w-[calc(100vw-300px)] max-w-[calc(1440px-300px)]"
						}`}
					>
						<StrategyAgentMetrics isProcessingProp={isProcessing} setIsProcessingProp={setIsProcessing} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default StrategyAgentCreatePage;
