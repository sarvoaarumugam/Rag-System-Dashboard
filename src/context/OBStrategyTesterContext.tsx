import React, { createContext, SetStateAction, useContext, useState } from "react";

type OBStartegyTesterContextType = {
	isProcessing: boolean;
	setIsProcessing: React.Dispatch<SetStateAction<boolean>>;
};

const OBStartegyTesterContext = createContext<OBStartegyTesterContextType | null>(null);

export const OBStartegyTesterContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	return (
		<OBStartegyTesterContext.Provider value={{ isProcessing, setIsProcessing }}>{children}</OBStartegyTesterContext.Provider>
	);
};

export const useOBStartegyTesterContext = () => {
	const context = useContext(OBStartegyTesterContext);

	if (!context) {
		throw new Error("Have useOBStartegyTesterContext inside OBStartegyTesterContextProvider");
	}
	return context;
};
