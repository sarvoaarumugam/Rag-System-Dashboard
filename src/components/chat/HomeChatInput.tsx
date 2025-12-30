import { Home, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../../context/WebSocketContext";
import { useEffect, useRef, useState } from "react";
import { useChatMessagesContext } from "../../context/ChatMessagesContext";
import { useWebSocketEvent } from "../../hooks/UseWebSocketEvent";
import Cookies from "js-cookie";
import ImageInput from "./ImageInput";
import { useChatInputContext } from "../../context/ChatInputContext";

const HomeChatInput = () => {
	const { client } = useWebSocketContext();

	const [input, setInput] = useState<string>("");
	const [isWaiting, setIsWaiting] = useState<boolean>(false);

	const { setChatMessages, setIsThinking, initialMessage, setInitialMessage } = useChatMessagesContext();
	const { imageUrl, setImageUrl, fileUrl, setFileUrl } = useChatInputContext();

	const userName = Cookies.get("user_name");

	const confirmation = useWebSocketEvent("create_chat_session_id");

	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	const navigate = useNavigate();

	useEffect(() => {
		if (initialMessage) {
			setInput(initialMessage.prompt);
		}
	}, []);

	const handleSubmit = () => {
		if (!input.trim()) return;

		if (client?.isConnected()) {
			client.send({ type: "create_chat_session_id" });

			setIsWaiting(true);
		}
	};

	const handleTextAreaHeight = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto"; // reset before recalculating
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "24px";
		}
	}, []);

	useEffect(() => {
		if (!confirmation) return;

		if (confirmation && confirmation?.status === "success" && confirmation?.session_id) {
			if (client?.isConnected()) {
				let data: any = {
					session_id: confirmation?.session_id,
					message: input.trim(),
				};

				if (imageUrl) {
					data = { ...data, image_url: imageUrl };
				}

				if (fileUrl) {
					data = { ...data, file_url: fileUrl };
				}

				client.send({ type: "chat", data: data });

				setChatMessages([]);
				if (imageUrl) {
					setChatMessages((prev) => [...prev, { role: "user", content: input.trim(), image_url: imageUrl }]);
				} else if (fileUrl) {
					setChatMessages((prev) => [...prev, { role: "user", content: input.trim(), file_url: fileUrl }]);
				} else {
					setChatMessages((prev) => [...prev, { role: "user", content: input.trim() }]);
				}

				setInput("");
				setImageUrl("");
				setFileUrl("");
				setIsThinking(true);

				if (initialMessage) {
					setInitialMessage(null);
				}

				navigate(`/chat/${confirmation?.session_id}`);
			}
		}
	}, [confirmation]);

	return (
		<div className="w-full h-full flex flex-col gap-10 justify-center items-center px-5">
			<div className="text-4xl font-medium text-black/50">Hi {userName}! How can I help you today?</div>
			<div className="flex gap-2 w-full mx-auto items-center">
				<button
					className="rounded-full w-12 h-12 aspect-square p-2 flex items-center justify-center bg-blue-500 text-blue-100 hover:bg-blue-300"
					onClick={() => navigate("/")}
				>
					<Home size={24} />
				</button>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
					className={`flex p-3 w-full rounded-3xl  border  ${
						!isWaiting
							? "bg-gradient-to-r from-blue-50/80 to-blue-100/20 border-blue-200 backdrop-blur-lg"
							: "bg-[#f3f3f3] border-black/10"
					} ${textareaRef.current?.style.height === "24px" ? "items-center" : "items-end"}`}
				>
					<ImageInput imagePositionProp="bottom" />
					<textarea
						disabled={isWaiting}
						ref={textareaRef}
						placeholder="Type here..."
						rows={1}
						className="px-2 w-full text-blue-900 bg-transparent outline-none max-h-[200px] resize-none"
						value={input}
						onChange={(e) => {
							setInput(e.target.value);
							handleTextAreaHeight();
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
								// Don't submit while IME is composing characters
								if ((e as React.KeyboardEvent).nativeEvent.isComposing) return;

								e.preventDefault();
								if (!isWaiting && input.trim().length !== 0) {
									// submit the nearest form
									e.currentTarget.form?.requestSubmit();
								}
							}
						}}
					/>

					<div className="self-stretch flex items-end">
						<button
							type="submit"
							disabled={!input || isWaiting}
							className="disabled:bg-gray-300 disabled:text-gray-100 disabled:cursor-not-allowed rounded-full w-8 h-8 p-2 bg-blue-500 text-blue-100 hover:opacity-50"
						>
							<Send size={16} />
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default HomeChatInput;
