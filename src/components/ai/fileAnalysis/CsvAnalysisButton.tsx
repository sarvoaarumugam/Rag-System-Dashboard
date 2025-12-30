import React from "react";
import { useNavigate } from "react-router-dom";
import { useChatMessagesContext } from "../../../context/ChatMessagesContext";

import { Sparkles } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { buildCSVFile, toCSVValue } from "../../../utils/CsvUtilities";
import { StrategyAgentAnalysisPromptGenerator } from "../../../utils/prompt_generators/StrategyAgentPrompt";
import { StrategyAgentTradesAnalysisPromptGenerator } from "../../../utils/prompt_generators/TradesDataPrompt";

interface CsvAnalysisButtonProps {
	dataProp: any;
	tableProp: Table<any>;
	typeProp: "report_automation" | "trade_data";
}

const CsvAnalysisButton: React.FC<CsvAnalysisButtonProps> = ({ tableProp, typeProp, dataProp }) => {
	const navigate = useNavigate();

	const { setInitialMessage } = useChatMessagesContext();

	const handleExportCSV = () => {
		const leafCols = tableProp.getAllLeafColumns();
		const headers = leafCols.map((c) => (typeof c.columnDef.header === "string" ? c.columnDef.header : c.id)).map(toCSVValue);

		const dataRows = tableProp.getRowModel().rows.map((row) =>
			leafCols.map((c) => {
				let v = row.getValue<any>(c.id);
				if ((c.id === "take_profit" || c.id === "stop_loss") && typeof v === "number") v = v * 100;
				return toCSVValue(v);
			})
		);

		const rows = [headers, ...dataRows];

		const file = buildCSVFile("file.csv", rows);

		return file; // if you want the caller to receive it
	};

	const handleAiAnalysis = async () => {
		const file = handleExportCSV();
		if (!file) {
			console.error("Failed to capture chart");
		}

		setInitialMessage({
			prompt: handlePromptCreation(),
			file: file as File,
		});

		navigate("/chat");
	};

	const handlePromptCreation = () => {
		if (typeProp === "report_automation") {
			return StrategyAgentAnalysisPromptGenerator(dataProp);
		} else {
			return StrategyAgentTradesAnalysisPromptGenerator(dataProp);
		}
	};

	return (
		<button
			className="flex text-sm bg-blue-50 gap-2 border-blue-400 border text-blue-500 p-2 w-fit rounded-2xl items-center"
			onClick={handleAiAnalysis}
		>
			<Sparkles size={16} />
			AI Analysis
		</button>
	);
};

export default CsvAnalysisButton;
