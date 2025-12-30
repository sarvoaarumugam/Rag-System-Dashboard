import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { ToolLogType } from "../../types/ChatType";

interface ToolLogsProps {
	dataProp: ToolLogType[];
}

const ToolLogs: React.FC<ToolLogsProps> = ({ dataProp }) => {
	const [expanded, setExpanded] = useState<boolean>(false);

	return (
		<div className="flex flex-col gap-2 px-2">
			<button className="flex items-center gap-1 text-black/50" onClick={() => setExpanded((prev) => !prev)}>
				<div>Tool usage logs </div>
				{expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
			</button>
			{expanded && (
				<div className="flex flex-col">
					{dataProp.map((log, index) => (
						<div className="flex flex-col gap-1" key={index}>
							<div className="font-semibold">
								{log.type} - {log.tool_name}
							</div>
							{log?.arguments && <div>{JSON.stringify(log?.arguments)}</div>}
							{log?.content && <div>{JSON.stringify(log?.content)}</div>}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ToolLogs;
