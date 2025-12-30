import { ChevronLeft, ChevronRight, CircleAlert } from "lucide-react";
import { useChartsContext } from "../../../context/ChartsContext";
import SuggestionsDropdown from "./SuggestionsDropdown";
import { useWebSocketContext } from "../../../context/WebSocketContext";
import { useWebSocketEvent } from "../../../hooks/UseWebSocketEvent";
import { useEffect, useState } from "react";

import { useIndividualChartContext } from "../../../context/IndividualChartContext";
import { useObSuggestionsContext } from "../../../context/ObSuggestionsContext";
import { StrategyType } from "../../../types/StrategyTypes";
import SuggestionItem from "./SuggestionItem";
import InPriceSuggestions from "./inPriceStrategy/InPriceSuggestions";

interface SuggestionsProp {
	strategyProp: StrategyType;
}

const Suggestions: React.FC<SuggestionsProp> = ({ strategyProp }) => {
	const { expandSuggestions, setExpandSuggestions, chartConfig } = useIndividualChartContext();
	const { setSuggestions, suggestions } = useObSuggestionsContext();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { fullscreen } = useChartsContext();

	const { client } = useWebSocketContext();
	const suggestionsData =
		strategyProp === "ob-strategy" ? useWebSocketEvent("get_suggestions") : useWebSocketEvent("in_price_suggestions");

	useEffect(() => {
		if (chartConfig === null) return;

		if (expandSuggestions) {
			if (client?.isConnected() && !isLoading) {
				client.send({
					type: strategyProp === "ob-strategy" ? "get_suggestions" : "in_price_suggestions",
					data: {
						symbol: chartConfig.symbol,
						timeframe: chartConfig.timeframe,
					},
				});

				setIsLoading(true);
			}
		}
	}, [chartConfig, expandSuggestions]);

	useEffect(() => {
		if (
			suggestionsData?.status === "success" &&
			suggestionsData?.config.symbol === chartConfig!.symbol &&
			suggestionsData?.config.timeframe === chartConfig!.timeframe
		) {
			setSuggestions(suggestionsData?.data);
			setIsLoading(false);
			console.log(suggestionsData);
		}
	}, [suggestionsData]);

	return (
		<div className={`bg-white-100 border flex rounded-lg items-center justify-center ${expandSuggestions ? "w-1/4" : "w-20"}`}>
			{!expandSuggestions ? (
				<button
					className="w-full h-full flex items-center justify-center hover:opacity-50 disabled:opacity-10 disabled:cursor-not-allowed"
					onClick={() => setExpandSuggestions(true)}
				>
					<ChevronRight size={48} />
				</button>
			) : (
				<div className="flex flex-col items-center w-full h-full px-4 py-8 gap-8">
					{/* Header */}
					<div className="flex justify-between items-center w-full">
						<button className="border rounded-full p-1 hover:opacity-50" onClick={() => setExpandSuggestions(false)}>
							<ChevronLeft />
						</button>
						<div className="text-xl font-semibold">Suggestions</div>
						<div className="w-8 h-8"></div>
					</div>
					<div className="border w-full" />
					{/* Suggestions */}
					<div className={`flex flex-col w-full overflow-y-auto ${fullscreen ? "min-h-[340px] max-h-full" : "h-[380px]"}`}>
						{strategyProp === "ob-strategy" && (
							<SuggestionsDropdown titleProp="OB Suggestions" isLoadingProp={isLoading}>
								<>
									{!isLoading &&
										suggestions.length > 0 &&
										suggestions.map((suggestion) => <SuggestionItem key={suggestion.timestamp} suggestionProp={suggestion} />)}
									{isLoading && suggestions.length === 0 && (
										<div className="w-full flex items-center justify-center gap-2 text-center py-4 text-lg font-semibold text-black/50 border rounded-lg">
											<CircleAlert size={20} />
											No Valid OBs found
										</div>
									)}
								</>
							</SuggestionsDropdown>
						)}
						{strategyProp === "in-price-strategy" && <InPriceSuggestions />}
					</div>
				</div>
			)}
		</div>
	);
};

export default Suggestions;
