import React from "react";
import { StrategyReportType } from "../../../types/StrategyReport";
import MetricContainer from "../../common/MetricContainer";
import TitleHeading from "../../common/TitleHeading";
import StrategyTradesTable from "./StrategyTradesTable";
import TablePageSection from "../../common/TablePageSection";

interface ReportMetricsSectionProps {
	reportDataProp: StrategyReportType;
	onPageChangeProp?: (pageNumber: number) => void;
}

const ReportMetricsSection: React.FC<ReportMetricsSectionProps> = ({ reportDataProp, onPageChangeProp }) => {
	return (
		<>
			<TitleHeading titleProp="Metrics" />
			<div className="flex h-[228px] w-full gap-4">
				<MetricContainer classNameProp="w-1/4" titleProp="Total Trades">
					<div className="text-5xl font-semibold">{reportDataProp?.metrics.total_obs}</div>
				</MetricContainer>
				<MetricContainer classNameProp="w-1/4" titleProp="Profitable Trades">
					<div className="text-5xl font-semibold">{reportDataProp?.metrics.profit_obs}</div>
				</MetricContainer>
				<MetricContainer classNameProp="w-1/4" titleProp="Loss Trades">
					<div className="text-5xl font-semibold">{reportDataProp?.metrics.loss_obs}</div>
				</MetricContainer>
				<MetricContainer classNameProp="w-1/4" titleProp="Win Rate ( in % )">
					<div className="text-5xl font-semibold">{reportDataProp?.metrics.profit_pct} %</div>
				</MetricContainer>
			</div>
			<div className="flex h-[228px] w-full gap-4 ">
				<MetricContainer classNameProp="w-1/4" titleProp="Initial Balance">
					<div className="text-5xl font-semibold">{reportDataProp?.metrics.wallet_balance} </div>
				</MetricContainer>
				<MetricContainer classNameProp="w-1/4" titleProp="Closing Balance">
					<div className="text-5xl font-semibold">{reportDataProp?.metrics.ending_wallet} </div>
				</MetricContainer>
				<MetricContainer classNameProp="w-1/4" titleProp="P / L Value">
					<div className={`text-5xl font-semibold ${reportDataProp?.metrics.net_pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
						{reportDataProp?.metrics.net_pnl}
					</div>
				</MetricContainer>
				<MetricContainer classNameProp="w-1/4" titleProp="P / L ( in % )">
					<div
						className={`text-5xl font-semibold ${reportDataProp?.metrics.net_pnl_pct >= 0 ? "text-green-500" : "text-red-500"}`}
					>
						{reportDataProp?.metrics.net_pnl_pct?.toFixed(2)}%
					</div>
				</MetricContainer>
			</div>
			<TitleHeading titleProp="Trades Data" />
			<StrategyTradesTable
				data={reportDataProp.trades}
				configProp={reportDataProp?.config}
				timeframeProp={reportDataProp?.timeframe}
			/>
			{reportDataProp.meta && onPageChangeProp && reportDataProp.meta.total_items > 10 && (
				<TablePageSection
					totalProfilesProp={reportDataProp.meta?.total_items}
					onPageChangeProp={onPageChangeProp}
					activePageProp={reportDataProp.meta?.page}
				/>
			)}
		</>
	);
};

export default ReportMetricsSection;
