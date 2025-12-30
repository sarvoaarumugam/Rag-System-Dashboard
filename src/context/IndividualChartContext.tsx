import { createContext, SetStateAction, useContext, useState } from "react";
import { ChartConfigType } from "./ChartsContext";

type IndividualChartContextType = {
	chartConfig: ChartConfigType | null;
	setChartConfig: React.Dispatch<SetStateAction<ChartConfigType | null>>;
	expandSuggestions: boolean;
	setExpandSuggestions: React.Dispatch<SetStateAction<boolean>>;
};

const IndividualChartContext = createContext<IndividualChartContextType | null>(null);

export const IndividualChartContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [chartConfig, setChartConfig] = useState<ChartConfigType | null>(null);
	const [expandSuggestions, setExpandSuggestions] = useState<boolean>(false);

	return (
		<IndividualChartContext.Provider
			value={{
				chartConfig,
				setChartConfig,
				expandSuggestions,
				setExpandSuggestions,
			}}
		>
			{children}
		</IndividualChartContext.Provider>
	);
};

export const useIndividualChartContext = () => {
	const context = useContext(IndividualChartContext);

	if (!context) {
		throw new Error("Have useIndividualChartContext inside ChartsContextProvider");
	}
	return context;
};
