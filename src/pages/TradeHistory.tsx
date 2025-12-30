import Header from "../components/common/Header";
import PageTitle from "../components/common/PageTitle";
import TitleHeading from "../components/common/TitleHeading";
import MetricsSection from "../components/metrics/MetricsSection";
import TradeHistorySection from "../components/tradeHistory/TradeHistorySection";
import { TradeHistoryFitersContextProvider } from "../context/TradeHistoryFiltersContext";

const TradeHistory = () => {
	return (
		<div>
			<Header />
			<PageTitle backButtonLinkProp="/" titleProp="Trade History & Metrics" />
			<div className="px-6 bg-white flex justify-center mb-6">
				<div className="max-w-[1440px] w-full bg-white p-6 flex flex-col gap-6">
					<MetricsSection />
					<TradeHistoryFitersContextProvider>
						<div className="flex flex-col gap-2">
							<TitleHeading titleProp="Trade History" textStylingProp="text-2xl" />
							<TradeHistorySection />
						</div>
					</TradeHistoryFitersContextProvider>
				</div>
			</div>
		</div>
	);
};

export default TradeHistory;
