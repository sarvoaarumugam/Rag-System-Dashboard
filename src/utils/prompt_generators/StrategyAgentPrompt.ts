import { AgentStrategyReportType } from "../../types/strategyAgent/StrategyAgentType";

export const StrategyAgentAnalysisPromptGenerator = (
  data: AgentStrategyReportType
) => {
  const prompt = `Use the ob_strategy tool and please do complete analysis of this csv file.
Below is the backtested performance report for ${data.optimization_config.symbol} on the ${data.optimization_config.timeframe} timeframe. The backtest covered the period from 2022-09-18 00:00:00 to 2025-09-17 00:00:00.
Backtest Parameters
Symbol:${data.optimization_config.symbol}
Timeframe: ${data.optimization_config.timeframe}
Date Range: ${data.optimization_config.start_date} - ${data.optimization_config.end_date}
Order Block Type (Ob Type): ${data.optimization_config.ob_type}
Total Combinations Tested: ${data.optimization_config.total_combinations_tested}

Tested Ranges
Impulse Window: ${data.optimization_config.impulse_window}
Impulse Percentage: ${data.optimization_config.impulse_percentage}
Stop Loss:${data.optimization_config.stop_loss}
ake Profit Configs: ${
    data.optimization_config.parameter_ranges?.take_profit_configs
      ?.map(
        (c) =>
          `${c.tp_min}-${c.tp_max} (step ${c.tp_step}), pos ${c.position_min}-${c.position_max} (step ${c.position_step})`
      )
      .join(" | ") ?? "-"
  }
TP Combinations Tested: ${data.optimization_config.parameter_ranges?.tp_combinations_tested ?? "-"}

Best Strategy Parameters (Optimal Set)
Impulse Window: ${data.best_parameters.impulse_window}
Impulse Percentage: ${data.best_parameters.impulse_percentage}
Take Profit:${data.best_parameters.take_profit}
Stop Loss: ${data.best_parameters.stop_loss}

Tell me how I can improve ob_strategy?
    `;

  return prompt;
};
