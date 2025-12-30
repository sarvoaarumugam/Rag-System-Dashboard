import { LoaderCircle, PanelLeftClose, PanelLeftOpen, SquarePen, Trash } from "lucide-react";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWebSocketContext } from "../../context/WebSocketContext";
import { useWebSocketEvent } from "../../hooks/UseWebSocketEvent";
import { ChatSessionType } from "../../types/ChatType";

interface ChatSessionsProps {
	openedProp: boolean;
	setOpenedProp: React.Dispatch<SetStateAction<boolean>>;
}

const ChatSessions: React.FC<ChatSessionsProps> = ({ openedProp, setOpenedProp }) => {
	const navigate = useNavigate();

	const { session_id } = useParams();

	const { client } = useWebSocketContext();
	const receivedData = useWebSocketEvent("get_all_sessions");
	const deletedConfirmation = useWebSocketEvent("delete_chat_session");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [chatSessions, setChatSessions] = useState<ChatSessionType[]>([]);

	const [hasMoreSessions, setHasMoreSessions] = useState<boolean>(false);

	const scrollableRef = useRef<HTMLDivElement | null>(null);
	const [loadingMoreSessions, setLoadingMoreSessions] = useState(false);

	// tiny threshold so it triggers a bit before exact bottom
	const BOTTOM_THRESHOLD = 16;

	const handleScroll = () => {
		const el = scrollableRef.current;
		if (!el) return;

		const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - BOTTOM_THRESHOLD;

		if (atBottom && hasMoreSessions && !loadingMoreSessions) {
			handleRequestingMoreSessions();
		}
	};

	const handleRequestingMoreSessions = () => {
		if (client?.isConnected()) {
			setLoadingMoreSessions(true);
			client.send({
				type: "get_all_sessions",
				data: { offset: chatSessions.length, limit: 10 },
			});
		}
	};

	//Receive Sessions Data
	useEffect(() => {
		if (!receivedData) return;

		if (receivedData?.status === "success" && receivedData?.sessions) {
			chatSessions.length === 0
				? setChatSessions(receivedData?.sessions)
				: setChatSessions((prev) => [...prev, ...receivedData?.sessions]);
			setHasMoreSessions(receivedData?.has_more);
			setLoadingMoreSessions(false);
			setIsLoading(false);
		}
	}, [receivedData]);

	//Request Initial Sessions
	useEffect(() => {
		if (client?.isConnected() && openedProp) {
			setChatSessions([]);
			client.send({ type: "get_all_sessions", data: { offset: 0, limit: 25 } });
			setIsLoading(true);
		}
	}, [openedProp]);

	//Request Deleting Chat Session
	const handleDelete = (session_id: string) => {
		if (client?.isConnected()) {
			client.send({ type: "delete_chat_session", data: { session_id: session_id } });
		}
	};

	//Receive Delete Confirmation
	useEffect(() => {
		if (!deletedConfirmation) return;

		if (deletedConfirmation?.status === "success" && deletedConfirmation?.session_id) {
			setChatSessions((prev) => prev.filter((item) => item.session_id !== deletedConfirmation.session_id));
			if (session_id === deletedConfirmation?.session_id) {
				navigate("/chat");
			}
		}
	}, [deletedConfirmation]);

	return (
		<>
			{openedProp ? (
				<>
					<div className="w-[256px] border-r h-screen bg-[rgba(0,0,0,0.02)]">
						<div className="w-full h-full flex flex-col p-2">
							{/* Header */}
							<div className="flex justify-between items-center">
								<button className="flex items-center p-2 text-black/50 hover:opacity-50" onClick={() => setOpenedProp(false)}>
									<PanelLeftClose />
								</button>
								<button className="flex items-center p-2 text-black/50 hover:opacity-50" onClick={() => navigate("/chat")}>
									<SquarePen />
								</button>
							</div>
							{/* Chats */}
							<div className="flex flex-col gap-2 mt-4">
								<div className="px-2 font-semibold">Chats</div>
								<div
									className={`flex flex-col gap-2 h-[calc(100vh-110px)] overflow-y-auto  ${hasMoreSessions ? "pb-16" : "pb-2"}`}
									ref={scrollableRef}
									onScroll={handleScroll}
								>
									{chatSessions && chatSessions.length > 0 ? (
										<>
											{chatSessions.map((chatSession, index) => (
												<div
													key={index}
													className={`px-2 py-[6px]  rounded-lg text-left items-center text-black/50 flex justify-between group cursor-pointer ${
														chatSession.session_id === session_id
															? "bg-white shadow-[2px_2px_0px_rgba(0,0,0,0.1)] border"
															: "hover:bg-black/5"
													}`}
													onClick={() => navigate(`/chat/${chatSession.session_id}`)}
												>
													<div className="whitespace-nowrap max-w-42 truncate">{chatSession.title}</div>
													<button
														className="group-hover:opacity-100 opacity-0 hover:text-red-500 text-gray-400 rounded-full hover:bg-red-200 p-2 aspect-square"
														onClick={(e) => {
															console.log("Delete Clicked");
															e.stopPropagation();
															handleDelete(chatSession.session_id);
														}}
													>
														<Trash size={16} />
													</button>
												</div>
											))}
											{loadingMoreSessions && (
												<div className="flex flex-col gap-2 text-black/25 justify-center items-center">
													<LoaderCircle className="animate-spin" />
													<div className="text-sm  text-center">Loading more sessions</div>
												</div>
											)}
										</>
									) : !isLoading && chatSessions && chatSessions.length === 0 ? (
										<div className="text-black/50 p-2 ">No Chat Sessions Found</div>
									) : (
										isLoading &&
										Array.from({ length: 24 }).map((_, index) => (
											<div key={index} className="w-full min-h-10 bg-black/5 rounded-lg animate-pulse"></div>
										))
									)}
								</div>
							</div>
						</div>
					</div>
				</>
			) : (
				<button className="absolute left-2 top-2 p-2 text-black/50 hover:opacity-50" onClick={() => setOpenedProp(true)}>
					<PanelLeftOpen />
				</button>
			)}
		</>
	);
};

export default ChatSessions;
