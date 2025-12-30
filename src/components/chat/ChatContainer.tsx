import { useEffect, useRef, useState } from "react";
import ChatSessions from "./ChatSessions";
import ChatInput from "./ChatInput";
import { useParams } from "react-router-dom";
import ChatMessages from "./ChatMessages";
import { useChatMessagesContext } from "../../context/ChatMessagesContext";
import HomeChatInput from "./HomeChatInput";
import OptionsButton from "../common/OptionsButton";
import { ChatInputContextProvider } from "../../context/ChatInputContext";

const ChatContainer = () => {
	const [opened, setOpened] = useState<boolean>(false);

	const { session_id } = useParams();

	const { isGenerating } = useChatMessagesContext();

	const scrollableParent = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (isGenerating) {
			scrollToBottom();
		}
	}, [isGenerating]);

	const scrollToBottom = (smooth = true) => {
		const el = scrollableParent.current;
		if (!el) return;
		el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
	};

	return (
		<div className="h-screen w-screen relative flex overflow-clip">
			<ChatSessions openedProp={opened} setOpenedProp={setOpened} />

			<div className={`h-full relative pointer-events-none ${opened ? "w-[calc(100vw-256px)]" : "w-full"}`}>
				<div className="inset-0 absolute">
					<div className="fixed right-4 top-4 pointer-events-auto z-50">
						<OptionsButton />
					</div>
					<div className="w-full h-[calc(100vh-150px)] overflow-y-auto mt-16 pointer-events-auto" ref={scrollableParent}>
						<div className="h-full px-5 lg:px-0 lg:max-w-[640px] xl:max-w-[768px] mx-auto">
							{session_id ? (
								<ChatMessages />
							) : (
								<ChatInputContextProvider>
									<HomeChatInput />
								</ChatInputContextProvider>
							)}
						</div>
					</div>
					{session_id && (
						<div className="absolute bottom-0 w-full">
							<div className="relative pointer-events-none">
								<ChatInputContextProvider>
									<ChatInput />
								</ChatInputContextProvider>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatContainer;
