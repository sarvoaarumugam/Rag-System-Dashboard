import { useEffect } from "react";
import { useWebSocketContext } from "../../context/WebSocketContext";
import { useWebSocketEvent } from "../../hooks/UseWebSocketEvent";
import { useParams } from "react-router-dom";
import ChatBubble from "./ChatBubble";
import { useChatMessagesContext } from "../../context/ChatMessagesContext";

const ChatMessages = () => {
	const { client } = useWebSocketContext();
	const receivedData = useWebSocketEvent("get_chat_history");
	const receivedChat = useWebSocketEvent("chat");

	const { chatMessages, setChatMessages, isThinking, setIsThinking, setIsGenerating } = useChatMessagesContext();
	const { session_id } = useParams();

	// Request Chat History
	useEffect(() => {
		if (!isThinking) {
			setChatMessages([]);
			if (client?.isConnected()) {
				client.send({ type: "get_chat_history", data: { session_id: session_id } });
			}
		}
	}, [session_id]);

	// Receive the chat history
	useEffect(() => {
		if (!receivedData) return;

		if (receivedData?.status === "success" && receivedData?.history && session_id === receivedData?.session_id) {
			console.log("Setting Chat Messages");
			setChatMessages(receivedData?.history);
		}
	}, [receivedData]);

	// Receive and append/stream the latest reply from the server
	useEffect(() => {
		if (!receivedChat) return;
		if (receivedChat?.session_id !== session_id) return;

		if (receivedChat.type === "tool_call" || receivedChat.type === "tool_result") {
			setChatMessages((prev) => {
				const last = prev[prev.length - 1];

				// If last message is assistant, append delta
				if (last && last.role === "assistant") {
					const updated = [...prev];
					updated[updated.length - 1] = {
						...last,
						tool_events: [...(last.tool_events || []), receivedChat], // ✅ FIXED HERE
					};
					return updated;
				}

				// Otherwise, create a new assistant message
				return [
					...prev,
					{
						role: "assistant",
						content: receivedChat.delta || "",
						tool_events: [receivedChat], // ✅ Initialize array if needed
					},
				];
			});
		}

		if (receivedChat.status === "streaming") {
			setIsThinking(false);

			setChatMessages((prev) => {
				const last = prev[prev.length - 1];
				// If last message is assistant, append delta
				if (last && last.role === "assistant") {
					const updated = [...prev];
					updated[updated.length - 1] = {
						...last,
						content: last.content + (receivedChat.delta || ""),
					};
					return updated;
				}
				// Otherwise, create a new assistant message
				return [...prev, { role: "assistant", content: receivedChat.delta || "" }];
			});
		}

		if (receivedChat.status === "done") {
			setChatMessages((prev) => {
				const last = prev[prev.length - 1];
				// Replace last with final message from backend
				if (last && last.role === "assistant") {
					const updated = [...prev];
					updated[updated.length - 1] = {
						...last,
						content: receivedChat.message,
					};
					return updated;
				}
				return [...prev, { role: "assistant", content: receivedChat.message }];
			});
			setIsGenerating(false);
		}
	}, [receivedChat, session_id]);

	return (
		<div className="flex flex-col gap-8">
			{chatMessages && chatMessages.map((message, index) => <ChatBubble key={index} chatProp={message} />)}
			{isThinking && (
				<div className="flex gap-2 animate-pulse items-center">
					<div className="w-4 h-4 bg-black/30 rounded-full"></div>
					<div className="text-black/50 text-xl">Thinking</div>
				</div>
			)}
		</div>
	);
};

export default ChatMessages;
