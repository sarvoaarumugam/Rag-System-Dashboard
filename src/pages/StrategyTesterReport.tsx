import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/common/Header";
import ReportMetricsSection from "../components/strategy-tester/reports/ReportMetricsSection";
import { useWebSocketContext } from "../context/WebSocketContext";
import { useEffect, useState } from "react";
import { useWebSocketEvent } from "../hooks/UseWebSocketEvent";
import { StrategyReportType } from "../types/StrategyReport";
import TitleHeading from "../components/common/TitleHeading";
import MetricContainer from "../components/common/MetricContainer";
import { Filter, Trash } from "lucide-react";
import BackButton from "../components/common/BackButton";

const StrategyTesterReport = () => {
	const { report_id } = useParams();

	const { client } = useWebSocketContext();

	const navigate = useNavigate();

	const reportData = useWebSocketEvent("fetch_backtest_report");
	const deleteConfirmation = useWebSocketEvent("delete_backtest_report");

	const [report, setReport] = useState<StrategyReportType | null>(null);

	const handlePageChange = (pageNumber: number) => {
		if (client?.isConnected()) {
			client.send({ type: "fetch_backtest_report_data", data: { key: report_id, page: pageNumber, page_size: 10 } });
		}
	};

	useEffect(() => {
		handlePageChange(1);
	}, []);

	useEffect(() => {
		if (reportData) {
			setReport(reportData);
		}
	}, [reportData]);

	const handleDelete = () => {
		if (client?.isConnected()) {
			client.send({ type: "delete_backtest_report", data: { key: report_id } });
		}
	};

	useEffect(() => {
		if (deleteConfirmation && deleteConfirmation?.status === "success") {
			navigate("/strategy-tester");
		}
	}, [deleteConfirmation]);

	return (
		<div>
			<Header />
			<div className="max-w-[1440px] mx-auto bg-white w-full p-6">
				{report && (
					<div className="flex flex-col gap-6">
						<div className="w-full flex items-center self-stretch justify-between gap-4">
							<BackButton backPageLinkProp="/strategy-tester" />

							<div className="flex gap-2">
								<button
									onClick={() => navigate(`/strategy-tester/report/${report_id}/filter-features`)}
									className="bg-blue-100 px-2 py-1 rounded-xl border border-blue-300 text-blue-500 flex items-center gap-2 hover:opacity-50"
								>
									<Filter size={16} />
									Filter Features
								</button>
								<button
									onClick={handleDelete}
									className="bg-red-100 px-2 py-1 rounded-xl border border-red-300 text-red-500 flex items-center gap-2 hover:opacity-50"
								>
									<Trash size={16} />
									Delete
								</button>
							</div>
						</div>
						<TitleHeading titleProp="Strategy Parameters" />
						<div className="flex h-[120px] gap-4">
							<MetricContainer titleProp="Symbol" classNameProp="w-1/4">
								<div className="text-2xl font-semibold">{reportData.symbol}</div>
							</MetricContainer>
							<MetricContainer titleProp="Timeframe" classNameProp="w-1/4">
								<div className="text-2xl font-semibold">{reportData.timeframe}</div>
							</MetricContainer>
							<MetricContainer titleProp="Start Date" classNameProp="w-1/4">
								<div className="text-2xl font-semibold">{reportData.start_date.split(" ")[0]}</div>
							</MetricContainer>
							<MetricContainer titleProp="End Date" classNameProp="w-1/4">
								<div className="text-2xl font-semibold">{reportData.end_date.split(" ")[0]}</div>
							</MetricContainer>
						</div>
						<ReportMetricsSection reportDataProp={report} onPageChangeProp={handlePageChange} />
					</div>
				)}
			</div>
		</div>
	);
};

export default StrategyTesterReport;
