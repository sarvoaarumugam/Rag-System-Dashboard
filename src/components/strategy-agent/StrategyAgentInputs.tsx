import { SetStateAction, useState } from "react";
import { format, subDays } from "date-fns";
import { Range } from "react-date-range";
import TitleHeading from "../common/TitleHeading";
import InputContainer from "../strategy-tester/reports/InputContainer";
import DateRangePicker from "../common/DateRangePicker";
import { AvailableTimeFrames } from "../../configs/AvailableTimeframes";
import { AvailableBinanceCryptos } from "../../configs/AvailableCryptos";

import { AvailableObTradeEntryOptions } from "../../configs/AvailableSettings";
import { useWebSocketContext } from "../../context/WebSocketContext";
import { AvailableOBTypes } from "../../configs/AvailableOBTypes";
import MultipleTpInput, { TpType } from "./AgentMultipleTpInput";

interface StrategyAgentInputsProps {
  isProcessingProp: boolean;
  setIsProcessingProp: React.Dispatch<SetStateAction<boolean>>;
}

const StrategyAgentInputs: React.FC<StrategyAgentInputsProps> = ({
  isProcessingProp,
  setIsProcessingProp,
}) => {
  const [symbol, setSymbol] = useState<string>("BTCUSDT");
  const [timeframe, setTimeframe] = useState<string>("15m");
  const [dateRange, setDateRange] = useState<Range>({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
    key: "selection",
  });
  const [impulsePercentageConfig, setImpulsePercentageConfig] = useState<{
    impulse_percentage_min: number;
    impulse_percentage_max: number;
    impulse_percentage_step: number;
  }>({
    impulse_percentage_min: 1.5,
    impulse_percentage_max: 3,
    impulse_percentage_step: 0.5,
  });
  const [impulseWindowConfig, setImpulseWindowConfig] = useState<{
    impulse_window_min: number;
    impulse_window_max: number;
    impulse_window_step: number;
  }>({
    impulse_window_min: 3,
    impulse_window_max: 5,
    impulse_window_step: 1,
  });
  const [stopLossConfig, setStopLossConfig] = useState<{
    stop_loss_min: number;
    stop_loss_max: number;
    stop_loss_step: number;
  }>({
    stop_loss_min: 1,
    stop_loss_max: 2,
    stop_loss_step: 1,
  });
  const [multipleTp, setMultipleTp] = useState<TpType[]>([
    {
      tp_min: 1,
      tp_max: 2,
      tp_step: 1,
      position_min: 2,
      position_max: 4,
      position_step: 1,
    },
  ]);

  const [obType, setObType] = useState<string>("all");
  const [inv_candle, setInvalidation] = useState<number>(2);

  const { client } = useWebSocketContext();

  const [walletBalance, setWalletBalance] = useState<number>(10000);

  const [investment, investmentUpdate] = useState<number>(1);

  const [bullish_entry, setBullish] = useState<string>("zone_high");
  const [bearish_entry, setBearish] = useState<string>("zone_low");

  const [leverage, setLeverage] = useState<number>(1);

  const [tradeFee, setTradefee] = useState<number>(0.04);
  const [fundingFee, setFundingfee] = useState<number>(0.01);

  const [includetradingFee, setIncludeTradingFee] = useState<boolean>(false);
  const [includeFundingFee, setIncludeFundingFee] = useState<boolean>(false);

  const handleSubmit = () => {
    if (client?.isConnected() && dateRange.startDate && dateRange.endDate) {
      setIsProcessingProp(true);

      client?.send({
        type: "multi_backtest_orderblocks",
        data: {
          symbol: symbol,
          timeframe: timeframe,
          start_date: format(dateRange.startDate, "yyyy-MM-dd 00:00:00"),
          end_date: format(dateRange.endDate, "yyyy-MM-dd 00:00:00"),

          wallet_balance: walletBalance,
          risk_pct: investment / 100,
          bullish_entry: bullish_entry,
          bearish_entry: bearish_entry,
          ob_type: obType,
          inv_candle: inv_candle,
          leverage: leverage,
          trade_fees: tradeFee / 100,
          funding_fees: fundingFee / 100,
          include_trading_fees: includetradingFee,
          include_funding_fees: includeFundingFee,

          impulse_window_min: impulseWindowConfig.impulse_window_min,
          impulse_window_max: impulseWindowConfig.impulse_window_max,
          impulse_window_step: impulseWindowConfig.impulse_window_step,

          impulse_percentage_min:
            impulsePercentageConfig.impulse_percentage_min,
          impulse_percentage_max:
            impulsePercentageConfig.impulse_percentage_max,
          impulse_percentage_step:
            impulsePercentageConfig.impulse_percentage_step,

          tp: multipleTp.map((t) => ({
            tp_min: t.tp_min / 100,
            tp_max: t.tp_max / 100,
            tp_step: t.tp_step / 100,
            position_min: t.position_min / 100,
            position_max: t.position_max / 100,
            position_step: t.position_step / 100,
          })),
          stop_loss_min: stopLossConfig.stop_loss_min / 100,
          stop_loss_max: stopLossConfig.stop_loss_max / 100,
          stop_loss_step: stopLossConfig.stop_loss_step / 100,
        },
      });
    }
  };

  return (
    <div className="w-full max-w-[380px] border-r h-full">
      <div className="flex flex-col gap-8 py-8 pr-8">
        <div className="text-2xl font-semibold text-center">
          Create Agent Strategy Report
        </div>
        <div className="flex flex-col gap-5">
          {/* General Parameters */}
          <TitleHeading titleProp="General Parameters" />
          <InputContainer labelProp="Symbol">
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="p-2 w-full rounded border-2 shadow"
            >
              {AvailableBinanceCryptos.map((crypto) => (
                <option key={crypto} value={crypto}>
                  {crypto}
                </option>
              ))}
            </select>
          </InputContainer>
          <InputContainer labelProp="Timeframe">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="p-2 rounded border-2 shadow"
            >
              {AvailableTimeFrames.map((tf) => (
                <option key={tf} value={tf}>
                  {tf}
                </option>
              ))}
            </select>
          </InputContainer>
          <InputContainer labelProp="Date Range">
            <DateRangePicker
              classNameProp="left-0"
              dateRangeProp={dateRange}
              setDateRangeProp={setDateRange}
            />
          </InputContainer>
          {/*OB Parameters*/}
          <TitleHeading titleProp="OB Parameters" />
          <InputContainer labelProp="Order Block Type">
            <select
              value={obType}
              onChange={(e) => setObType(e.target.value)}
              className="p-2 rounded border-2 shadow"
            >
              {AvailableOBTypes.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </InputContainer>
          <InputContainer labelProp="Invalidation Candle">
            <input
              className="p-2 w-full rounded border-2 shadow"
              type="number"
              step={1}
              value={inv_candle}
              onChange={(e) => setInvalidation(parseFloat(e.target.value))}
            />
          </InputContainer>
          {/* Impulse Window */}
          <TitleHeading titleProp="Impulse Window" />
          <InputContainer labelProp="Impulse Window Minimum">
            <input
              className="p-2 w-full rounded border-2 shadow"
              type="number"
              step={1}
              value={impulseWindowConfig.impulse_window_min}
              onChange={(e) =>
                setImpulseWindowConfig((prev) => ({
                  ...prev,
                  impulse_window_min: parseFloat(e.target.value),
                }))
              }
            />
          </InputContainer>
          <InputContainer labelProp="Impulse Window Maximum">
            <input
              className="p-2 w-full rounded border-2 shadow"
              type="number"
              step={1}
              value={impulseWindowConfig.impulse_window_max}
              onChange={(e) =>
                setImpulseWindowConfig((prev) => ({
                  ...prev,
                  impulse_window_max: parseFloat(e.target.value),
                }))
              }
            />
          </InputContainer>
          <InputContainer labelProp="Impulse Window Step">
            <input
              className="p-2 w-full rounded border-2 shadow"
              type="number"
              step={1}
              value={impulseWindowConfig.impulse_window_step}
              onChange={(e) =>
                setImpulseWindowConfig((prev) => ({
                  ...prev,
                  impulse_window_step: parseFloat(e.target.value),
                }))
              }
            />
          </InputContainer>
          {/* Impulse Window */}
          <TitleHeading titleProp="Impulse Threshold" />
          <InputContainer labelProp="Impulse Threshold Minimum">
            <input
              className="p-2 w-full rounded border-2 shadow"
              type="number"
              step={1}
              value={impulsePercentageConfig.impulse_percentage_min}
              onChange={(e) =>
                setImpulsePercentageConfig((prev) => ({
                  ...prev,
                  impulse_percentage_min: parseFloat(e.target.value),
                }))
              }
            />
          </InputContainer>
          <InputContainer labelProp="Impulse Threshold Maximum">
            <input
              className="p-2 w-full rounded border-2 shadow"
              type="number"
              step={1}
              value={impulsePercentageConfig.impulse_percentage_max}
              onChange={(e) =>
                setImpulsePercentageConfig((prev) => ({
                  ...prev,
                  impulse_percentage_max: parseFloat(e.target.value),
                }))
              }
            />
          </InputContainer>
          <InputContainer labelProp="Impulse Threshold Step">
            <input
              className="p-2 w-full rounded border-2 shadow"
              type="number"
              step={1}
              value={impulsePercentageConfig.impulse_percentage_step}
              onChange={(e) =>
                setImpulsePercentageConfig((prev) => ({
                  ...prev,
                  impulse_percentage_step: parseFloat(e.target.value),
                }))
              }
            />
          </InputContainer>
          {/* Take Profit */}
          <TitleHeading titleProp="Take Profit ( in % )" />
          <MultipleTpInput
            multipleTpProp={multipleTp}
            setMultipleTpProp={setMultipleTp}
          />

          {/* Stop Loss */}
          <TitleHeading titleProp="Stop Loss ( in % )" />
          <InputContainer labelProp="Stop Loss Minimum">
            <input
              className="p-2 w-full rounded border-2 shadow"
              type="number"
              step={1}
              value={stopLossConfig.stop_loss_min}
              onChange={(e) =>
                setStopLossConfig((prev) => ({
                  ...prev,
                  stop_loss_min: parseFloat(e.target.value),
                }))
              }
            />
          </InputContainer>
          <InputContainer labelProp="Stop Loss Maximum">
            <input
              className="p-2 w-full rounded border-2 shadow"
              type="number"
              step={1}
              value={stopLossConfig.stop_loss_max}
              onChange={(e) =>
                setStopLossConfig((prev) => ({
                  ...prev,
                  stop_loss_max: parseFloat(e.target.value),
                }))
              }
            />
          </InputContainer>
          <InputContainer labelProp="Stop Loss Step">
            <input
              className="p-2 w-full rounded border-2 shadow"
              type="number"
              step={1}
              value={stopLossConfig.stop_loss_step}
              onChange={(e) =>
                setStopLossConfig((prev) => ({
                  ...prev,
                  stop_loss_step: parseFloat(e.target.value),
                }))
              }
            />
          </InputContainer>
          {/*Entry Zone*/}
          <TitleHeading titleProp="Zone Selection" />
          <InputContainer labelProp="Bullish OrderBlock">
            <select
              value={bullish_entry}
              onChange={(e) => setBullish(e.target.value)}
              className="p-2 rounded border-2 shadow"
            >
              {AvailableObTradeEntryOptions.map((val) => (
                <option key={val} value={val}>
                  {val === "zone_high" ? "Zone High" : "Zone Low"}
                </option>
              ))}
            </select>
          </InputContainer>
          <InputContainer labelProp="Bearish OrderBlock">
            <select
              value={bearish_entry}
              onChange={(e) => setBearish(e.target.value)}
              className="p-2 rounded border-2 shadow"
            >
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

          <button
            onClick={handleSubmit}
            disabled={isProcessingProp}
            className="hover:opacity-50 font-semibold flex items-center gap-2 justify-center text-white bg-blue-500 rounded-2xl py-2 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            Create Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrategyAgentInputs;
