export type BreakdownDataType = {
	non_profitable: number;
	profitable: number;
};

export type TotalPnLType = {
	status: string;
	pnl: {
		percent: number;
		amount: number;
		pnl_status: string;
	};
	total_entry_capital: number;
	total_exit_capital: number;
};
