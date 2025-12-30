export type TradeHistoryType = {
	symbol: string;
	timeframe: string;
	initial_capital: number;
	stop_loss: number;
	take_profit: number;
	entry_time: string;
	remarks: string;
	ob_timestamp: string;
	impulse_threshold: number;
	impulse_window: number;
	end_time: string;
	exit_capital: number;
	result: string;
};
