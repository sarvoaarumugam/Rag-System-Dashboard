import DateRangePicker from "../common/DateRangePicker";

import { AvailableCryptos } from "../../configs/AvailableCryptos";
import { AvailableTimeFrames } from "../../configs/AvailableTimeframes";
import { useTradeHistoryFitersContext } from "../../context/TradeHistoryFiltersContext";
import MultipleDropDown from "../common/MultipleDropDown";

const TradeHistoryFilters = () => {
	const { symbolsFilter, setSymbolsFilter, timeframesFilter, setTimeframesFilter, dateRangeFilter, setDateRangeFilter } =
		useTradeHistoryFitersContext();

	return (
		<div className="flex items-center justify-start gap-10">
			<div className="flex justify-between items-center gap-4">
				<div className="text-xl font-semibold text-black/40">Symbols : </div>

				<MultipleDropDown
					selectedOptionsProp={symbolsFilter}
					setSelectedOptionsProp={setSymbolsFilter}
					optionsProp={AvailableCryptos}
				/>
			</div>
			<div className="h-full border"></div>
			<div className="flex justify-between items-center gap-4">
				<div className="text-xl font-semibold text-black/40">Timeframes : </div>
				<MultipleDropDown
					selectedOptionsProp={timeframesFilter}
					setSelectedOptionsProp={setTimeframesFilter}
					optionsProp={AvailableTimeFrames}
				/>
			</div>
			<div className="h-full border"></div>
			<div className="flex justify-between items-center gap-4">
				<div className="text-xl font-semibold text-black/40">Date Range : </div>
				<DateRangePicker dateRangeProp={dateRangeFilter} setDateRangeProp={setDateRangeFilter} />
			</div>
		</div>
	);
};

export default TradeHistoryFilters;
