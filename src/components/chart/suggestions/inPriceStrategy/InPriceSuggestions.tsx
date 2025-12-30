import { useEffect, useState } from "react";
import { useIndividualChartContext } from "../../../../context/IndividualChartContext";
import { useWebSocketContext } from "../../../../context/WebSocketContext";
import { useWebSocketEvent } from "../../../../hooks/UseWebSocketEvent";
import { InPriceSuggestionsType } from "../../../../types/suggestions/InPriceSuggestionType";
import { CircleAlert } from "lucide-react";
import SuggestionsDropdown from "../SuggestionsDropdown";
import InPriceSuggestionItem from "./InPriceSuggestionItem";

const InPriceSuggestions = () => {
	const { chartConfig } = useIndividualChartContext();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { client } = useWebSocketContext();

	const suggestionsData = useWebSocketEvent("in_price_suggestions");

	const [inPriceSuggestions, setInPriceSuggestions] = useState<InPriceSuggestionsType>();

	useEffect(() => {
		if (chartConfig === null) return;

		if (client?.isConnected() && !isLoading) {
			client.send({
				type: "in_price_suggestions",
				data: {
					symbol: chartConfig.symbol,
					timeframe: chartConfig.timeframe,
					index_offset: 0,
				},
			});

			setIsLoading(true);
		}
	}, [chartConfig]);

	useEffect(() => {
		if (
			suggestionsData?.status === "success" &&
			suggestionsData?.config.symbol === chartConfig!.symbol &&
			suggestionsData?.config.timeframe === chartConfig!.timeframe
		) {
			setInPriceSuggestions(suggestionsData?.data);
			setIsLoading(false);
			console.log(suggestionsData);
		}
	}, [suggestionsData]);

	return (
		<>
			{isLoading && (
				<div className="flex flex-col gap-4">
					{Array.from({ length: 8 }).map((_, index) => (
						<div key={index} className="animate-pulse w-full h-[92px] border rounded-lg bg-gray-50 overflow-clip"></div>
					))}
				</div>
			)}

			{!isLoading && inPriceSuggestions && (
				<div className="flex flex-col gap-4">
					{(inPriceSuggestions.order_blocks_15m.bearish.length > 0 || inPriceSuggestions.order_blocks_15m.bullish.length > 0) && (
						<SuggestionsDropdown
							titleProp="15m Orderblocks"
							isLoadingProp={false}
							lengthProp={inPriceSuggestions.order_blocks_15m.bearish.length + inPriceSuggestions.order_blocks_15m.bullish.length}
						>
							{inPriceSuggestions.order_blocks_15m.bearish.map((suggestion, index) => (
								<InPriceSuggestionItem key={index} dataProp={suggestion} />
							))}
							{inPriceSuggestions.order_blocks_15m.bullish.map((suggestion, index) => (
								<InPriceSuggestionItem key={index} dataProp={suggestion} />
							))}
						</SuggestionsDropdown>
					)}
					{(inPriceSuggestions.order_blocks_1h.bearish.length > 0 || inPriceSuggestions.order_blocks_1h.bullish.length > 0) && (
						<SuggestionsDropdown
							titleProp="1h Orderblocks"
							isLoadingProp={false}
							lengthProp={inPriceSuggestions.order_blocks_1h.bearish.length + inPriceSuggestions.order_blocks_1h.bullish.length}
						>
							{inPriceSuggestions.order_blocks_1h.bearish.map((suggestion, index) => (
								<InPriceSuggestionItem key={index} dataProp={suggestion} />
							))}
							{inPriceSuggestions.order_blocks_1h.bullish.map((suggestion, index) => (
								<InPriceSuggestionItem key={index} dataProp={suggestion} />
							))}
						</SuggestionsDropdown>
					)}
					{(inPriceSuggestions.order_blocks_4h.bearish.length > 0 || inPriceSuggestions.order_blocks_4h.bullish.length > 0) && (
						<SuggestionsDropdown
							titleProp="4h Orderblocks"
							isLoadingProp={false}
							lengthProp={inPriceSuggestions.order_blocks_4h.bearish.length + inPriceSuggestions.order_blocks_4h.bullish.length}
						>
							{inPriceSuggestions.order_blocks_4h.bearish.map((suggestion, index) => (
								<InPriceSuggestionItem key={index} dataProp={suggestion} />
							))}
							{inPriceSuggestions.order_blocks_4h.bullish.map((suggestion, index) => (
								<InPriceSuggestionItem key={index} dataProp={suggestion} />
							))}
						</SuggestionsDropdown>
					)}
					{(inPriceSuggestions.order_blocks_1d.bearish.length > 0 || inPriceSuggestions.order_blocks_1d.bullish.length > 0) && (
						<SuggestionsDropdown
							titleProp="1d Orderblocks"
							isLoadingProp={false}
							lengthProp={inPriceSuggestions.order_blocks_1d.bearish.length + inPriceSuggestions.order_blocks_1d.bullish.length}
						>
							{inPriceSuggestions.order_blocks_1d.bearish.map((suggestion, index) => (
								<InPriceSuggestionItem key={index} dataProp={suggestion} />
							))}
							{inPriceSuggestions.order_blocks_1d.bullish.map((suggestion, index) => (
								<InPriceSuggestionItem key={index} dataProp={suggestion} />
							))}
						</SuggestionsDropdown>
					)}
				</div>
			)}

			{!isLoading &&
				inPriceSuggestions?.order_blocks_15m.bearish.length === 0 &&
				inPriceSuggestions?.order_blocks_15m.bullish.length === 0 &&
				inPriceSuggestions?.order_blocks_1h.bearish.length === 0 &&
				inPriceSuggestions?.order_blocks_1h.bullish.length === 0 &&
				inPriceSuggestions?.order_blocks_4h.bearish.length === 0 &&
				inPriceSuggestions?.order_blocks_4h.bullish.length === 0 &&
				inPriceSuggestions?.order_blocks_1d.bearish.length === 0 &&
				inPriceSuggestions?.order_blocks_1d.bullish.length === 0 && (
					<div className="w-full flex items-center justify-center gap-2 text-center py-4 text-lg font-semibold text-black/50 border rounded-lg">
						<CircleAlert size={20} />
						No Valid OBs found
					</div>
				)}
		</>
	);
};

export default InPriceSuggestions;
