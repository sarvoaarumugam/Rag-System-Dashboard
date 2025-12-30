import React, { createContext, SetStateAction, useContext, useState } from "react";

import { InPriceSuggestionsType } from "../types/suggestions/InPriceSuggestionType";

type InPriceSuggestionsContextType = {
	selectedSuggestion: InPriceSuggestionsType | null;
	setSelectedSuggestion: React.Dispatch<SetStateAction<InPriceSuggestionsType | null>>;
	suggestions: InPriceSuggestionsType[];
	setSuggestions: React.Dispatch<SetStateAction<InPriceSuggestionsType[]>>;
};

const InPriceSuggestionsContext = createContext<InPriceSuggestionsContextType | null>(null);

export const InPriceSuggestionsContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [selectedSuggestion, setSelectedSuggestion] = useState<InPriceSuggestionsType | null>(null);
	const [suggestions, setSuggestions] = useState<InPriceSuggestionsType[]>([]);

	return (
		<InPriceSuggestionsContext.Provider value={{ selectedSuggestion, setSelectedSuggestion, suggestions, setSuggestions }}>
			{children}
		</InPriceSuggestionsContext.Provider>
	);
};

export const useInPriceSuggestionsContext = () => {
	const context = useContext(InPriceSuggestionsContext);

	if (!context) {
		throw new Error("Have useInPriceSuggestionsContext inside InPriceSuggestionsContextProvider");
	}
	return context;
};
