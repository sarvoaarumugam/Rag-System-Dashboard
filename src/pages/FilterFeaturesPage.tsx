import { useState } from "react";
import Header from "../components/common/Header";
import FilterFeaturesInput from "../components/strategy-tester/filter-features/FilterFeaturesInput";
import FilterFeaturesMetrics from "../components/strategy-tester/filter-features/FilterFeaturesMetrics";
import { useWebSocketContext } from "../context/WebSocketContext";

const FilterFeaturesPage = () => {
	const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

	const [payloadParameters, setPayloadParameters] = useState<any>();

	const { client } = useWebSocketContext();

	const handleSubmit = (payload?: any) => {
		if (client?.isConnected()) {
			if (payload.data) {
				setPayloadParameters(payload.data);
				client?.send(payload);
			}
			setIsLoadingData(true);
		}
	};

	const handlePageChange = (pageNumber: number) => {
		if (client?.isConnected()) {
			if (payloadParameters) {
				client?.send({
					type: "filter_backtest_report",
					data: { filters: payloadParameters?.filters, page: pageNumber, page_size: 10, key: payloadParameters?.key },
				});
			}
			setIsLoadingData(true);
		}
	};

	return (
		<div>
			<Header />
			<div className="max-w-[1440px] mx-auto bg-white w-full p-6 flex flex-col gap-6">
				<div className="flex w-full gap-4">
					<div className="w-1/3 max-w-[250px]">
						<FilterFeaturesInput isLoadingProp={isLoadingData} handleSubmitProp={handleSubmit} />
					</div>
					<div className="min-w-2/3 w-[calc(100vw-300px)] max-w-[calc(1440px-300px)]">
						<FilterFeaturesMetrics
							isLoadingProp={isLoadingData}
							setIsLoadingProp={setIsLoadingData}
							handlePageChangeProp={handlePageChange}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilterFeaturesPage;
