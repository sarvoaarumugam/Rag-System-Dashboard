import { useEffect, useState } from "react";
import Header from "../components/common/Header";
import { useWebSocketContext } from "../context/WebSocketContext";
import { useWebSocketEvent } from "../hooks/UseWebSocketEvent";
import { useNavigate } from "react-router-dom";
import { CircleAlert, Plus } from "lucide-react";
import StrategyReportsTable from "../components/strategy-tester/home/StrategyReportsTable";
import { BacktestReportDataType } from "../types/StrategyReport";
import TablePageSection from "../components/common/TablePageSection";
import PageTitle from "../components/common/PageTitle";

const StrategyTesterHome = () => {
	const reportsData = useWebSocketEvent("fetch_backtest_reports");
	const { client } = useWebSocketContext();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [reports, setReports] = useState<BacktestReportDataType[]>([]);

	const navigate = useNavigate();

	useEffect(() => {
		handlePageChange(1);
	}, []);

	const handlePageChange = (pageNumber: number) => {
		if (client?.isConnected()) {
			setIsLoading(true);
			client.send({ type: "fetch_backtest_reports", data: { page: pageNumber, page_size: 10 } });
		}
	};

	useEffect(() => {
		if (reportsData && reportsData?.reports) {
			setReports(reportsData.reports);
			setIsLoading(false);
		}
	}, [reportsData]);

	return (
		<div>
			<Header />
			<PageTitle titleProp="Strategy Tester" backButtonLinkProp="/" />
			<div className="max-w-[1440px] mx-auto bg-white w-full p-6 flex flex-col gap-6">
				<div className="flex justify-between items-center">
					<div className="text-2xl font-semibold text-black/50">OB Strategy Reports</div>
					<button
						onClick={() => navigate("/strategy-tester/create")}
						className="hover:opacity-50 font-semibold flex items-center gap-2 justify-center bg-blue-100 text-blue-500 rounded-3xl py-2 px-6 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
					>
						<Plus />
						Create Report
					</button>
				</div>

				<div className="flex flex-col gap-2">
					{!isLoading && reports.length > 0 ? (
						<div className="flex flex-col">
							<div className="min-h-[365px]">
								<StrategyReportsTable data={reports} />
							</div>
							{reportsData?.meta && reportsData?.meta?.total_items > 10 && (
								<TablePageSection
									totalProfilesProp={reportsData?.meta?.total_items}
									onPageChangeProp={(pageNumber: number) => handlePageChange(pageNumber)}
									activePageProp={reportsData?.meta?.page}
								/>
							)}
						</div>
					) : !isLoading && reports.length === 0 ? (
						<div className="flex gap-2 text-black/50 items-center justify-center">
							<CircleAlert size={18} />
							<div>No reports has been saved</div>
						</div>
					) : (
						<div className="flex flex-col">
							<div className="bg-black/10 border border-black/10 h-[36px]"></div>
							{Array.from({ length: 10 }).map((_, index) => (
								<div key={index} className="animate-pulse bg-black/5 border border-black/10 h-8"></div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default StrategyTesterHome;
