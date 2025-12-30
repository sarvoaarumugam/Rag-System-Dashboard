import React, { createContext, SetStateAction, useContext, useState } from "react";
import { OBSuggestionType } from "../components/chart/suggestions/SuggestionItem";

type ObSuggestionsContextType = {
	selectedSuggestion: OBSuggestionType | null;
	setSelectedSuggestion: React.Dispatch<SetStateAction<OBSuggestionType | null>>;
	suggestions: OBSuggestionType[];
	setSuggestions: React.Dispatch<SetStateAction<OBSuggestionType[]>>;
};

const ObSuggestionsContext = createContext<ObSuggestionsContextType | null>(null);

export const ObSuggestionsContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [selectedSuggestion, setSelectedSuggestion] = useState<OBSuggestionType | null>(null);
	const [suggestions, setSuggestions] = useState<OBSuggestionType[]>([]);

	return (
		<ObSuggestionsContext.Provider value={{ selectedSuggestion, setSelectedSuggestion, suggestions, setSuggestions }}>
			{children}
		</ObSuggestionsContext.Provider>
	);
};

export const useObSuggestionsContext = () => {
	const context = useContext(ObSuggestionsContext);

	if (!context) {
		throw new Error("Have useSuggestionsContext inside SuggestionsContextProvider");
	}
	return context;
};
