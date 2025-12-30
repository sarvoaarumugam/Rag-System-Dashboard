export type ObChartType = {
	status: string;
	config: {
		symbol: string;
		timeframe: string;
		ob_time: string;
		candles: number;
	};
	data: {
		candles: CandleType[];
	};
};

type CandleType = {
	timestamp: string;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	takerBuyBaseAssetVolume: number;
	numberOfTrades: number;
};
