type DataType = {
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

export const StrategyAgentTradesAnalysisPromptGenerator = (data: DataType) => {
	const prompt = `Use the ob_strategy tool and please do complete analysis of this csv file.
Below is the backtested trades report for ${data.symbol} on the ${data.timeframe} timeframe. The backtest covered the period from 2022-09-18 00:00:00 to 2025-09-17 00:00:00.
Backtest Parameters
Symbol:${data.symbol}
Timeframe: ${data.timeframe}
Date Range: ${data.start_date} - ${data.end_date}
Order Block Type (Ob Type): ${data.ob_type}

Impulse Window: ${data.impulse_window}
Impulse Percentage: ${data.impulse_percentage}
Take Profit:${data.take_profit}
Stop Loss: ${data.stop_loss}

Tell me how I can improve ob_strategy?
    `;

	return prompt;
};
