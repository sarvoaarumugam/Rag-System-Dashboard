import { ReportTableItemType } from "../StrategyReport";

export type AgentStrategyReportType = {
  optimization_config: {
    symbol: string;
    timeframe: string;
    start_date: string;
    end_date: string;
    ob_type: string;
    total_combinations_tested: number;
    impulse_window: string;
    impulse_percentage: string;
    take_profit: string;
    stop_loss: string;
    parameter_ranges?: {
      impulse_window: string;
      impulse_percentage: string;
      stop_loss: string;
      take_profit_configs: {
        tp_min: number;
        tp_max: number;
        tp_step: number;
        position_min: number;
        position_max: number;
        position_step: number;
      }[];
      tp_combinations_tested: number;
    };
  };
  best_parameters: AgentStrategyType;
  all_results: AgentStrategyType[];
};

export type AgentStrategyType = {
  impulse_window: number;
  impulse_percentage: number;
  take_profit: number;
  stop_loss: number;
  total_obs: number;
  profit_obs: number;
  loss_obs: number;
  profit_pct: number;
  net_pnl: number;
  net_pnl_pct: number;
  total_invested: number;
  total_result: number;
  ending_wallet: number;
  avg_trade_duration: number;
  max_drawdown: number;
  sharpe_ratio: number;
  win_rate: number;
  trades?: ReportTableItemType[];
};
