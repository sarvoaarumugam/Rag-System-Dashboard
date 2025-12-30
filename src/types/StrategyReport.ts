export type StrategyReportType = {
	status: string;
	symbol?: string;
	timeframe?: string;
	config: {
		symbol: string;
		timeframe: string;
		ob_type: string;
		start_date: string;
		end_date: string;
		impulse_window: string;
		impulse_percentage: string;
		stop_loss: string;
		take_profit: string;
	};
	metrics: {
		total_obs: number;
		profit_obs: number;
		loss_obs: number;
		profit_pct: number;
		filtered_total_obs: number;
		filtered_profit_obs: number;
		filtered_loss_obs: number;
		filtered_profit_pct: number;
		total_invested: number;
		total_result: number;
		net_pnl: number;
		net_pnl_pct: number;
		ending_wallet: number;
		wallet_balance: number;
	};
	trades: ReportTableItemType[];
	meta?: {
		page: number;
		page_size: number;
		total_pages: number;
		total_items: number;
	};
};

export type ExitInfoType = {
	exit_timestamp: string;
	exit_price: number;
	exit_type: string;          // e.g. "TP1", "TP2", "SL"
	portion_closed: number;     // e.g. 50 (percent)
	portion_pnl: number;        // e.g. 0.25 (PnL for that portion)
};


export type ReportTableItemType = {
	zone_low: number;
	zone_high: number;
	entry_time: string;
	exit_time: string;
	outcome: "loss" | "profit";
	ob_type: "bearish" | "bullish";
	ob_timestamp: string;

	impulse_percentage: number;
	mitigation_prct: number;
	volume_spike: number;
	bos_detected: string;
	displacement_strength: number;
	orderblock_wick_ratio: number;
	trend_direction_swings: "sideways" | "uptrend" | "downtrend";

	invested: number;
	result: number;
	wallet_after: number;
	entry: number;
	exit: number;

	position_size: number;
	hours_held: number;
	base_pnl: number;
	trading_fees: number;
	funding_fees: number;
	total_fees: number;
	net_pnl: number;

	exits_info?: ExitInfoType[]; 
};

export type BacktestReportsDataType = {
	reports: BacktestReportDataType[];
	meta: {
		page: number;
		page_size: number;
		total_items: number;
		total_pages: number;
	};
};

export type BacktestReportDataType = {
	key: string;
	file_name: string;
	symbol: string;
	timeframe: string;
	impulse_percentage: number;
	impulse_window: number;
};
