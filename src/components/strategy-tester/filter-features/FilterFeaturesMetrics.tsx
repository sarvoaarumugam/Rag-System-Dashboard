import { SetStateAction, useEffect, useState } from "react";
import { useWebSocketEvent } from "../../../hooks/UseWebSocketEvent";

import { StrategyReportType } from "../../../types/StrategyReport";
import ReportMetricsSection from "../reports/ReportMetricsSection";
import FilteredMetricsSection from "./FilteredMetricsSection";
import BackButton from "../../common/BackButton";
import { useParams } from "react-router-dom";

interface FilterFeaturesMetricsProps {
	isLoadingProp: boolean;
	setIsLoadingProp: React.Dispatch<SetStateAction<boolean>>;
	handlePageChangeProp: (page: number) => void;
}

const FilterFeaturesMetrics: React.FC<FilterFeaturesMetricsProps> = ({
	isLoadingProp,
	setIsLoadingProp,
	handlePageChangeProp,
}) => {
	const rawData = useWebSocketEvent("fetch_backtest_report");

	useEffect(() => {
		if (rawData !== null) {
			setIsLoadingProp(false);
			setReportData(rawData);
		}
	}, [rawData]);

	const { report_id } = useParams();

	const [reportData, setReportData] = useState<StrategyReportType | null>(null);

	return (
		<div className="flex h-full flex-col gap-8 py-8">
			{reportData && !isLoadingProp && (
				<div className="flex flex-col gap-8">
					<div className="flex justify-between">
						<BackButton backPageLinkProp={`/strategy-tester/report/${report_id}`} />
						<div className="text-2xl font-semibold text-center">Report Analytics</div>
						<div className="w-20"></div>
					</div>
					<FilteredMetricsSection reportDataProp={reportData} />
					<ReportMetricsSection reportDataProp={reportData} onPageChangeProp={handlePageChangeProp} />
				</div>
			)}
			{isLoadingProp && (
				<div className="text-2xl font-semibold text-black/20 h-[calc(100vh-160px)]  flex items-center justify-center">
					Loading Data
				</div>
			)}
			{!reportData && (
				<div className="text-2xl font-semibold text-black/20 h-[calc(100vh-160px)] text-center flex items-center justify-center">
					Filter the OB trades based on the feature parameters
				</div>
			)}
		</div>
	);
};

export default FilterFeaturesMetrics;
