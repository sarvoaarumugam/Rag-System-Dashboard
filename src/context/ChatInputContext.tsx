import React, { createContext, SetStateAction, useContext, useState } from "react";

type ChatInputContextType = {
	imageUrl: string;
	setImageUrl: React.Dispatch<SetStateAction<string>>;
	fileUrl: string;
	setFileUrl: React.Dispatch<SetStateAction<string>>;
};

const ChatInputContext = createContext<ChatInputContextType | null>(null);

export const ChatInputContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [imageUrl, setImageUrl] = useState<string>("");
	const [fileUrl, setFileUrl] = useState<string>("");

	return <ChatInputContext.Provider value={{ imageUrl, setImageUrl, fileUrl, setFileUrl }}>{children}</ChatInputContext.Provider>;
};

export const useChatInputContext = () => {
	const context = useContext(ChatInputContext);

	if (!context) {
		throw new Error("Have useChatInputContext inside ChatInputContextProvider");
	}
	return context;
};
