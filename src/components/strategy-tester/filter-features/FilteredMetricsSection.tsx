import { StrategyReportType } from "../../../types/StrategyReport";
import MetricContainer from "../../common/MetricContainer";
import TitleHeading from "../../common/TitleHeading";

interface FilteredMetricsSectionProps {
	reportDataProp: StrategyReportType;
}

const FilteredMetricsSection: React.FC<FilteredMetricsSectionProps> = ({ reportDataProp }) => {
	return (
		<>
			<TitleHeading titleProp="Filtered Metrics" />
			<div className="flex h-[228px] w-full gap-4">
				<MetricContainer classNameProp="w-1/4" titleProp="Total Filtered Trades">
					<div className="text-5xl font-semibold">{reportDataProp?.metrics?.filtered_total_obs}</div>
				</MetricContainer>
				<MetricContainer classNameProp="w-1/4" titleProp="Filtered Profitable Trades">
					<div className="text-5xl font-semibold">{reportDataProp?.metrics?.filtered_profit_obs}</div>
				</MetricContainer>
				<MetricContainer classNameProp="w-1/4" titleProp="Filtered Loss Trades">
					<div className="text-5xl font-semibold">{reportDataProp?.metrics?.filtered_loss_obs}</div>
				</MetricContainer>
				<MetricContainer classNameProp="w-1/4" titleProp="Filtered Win Rate (in % )">
					<div className="text-5xl font-semibold">{reportDataProp?.metrics?.filtered_profit_pct} %</div>
				</MetricContainer>
			</div>
		</>
	);
};

export default FilteredMetricsSection;
