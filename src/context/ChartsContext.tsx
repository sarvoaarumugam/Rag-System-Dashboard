import { createContext, SetStateAction, useContext, useState } from "react";

export type ChartConfigType = {
	symbol: string;
	timeframe: string;
	indicators_config: IndicatorsConfigType;
	strategy_config: Record<string, StrategyConfigType>;
};

type StrategyConfigType = {
	impulse_threshold: number;
	impulse_window: number;
	inv_candle: number;
	include_invalidated_obs?: boolean;
	max_orderblocks?: number;
	enabled?: boolean;
};

export type IndicatorsConfigType = {
	swings: { swing_length: number; enabled: boolean };
	trend: { trend_length: number; enabled: boolean };
	volume: { enabled: boolean };
	break_of_structure: { enabled: boolean };
	order_blocks: { enabled: boolean };
};

type ChartsContextType = {
	chartsConfigs: ChartConfigType[];
	setChartsConfigs: React.Dispatch<SetStateAction<ChartConfigType[]>>;
	fullscreen: boolean;
	setFullscreen: React.Dispatch<SetStateAction<boolean>>;
	fullscreenConfig: ChartConfigType | null;
	setFullscreenConfig: React.Dispatch<SetStateAction<ChartConfigType | null>>;
};

const ChartsContext = createContext<ChartsContextType | null>(null);

export const ChartsContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [chartsConfigs, setChartsConfigs] = useState<ChartConfigType[]>([]);
	const [fullscreen, setFullscreen] = useState<boolean>(false);
	const [fullscreenConfig, setFullscreenConfig] = useState<ChartConfigType | null>(null);

	return (
		<ChartsContext.Provider
			value={{
				chartsConfigs,
				setChartsConfigs,
				fullscreen,
				setFullscreen,
				fullscreenConfig,
				setFullscreenConfig,
			}}
		>
			{children}
		</ChartsContext.Provider>
	);
};

export const useChartsContext = () => {
	const context = useContext(ChartsContext);

	if (!context) {
		throw new Error("Have useChartsContext inside ChartsContextProvider");
	}
	return context;
};
