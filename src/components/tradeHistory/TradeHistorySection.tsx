import { useEffect, useState } from "react";
import { useWebSocketContext } from "../../context/WebSocketContext";
import { TradeHistoryType } from "../../types/TradeHistoryType";
import { useWebSocketEvent } from "../../hooks/UseWebSocketEvent";
import TradeHistoryFilters from "./TradeHistoryFilters";
import TradeHistoryTable from "./TradeHistoryTable";
import TradeHistoryTableSkeleton from "./TradeHistoryTableSkeleton";
import { useTradeHistoryFitersContext } from "../../context/TradeHistoryFiltersContext";
import { format } from "date-fns";
import TablePageSection from "../common/TablePageSection";

const TradeHistorySection = () => {
	const { client } = useWebSocketContext();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [data, setData] = useState<TradeHistoryType[]>([]);
	const { symbolsFilter, timeframesFilter, dateRangeFilter } = useTradeHistoryFitersContext();

	const [pageNumber, setPageNumber] = useState<number>(0);
	const [totalEntries, setTotalEntries] = useState<number>(0);

	const receivedData = useWebSocketEvent("get_history_trades");

	useEffect(() => {
		getTradeHistoryData(1);
	}, [client, symbolsFilter, timeframesFilter, dateRangeFilter]);

	const getTradeHistoryData = (pageNumber: number) => {
		if (client?.isConnected() && dateRangeFilter.startDate && dateRangeFilter.endDate) {
			setIsLoading(true);
			client.send({
				type: "get_history_trades",
				data: {
					symbols: symbolsFilter,
					timeframes: timeframesFilter,
					start_date: format(dateRangeFilter.startDate, "yyyy-MM-dd"),
					end_date: format(dateRangeFilter.endDate, "yyyy-MM-dd"),
					page: pageNumber,
					page_size: 10,
				},
			});
		}
	};

	useEffect(() => {
		if (receivedData?.status === "success" && receivedData?.trades) {
			setData(receivedData?.trades);
			setPageNumber(receivedData?.page);
			setTotalEntries(receivedData?.total_pages);
			setIsLoading(false);
		}
	}, [receivedData]);

	return (
		<>
			{isLoading && <TradeHistoryTableSkeleton />}
			{!isLoading && data && (
				<div className="flex flex-col gap-10">
					<TradeHistoryFilters />
					{data.length === 0 && (
						<div className="w-full text-center py-8 border border-1 border-gray-400 text-black/50 bg-gray-100 text-xl border-dashed rounded-xl">
							No Trade History Available
						</div>
					)}
					{data.length > 0 && (
						<div className="flex flex-col gap-2">
							<TradeHistoryTable data={data} />
							<TablePageSection
								activePageProp={pageNumber}
								onPageChangeProp={getTradeHistoryData}
								totalProfilesProp={totalEntries}
							/>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default TradeHistorySection;
