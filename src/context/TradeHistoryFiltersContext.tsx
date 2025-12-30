import { subDays } from "date-fns";
import React, { createContext, SetStateAction, useContext, useState } from "react";
import { Range } from "react-date-range";
import { AvailableCryptos } from "../configs/AvailableCryptos";
import { AvailableTimeFrames } from "../configs/AvailableTimeframes";

type TradeHistoryFitersContextType = {
	symbolsFilter: string[];
	timeframesFilter: string[];
	setSymbolsFilter: React.Dispatch<SetStateAction<string[]>>;
	setTimeframesFilter: React.Dispatch<SetStateAction<string[]>>;
	dateRangeFilter: Range;
	setDateRangeFilter: React.Dispatch<SetStateAction<Range>>;
};

const TradeHistoryFitersContext = createContext<TradeHistoryFitersContextType | null>(null);

export const TradeHistoryFitersContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [symbolsFilter, setSymbolsFilter] = useState<string[]>(AvailableCryptos);
	const [timeframesFilter, setTimeframesFilter] = useState<string[]>(AvailableTimeFrames);
	const [dateRangeFilter, setDateRangeFilter] = useState<Range>({
		startDate: subDays(new Date(), 30),
		endDate: new Date(),
		key: "selection",
	});

	return (
		<TradeHistoryFitersContext.Provider
			value={{ symbolsFilter, setSymbolsFilter, timeframesFilter, setTimeframesFilter, dateRangeFilter, setDateRangeFilter }}
		>
			{children}
		</TradeHistoryFitersContext.Provider>
	);
};

export const useTradeHistoryFitersContext = () => {
	const context = useContext(TradeHistoryFitersContext);

	if (!context) {
		throw new Error("Have useTradeHistoryFitersContext inside TradeHistoryFitersContextProvider");
	}
	return context;
};
