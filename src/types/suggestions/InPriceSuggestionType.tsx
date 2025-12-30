export type InPriceSuggestionsType = {
	order_blocks_15m: { bearish: InPriceSuggestionType[]; bullish: InPriceSuggestionType[] };
	order_blocks_1h: { bearish: InPriceSuggestionType[]; bullish: InPriceSuggestionType[] };
	order_blocks_4h: { bearish: InPriceSuggestionType[]; bullish: InPriceSuggestionType[] };
	order_blocks_1d: { bearish: InPriceSuggestionType[]; bullish: InPriceSuggestionType[] };
};

export type InPriceSuggestionType = {
	timestamp: string;
	orderblock_type: "bullish" | "bearish";
	zone_high: number;
	zone_low: number;
	invalidated: boolean;
	impulse_percentage: number;
};
