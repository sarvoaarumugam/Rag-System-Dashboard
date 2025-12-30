import { useState } from "react";
import InputContainer from "./InputContainer";
import { AvailableTimeFrames } from "../../../configs/AvailableTimeframes";
import DateRangePicker from "../../common/DateRangePicker";
import { format, subDays } from "date-fns";
import { Range } from "react-date-range";
import TitleHeading from "../../common/TitleHeading";
import { useWebSocketContext } from "../../../context/WebSocketContext";
import { useOBStartegyTesterContext } from "../../../context/OBStrategyTesterContext";
import { AvailableOBTypes } from "../../../configs/AvailableOBTypes";
import { AvailableBinanceCryptos } from "../../../configs/AvailableCryptos";
import { AvailableObTradeEntryOptions } from "../../../configs/AvailableSettings";
import MultipleTpInput, { TpType } from "./MultipleTpInput";
import { X } from "lucide-react";

const ReportInput = () => {
	const [symbol, setSymbol] = useState<string>("BTCUSDT");
	const [timeframe, setTimeframe] = useState<string>("15m");
	const [dateRange, setDateRange] = useState<Range>({
		startDate: subDays(new Date(), 30),
		endDate: new Date(),
		key: "selection",
	});
	const [obStrategyConfig, setObStrategyConfig] = useState<{
		impulse_threshold: number;
		impulse_window: number;
	}>({
		impulse_threshold: 1.5,
		impulse_window: 3,
	});
	const [tradeConfig, setTradeConfig] = useState<{
		stopLoss: number;
		stopLoss_2: number;
	}>({
		stopLoss: 1,
		stopLoss_2: -1,
	});
	const [saveReport, setSaveReport] = useState<boolean>(false);
	const [reportName, setReportName] = useState<string>("");
	const [obType, setObType] = useState<string>("all");

	const { client } = useWebSocketContext();

	const { isProcessing, setIsProcessing } = useOBStartegyTesterContext();

	const [walletBalance, setWalletBalance] = useState<number>(10000);

	const [investment, investmentUpdate] = useState<number>(1);

	const [bullish_entry, setBullish] = useState<string>("zone_high");
	const [bearish_entry, setBearish] = useState<string>("zone_low");

	const [inv_candle, setInvalidation] = useState<number>(2);

	const [leverage, setLeverage] = useState<number>(1);

	const [tradeFee, setTradefee] = useState<number>(0.04);
	const [fundingFee, setFundingfee] = useState<number>(0.01);

	const [tp, setTp] = useState<TpType[]>([{ position_size: 100, tp_percent: 1 }]);

	const [includetradingFee, setIncludeTradingFee] = useState<boolean>(false);
	const [includeFundingFee, setIncludeFundingFee] = useState<boolean>(false);

	const handleSubmit = () => {
		if (client?.isConnected() && dateRange.startDate && dateRange.endDate) {
			let requestData: any = {
				symbol: symbol,
				timeframe: timeframe,
				start_date: format(dateRange.startDate, "yyyy-MM-dd 00:00:00"),
				end_date: format(dateRange.endDate, "yyyy-MM-dd 00:00:00"),
				impulse_window: obStrategyConfig.impulse_window,
				impulse_percentage: obStrategyConfig.impulse_threshold,
				stop_loss: tradeConfig.stopLoss / 100,

				tp: tp.map((item) => ({
					position_size: item.position_size / 100,
					tp_percent: item.tp_percent / 100,
				})),
				save_report: saveReport,
				file_name: reportName,
				wallet_balance: walletBalance,
				risk_pct: investment / 100,
				bullish_entry: bullish_entry,
				bearish_entry: bearish_entry,
				ob_type: obType,
				inv_candle: inv_candle,
				leverage: leverage,
				trade_fee: tradeFee / 100,
				funding_fee: fundingFee / 100,
				include_trading_fees: includetradingFee,
				include_funding_fees: includeFundingFee,
			};

			if (tradeConfig.stopLoss_2 !== -1) {
				requestData = { sl2_pct: tradeConfig.stopLoss_2 / 100, ...requestData };
			}

			client?.send({
				type: "backtest_orderblock",
				data: requestData,
			});

			setIsProcessing(true);
		}
	};

	return (
		<div className="w-full max-w-[380px] border-r h-full">
			<div className="flex flex-col gap-8 py-8 pr-8">
				<div className="text-2xl font-semibold text-center">Create Strategy Report</div>
				<div className="flex flex-col gap-5">
					{/* General Parameters */}
					<TitleHeading titleProp="General Parameters" />
					<InputContainer labelProp="Symbol">
						<select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="p-2 w-full rounded border-2 shadow">
							{AvailableBinanceCryptos.map((crypto) => (
								<option key={crypto} value={crypto}>
									{crypto}
								</option>
							))}
						</select>
					</InputContainer>
					<InputContainer labelProp="Timeframe">
						<select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="p-2 rounded border-2 shadow">
							{AvailableTimeFrames.map((tf) => (
								<option key={tf} value={tf}>
									{tf}
								</option>
							))}
						</select>
					</InputContainer>
					<InputContainer labelProp="Date Range">
						<DateRangePicker classNameProp="left-0" dateRangeProp={dateRange} setDateRangeProp={setDateRange} />
					</InputContainer>
					{/* OB Parameters */}
					<TitleHeading titleProp="OB Parameters" />
					<InputContainer labelProp="Impulse Window">
						<input
							className="p-2 w-full rounded border-2 shadow"
							type="number"
							step={1}
							value={obStrategyConfig.impulse_window}
							onChange={(e) =>
								setObStrategyConfig((prev) => ({
									...prev,
									impulse_window: parseFloat(e.target.value),
								}))
							}
						/>
					</InputContainer>
					<InputContainer labelProp="Impulse Threshold">
						<input
							className="p-2 w-full rounded border-2 shadow"
							type="number"
							step={0.5}
							value={obStrategyConfig.impulse_threshold}
							onChange={(e) =>
								setObStrategyConfig((prev) => ({
									...prev,
									impulse_threshold: parseFloat(e.target.value),
								}))
							}
						/>
					</InputContainer>
					<InputContainer labelProp="Order Block Type">
						<select value={obType} onChange={(e) => setObType(e.target.value)} className="p-2 rounded border-2 shadow">
							{AvailableOBTypes.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
					</InputContainer>
					<InputContainer labelProp="Invalidated Candle">
						<input
							type="number"
							step={1}
							value={inv_candle}
							onChange={(e) => setInvalidation(Number(e.target.value))}
							className="p-2 rounded border-2 shadow w-full"
						/>
					</InputContainer>
					{/*Entry Zone*/}
					<TitleHeading titleProp="Zone Selection" />
					<InputContainer labelProp="Bullish OrderBlock">
						<select value={bullish_entry} onChange={(e) => setBullish(e.target.value)} className="p-2 rounded border-2 shadow">
							{AvailableObTradeEntryOptions.map((val) => (
								<option key={val} value={val}>
									{val === "zone_high" ? "Zone High" : "Zone Low"}
								</option>
							))}
						</select>
					</InputContainer>
					<InputContainer labelProp="Bearish OrderBlock">
						<select value={bearish_entry} onChange={(e) => setBearish(e.target.value)} className="p-2 rounded border-2 shadow">
							{AvailableObTradeEntryOptions.map((val) => (
								<option key={val} value={val}>
									{val === "zone_low" ? "Zone Low" : "Zone High"}
								</option>
							))}
						</select>
					</InputContainer>

					{/*Wallet Details*/}
					<TitleHeading titleProp="Wallet Balance" />
					<InputContainer labelProp="Wallet Balance">
						<input
							className="p-2 w-full rounded border-2 shadow"
							type="number"
							step={100}
							value={walletBalance}
							onChange={(e) => setWalletBalance(parseFloat(e.target.value))}
						/>
					</InputContainer>
					<InputContainer labelProp="Investment ( in % )">
						<input
							className="p-2 w-full rounded border-2 shadow"
							type="number"
							step={0.1}
							value={investment}
							onChange={(e) => investmentUpdate(parseFloat(e.target.value))}
						/>
					</InputContainer>
					{/* Trade Parameters */}
					<TitleHeading titleProp="Trade Parameters" />
					<InputContainer labelProp="Stop Loss ( in % )">
						<div className="flex flex-col gap-2 border border-dashed rounded-lg p-2">
							<div className="flex justify-between">
								<div className="font-semibold text-black/50">Stop Loss - 1</div>
							</div>
							<hr />
							<div className="flex flex-col  gap-2">
								<div className="flex gap-2 whitespace-nowrap items-center justify-between">
									<div>SL percent : </div>
									<input
										onChange={(e) => setTradeConfig((prev) => ({ ...prev, stopLoss: parseFloat(e.target.value) }))}
										className="px-2 py-1 w-20 rounded border-2 shadow"
										type="number"
										step={1}
										value={tradeConfig.stopLoss}
									/>
								</div>
							</div>
						</div>
						{tradeConfig.stopLoss_2 !== -1 && (
							<div className="flex flex-col gap-2 border border-dashed rounded-lg p-2">
								<div className="flex justify-between">
									<div className="font-semibold text-black/50">Stop Loss - 2</div>
									<button
										onClick={() => setTradeConfig((prev) => ({ ...prev, stopLoss_2: -1 }))}
										className="hover:opacity-50 w-5 h-5 bg-black/20 rounded-full text-black/50 border  border-black/30 flex items-center justify-center"
									>
										<X />
									</button>
								</div>
								<hr />
								<div className="flex flex-col  gap-2">
									<div className="flex gap-2 whitespace-nowrap items-center justify-between">
										<div>SL percent : </div>
										<input
											onChange={(e) => setTradeConfig((prev) => ({ ...prev, stopLoss: parseFloat(e.target.value) }))}
											className="px-2 py-1 w-20 rounded border-2 shadow"
											type="number"
											step={1}
											value={tradeConfig.stopLoss_2}
										/>
									</div>
								</div>
							</div>
						)}
						<button
							className="w-full py-1 bg-blue-100 border border-blue-400 text-blue-500 rounded-lg"
							onClick={() => setTradeConfig((prev) => ({ ...prev, stopLoss_2: 0 }))}
						>
							Add SL
						</button>
					</InputContainer>
					<InputContainer labelProp="Take Profit ( in % )">
						<MultipleTpInput multipleTpProp={tp} setMultipleTpProp={setTp} />
					</InputContainer>
					<InputContainer labelProp="Leverage">
						<input
							className="p-2 w-full rounded border-2 shadow"
							type="number"
							step={1}
							value={leverage}
							onChange={(e) => setLeverage(parseFloat(e.target.value))}
						/>
					</InputContainer>
					<InputContainer labelProp="Trading Fee">
						<div className="flex gap-2 items-center">
							<input
								className="w-4 h-4"
								type="checkbox"
								checked={includetradingFee}
								onChange={(e) => setIncludeTradingFee(e.target.checked)}
							/>
							Include Trading Fee
						</div>
					</InputContainer>
					{includetradingFee && (
						<InputContainer labelProp="Trading Fee ( in % )">
							<input
								className="p-2 w-full rounded border-2 shadow"
								type="number"
								value={tradeFee}
								onChange={(e) => setTradefee(parseFloat(e.target.value))}
							/>
						</InputContainer>
					)}
					<InputContainer labelProp="Funding Fee">
						<div className="flex gap-2 items-center">
							<input
								className="w-4 h-4"
								type="checkbox"
								checked={includeFundingFee}
								onChange={(e) => setIncludeFundingFee(e.target.checked)}
							/>
							Include Funding Fee
						</div>
					</InputContainer>
					{includeFundingFee && (
						<InputContainer labelProp="Funding Fee ( in % )">
							<input
								className="p-2 w-full rounded border-2 shadow"
								type="number"
								value={fundingFee}
								onChange={(e) => setFundingfee(parseFloat(e.target.value))}
							/>
						</InputContainer>
					)}
					<InputContainer labelProp="Save Report">
						<div className="flex gap-2 items-start">
							<input
								className="w-4 h-4 mt-1"
								type="checkbox"
								checked={saveReport}
								onChange={(e) => setSaveReport(e.target.checked)}
							/>
							Save Report After Generation
						</div>
					</InputContainer>
					{saveReport && (
						<InputContainer labelProp="Report Name">
							<input
								className="p-2 w-full rounded border-2 shadow"
								type="text"
								value={reportName}
								onChange={(e) => setReportName(e.target.value)}
							/>
						</InputContainer>
					)}
					<button
						onClick={handleSubmit}
						disabled={isProcessing}
						className="hover:opacity-50 font-semibold flex items-center gap-2 justify-center text-white bg-blue-500 rounded-2xl py-2 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
					>
						Create Report
					</button>
				</div>
			</div>
		</div>
	);
};

export default ReportInput;
