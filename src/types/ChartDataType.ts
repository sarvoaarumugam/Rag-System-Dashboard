export type ChartDataType = {
	candles: CandleDataType[];
	indicators: {
		order_blocks: {
			bullish: OrderBlockType[];
			bearish: OrderBlockType[];
		};
		swings: {
			swinghighs: SwingsType[];
			swinglows: SwingsType[];
		};
		trend: {
			downtrend: TrendType[];
			uptrend: TrendType[];
		};
		break_of_structure: {
			bearish_bos: BreakOfStructureType[];
			bullish_bos: BreakOfStructureType[];
		};
		order_blocks_15m: {
			bullish: OrderBlockType[];
			bearish: OrderBlockType[];
		};
		order_blocks_1h: {
			bullish: OrderBlockType[];
			bearish: OrderBlockType[];
		};
		order_blocks_4h: {
			bullish: OrderBlockType[];
			bearish: OrderBlockType[];
		};
		order_blocks_1d: {
			bullish: OrderBlockType[];
			bearish: OrderBlockType[];
		};
	};
};

type Indicators = ChartDataType["indicators"];

type OBLike = { bullish: OrderBlockType[]; bearish: OrderBlockType[] };

export type OBKeys = {
	[K in keyof Indicators]: Indicators[K] extends OBLike ? K : never;
}[keyof Indicators];

type BreakOfStructureType = {
	break_amount: number;
	start: {
		time: string;
		value: number;
	};
	end: {
		time: string;
		value: number;
	};
};

type CandleDataType = {
	open: number;
	high: number;
	low: number;
	close: number;
	timestamp: string;
	volume: number;
};

type OrderBlockType = {
	timestamp: string;
	orderblock_type: "bullish" | "bearish";
	zone_high: number;
	zone_low: number;
	invalidated?: boolean;
};

type SwingsType = {
	bar_time: number;
	index: number;
	price: number;
	swing_type: string;
	timestamp: string;
};

type TrendType = {
	type: string;
	start: {
		time: string;
		value: number;
	};
	end: {
		time: string;
		value: number;
	};
};
