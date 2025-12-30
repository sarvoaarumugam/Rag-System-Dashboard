import { useEffect, useState } from "react";
import { useWebSocketEvent } from "../../../hooks/UseWebSocketEvent";

import { StrategyReportType } from "../../../types/StrategyReport";

import { useOBStartegyTesterContext } from "../../../context/OBStrategyTesterContext";

import ReportPreparationStatus from "./ReportPreparationStatus";
import ReportMetricsSection from "./ReportMetricsSection";
import BackButton from "../../common/BackButton";

const ReportMetrics = () => {
	const rawData = useWebSocketEvent("backtest_orderblocks");

	const [reportData, setReportData] = useState<StrategyReportType | null>(null);

	const { isProcessing, setIsProcessing } = useOBStartegyTesterContext();

	useEffect(() => {
		if (rawData !== null) {
			setIsProcessing(false);
			setReportData(rawData);
		}
	}, [rawData]);

	return (
		<div className="flex w-full h-full flex-col gap-8 py-8">
			{reportData && !isProcessing && (
				<div className="flex flex-col gap-8">
					<div className="flex justify-between items-center">
						<BackButton backPageLinkProp="/strategy-tester" />
						<div className="text-2xl font-semibold text-center">Report Analytics</div>
						<div className="w-20"></div>
					</div>
					<ReportMetricsSection reportDataProp={reportData} />
				</div>
			)}
			{isProcessing && (
				<div className="text-2xl font-semibold text-black/20 h-[calc(100vh-160px)] flex flex-col w-full items-center justify-start">
					<div className="flex justify-between items-center w-full">
						<BackButton backPageLinkProp="/strategy-tester" />
						<div className="w-20"></div>
					</div>
					<div className="flex h-full items-center">
						<ReportPreparationStatus />
					</div>
				</div>
			)}
			{!reportData && !isProcessing && (
				<div className="text-2xl font-semibold text-black/20 h-[calc(100vh-160px)] flex flex-col w-full items-center justify-start">
					<div className="flex justify-between items-center w-full">
						<BackButton backPageLinkProp="/strategy-tester" />
						<div className="w-20"></div>
					</div>
					<div className="flex h-full items-center">Create Report to see the metrics</div>
				</div>
			)}
		</div>
	);
};

export default ReportMetrics;
