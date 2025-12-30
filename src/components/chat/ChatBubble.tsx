import React from "react";
import { ChatMessageType } from "../../types/ChatType";
import ToolLogs from "./ToolLogs";

interface ChatBubbleProps {
	chatProp: ChatMessageType;
}

export const formatMessage = (text: string) => {
	return text
		.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
		.replace(/^(#{1,6})\s*(.+)$/gm, (_m, hashes: string, content: string) => {
			const level = Math.min(hashes.length, 6);
			return `<h${level}>${content.trim()}</h${level}>`;
		})
		.replace(/\n/g, "<br />"); // new lines
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ chatProp }) => {
	const handleFileDownload = (fileLink: string) => {
		const link = document.createElement("a");
		link.href = fileLink;
		link.download = "myfile.csv";
		link.click();
	};

	return (
		<div className="flex flex-col gap-1">
			{chatProp.tool_events && <ToolLogs dataProp={chatProp.tool_events} />}
			<div className={`w-full flex ${chatProp.role === "user" ? "flex-col gap-1 items-end" : ""}`}>
				{chatProp.image_url && (
					<img
						className="object-cover max-w-[420px] max-h-[420px] border rounded-xl"
						src={chatProp.image_url}
						alt="user input image"
					/>
				)}

				{chatProp?.file_url && (
					<button
						onClick={() => handleFileDownload(chatProp.file_url || "")}
						className="object-cover cursor-pointer hover:opacity-50 max-w-[420px] max-h-[420px] border rounded-xl p-5 bg-blue-50 border-blue-400 text-blue-500 items-center justify-center flex flex-col gap-1"
					>
						<div>Attached CSV file</div>
						<div>Click to download the file</div>
					</button>
				)}
				<div
					className={`p-2 ${chatProp.role === "user" ? "bg-black/5 max-w-[420px] border border-black/10 rounded-lg " : ""}`}
					dangerouslySetInnerHTML={{ __html: formatMessage(chatProp.content) }}
				></div>
			</div>
		</div>
	);
};

export default ChatBubble;
