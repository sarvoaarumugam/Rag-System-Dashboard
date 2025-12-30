export type ChatMessageType = {
	role: "user" | "assistant";
	image_url?: string;
	file_url?: string;
	content: string;
	tool_events?: ToolLogType[];
	tool_summary?: string;
};

export type ToolLogType = {
	arguments?: any;
	content?: string;
	timestamp: string;
	tool_id: string;
	tool_name: string;
	type: "tool_use" | "tool_result";
};

export type ChatSessionType = {
	session_id: string;
	title: string;
};
