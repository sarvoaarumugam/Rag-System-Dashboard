import { emitEvent } from "./EventBus";

export function handleMessage(message: any) {
	switch (message.type) {
		// #region Portfolio
		case "wallet_balance":
			emitEvent("wallet_balance", message.data);
			break;
		case "trade_history":
			emitEvent("trade_history", message.data);
			break;
		case "p&l_info":
			emitEvent("p&l_info", message.data);
			break;
		case "invested_holdings":
			emitEvent("invested_holdings", message.data);
			break;
		case "invested_amount":
			emitEvent("invested_amount", message.data);
			break;
		//#endregion

		// #region Suggestion
		case "suggestion":
			emitEvent("suggestion", message.data);
			break;
		case "get_suggestions":
			emitEvent("get_suggestions", message.data);
			break;
		//#endregion

		// #region Subscription
		case "unsubscribe":
			emitEvent("unsubscribe", message.data);
			break;
		case "track":
			emitEvent("track", message.data);
			break;
		case "subscribed":
			emitEvent("subscribed", message.data);
			break;
		case "active_trades":
			emitEvent("active_trades", message.data);
			break;
		case "auto_manual_status":
			emitEvent("auto_manual_status", message.data);
			break;

		//#endregion

		// #region Parameters
		case "get_parameters":
			emitEvent("get_parameters", message.data);
			break;
		case "update_parameters":
			emitEvent("update_parameters", message.data);
			break;
		//#endregion

		// #region Logs History
		case "get_success_logs":
			emitEvent("get_success_logs", message.data);
			break;
		case "get_failure_logs":
			emitEvent("get_failure_logs", message.data);
			break;
		case "get_all_signal_logs":
			emitEvent("get_all_signal_logs", message.data);
			break;
		//#endregion

		// #region Charts
		case "create_chart_config":
			emitEvent("create_chart_config", message.data);
			break;
		case "get_chart_config":
			emitEvent("get_chart_config", message.data);
			break;
		case "update_chart_config":
			emitEvent("update_chart_config", message.data);
			break;
		case "delete_chart_config":
			emitEvent("delete_chart_config", message.data);
			break;
		case "get_chart_data":
			emitEvent("get_chart_data", message.data);
			break;
		//#endregion

		// #region In Price Charts
		case "in_price_suggestions":
			emitEvent("in_price_suggestions", message.data);
			break;
		case "create_in_price_chart_config":
			emitEvent("create_in_price_chart_config", message.data);
			break;
		case "get_in_price_chart_config":
			emitEvent("get_in_price_chart_config", message.data);
			break;
		case "update_in_price_chart_config":
			emitEvent("update_in_price_chart_config", message.data);
			break;
		case "delete_in_price_chart_config":
			emitEvent("delete_in_price_chart_config", message.data);
			break;
		case "get_in_price_chart_data":
			emitEvent("get_in_price_chart_data", message.data);
			break;
		//#endregion

		//#region Logs
		case "log_trade_data":
			emitEvent("log_trade_data", message.data);
			break;
		case "get_active_trades":
			emitEvent("get_active_trades", message.data);
			break;
		case "end_trade_task":
			emitEvent("end_trade_task", message.data);
			break;
		case "plot_trade_history":
			emitEvent("plot_trade_history", message.data);
			break;
		case "get_history_trades":
			emitEvent("get_history_trades", message.data);
			break;
		//#endregion

		//#region Chats
		case "get_all_sessions":
			emitEvent("get_all_sessions", message.data);
			break;
		case "get_chat_history":
			emitEvent("get_chat_history", message.data);
			break;
		case "chat":
			emitEvent("chat", message.data);
			break;
		case "create_chat_session_id":
			emitEvent("create_chat_session_id", message.data);
			break;
		case "delete_chat_session":
			emitEvent("delete_chat_session", message.data);
			break;
		//#endregion

		//#region Chat Image
		case "upload_image":
			emitEvent("upload_image", message.data);
			break;
		case "delete_image":
			emitEvent("delete_image", message.data);
			break;
		//#endregion

		//#region Metrics
		case "trade_result_breakdown":
			emitEvent("trade_result_breakdown", message.data);
			break;
		case "total_pnl":
			emitEvent("total_pnl", message.data);
			break;
		//#endregion

		//#region Strategy Tester
		case "backtest_orderblocks":
			emitEvent("backtest_orderblocks", message.data);
			break;
		case "backtest_orderblock_status":
			emitEvent("backtest_orderblock_status", message.data);
			break;
		case "fetch_backtest_reports":
			emitEvent("fetch_backtest_reports", message.data);
			break;
		case "fetch_backtest_report":
			emitEvent("fetch_backtest_report", message.data);
			break;
		case "delete_backtest_report":
			emitEvent("delete_backtest_report", message.data);
			break;
		case "filter_backtest_report":
			emitEvent("filter_backtest_report", message.data);
			break;
		case "get_candles_around_ob":
			emitEvent("get_candles_around_ob", message.data);
			break;
		//#endregion

		//#region Strategy Agent
		case "multi_backtest_orderblocks":
			emitEvent("multi_backtest_orderblocks", message.data);
			break;
		case "backtest_multi_reports":
			emitEvent("backtest_multi_reports", message.data);
			break;
		case "load_multi_backtest_report":
			emitEvent("load_multi_backtest_report", message.data);
			break;
		case "multi_backtest_report_saved":
			emitEvent("multi_backtest_report_saved", message.data);
			break;
		//#endregion

		case "error":
			emitEvent("error", message.data);
			break;

		default:
			console.warn("Unknown message type", message);
	}
}
