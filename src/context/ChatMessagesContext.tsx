import React, { createContext, SetStateAction, useContext, useState } from "react";
import { ChatMessageType } from "../types/ChatType";

type ChatMessagesContextType = {
	chatMessages: ChatMessageType[];
	setChatMessages: React.Dispatch<SetStateAction<ChatMessageType[]>>;
	initialMessage: InitialMessageType | null;
	setInitialMessage: React.Dispatch<SetStateAction<InitialMessageType | null>>;
	isThinking: boolean;
	setIsThinking: React.Dispatch<SetStateAction<boolean>>;
	isGenerating: boolean;
	setIsGenerating: React.Dispatch<SetStateAction<boolean>>;
};

type InitialMessageType = {
	prompt: string;
	file: File;
};

const ChatMessagesContext = createContext<ChatMessagesContextType | null>(null);

export const ChatMessagesContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
	const [isThinking, setIsThinking] = useState<boolean>(false);
	const [isGenerating, setIsGenerating] = useState<boolean>(false);
	const [initialMessage, setInitialMessage] = useState<InitialMessageType | null>(null);

	return (
		<ChatMessagesContext.Provider
			value={{
				chatMessages,
				setChatMessages,
				isThinking,
				setIsThinking,
				isGenerating,
				setIsGenerating,
				initialMessage,
				setInitialMessage,
			}}
		>
			{children}
		</ChatMessagesContext.Provider>
	);
};

export const useChatMessagesContext = () => {
	const context = useContext(ChatMessagesContext);

	if (!context) {
		throw new Error("Have useChatMessagesContext inside ChatMessagesContextProvider");
	}
	return context;
};
