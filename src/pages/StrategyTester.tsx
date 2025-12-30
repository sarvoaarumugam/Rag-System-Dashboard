import Header from "../components/common/Header";
import ReportInput from "../components/strategy-tester/reports/ReportInputs";
import ReportMetrics from "../components/strategy-tester/reports/ReportMetrics";

const StrategyTester = () => {
	return (
		<div>
			<Header />
			<div className="max-w-[1440px] mx-auto bg-white w-full p-6 flex flex-col gap-6">
				<div className="flex w-full gap-4">
					<div className="w-1/3 max-w-[250px]">
						<ReportInput />
					</div>
					<div className="min-w-2/3 w-[calc(100vw-300px)] max-w-[calc(1440px-300px)]">
						<ReportMetrics />
					</div>
				</div>
			</div>
		</div>
	);
};

export default StrategyTester;
