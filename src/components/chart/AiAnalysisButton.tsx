import html2canvas from "html2canvas";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useChatMessagesContext } from "../../context/ChatMessagesContext";
import { OBSuggestionType } from "./suggestions/SuggestionItem";

import { Sparkles } from "lucide-react";

interface AiAnalysisButtonProps {
	chartContainerRefProp: React.RefObject<HTMLDivElement | null>;
	selectedSuggestionProp?: OBSuggestionType | null;
	chartConfigProp: ChartContextType;
}

export type ChartContextType = {
	symbol: string;
	timeframe: string;
	strategy_config?: {
		orderblock?: {
			impulse_threshold: number;
			impulse_window: number;
			invalidation_candle: number;
		};
	};
};

const AiAnalysisButton: React.FC<AiAnalysisButtonProps> = ({
	chartContainerRefProp,
	selectedSuggestionProp,
	chartConfigProp,
}) => {
	const navigate = useNavigate();

	const { setInitialMessage } = useChatMessagesContext();

	const handleCapture = async (): Promise<File | null> => {
		if (!chartContainerRefProp.current) return null;

		// Capture the chart
		const canvas = await html2canvas(chartContainerRefProp.current as HTMLDivElement, {
			backgroundColor: "#ffffff",
			scale: 2,
			useCORS: true,
		});

		// Convert canvas to Blob instead of triggering download
		return new Promise<File | null>((resolve) => {
			canvas.toBlob((blob) => {
				if (blob) {
					// Convert Blob → File
					const file = new File([blob], "chart.jpeg", { type: "image/jpeg" });
					resolve(file);
				} else {
					resolve(null);
				}
			}, "image/jpeg");
		});
	};

	const handleAiAnalysis = async () => {
		const file = await handleCapture();
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
		if (selectedSuggestionProp) {
			return `Analyse the chart and provide technical analysis - it should also include how strong the signal is for the entry.
            Below are the details of the order block : 
             
            Crypto Symbol : ${chartConfigProp.symbol}
            Timeframe : ${chartConfigProp.timeframe}
            Order Block Timestamp : ${selectedSuggestionProp.timestamp}
            Order Block Zone : ${selectedSuggestionProp.zone_low} - ${selectedSuggestionProp.zone_high}
            Order Block Type : ${selectedSuggestionProp.type}

            Below are the orderblock features:
            Break of Structure present after the orderblock impulse : ${selectedSuggestionProp.features.bos}
            Displacement Strength : ${selectedSuggestionProp.features.displacement}
            HTF Confluence : ${selectedSuggestionProp.features.htf_bias_confluence}
            Impulse Percentage : ${selectedSuggestionProp.features.impulse_percentage}
            Mitigation Percent : ${selectedSuggestionProp.features.mitigation_prct}
            Order block 1D Support/Resistance Proximity : ${selectedSuggestionProp.features.ob_1d_htf_proximity}
            Order block 4H Support/Resistance Proximity : ${selectedSuggestionProp.features.ob_4h_htf_proximity}
            Order Block Wick Ratio : ${selectedSuggestionProp.features.ob_4h_htf_proximity}
            1D Trend at the place of orderblock : ${selectedSuggestionProp.features.trend_1d_swings}
            4H Trend at the place of orderblock : ${selectedSuggestionProp.features.trend_4h_swings}
            Volume Spike : ${selectedSuggestionProp.features.volume_spike}
             `;
		} else {
			return `Analyse the chart and provide technical analysis - it should also include how strong the signal is for the entry.
            
            Below are the details of the chart:
            Crypto Symbol : ${chartConfigProp.symbol}
            Timeframe : ${chartConfigProp.timeframe}
            `;
		}
	};

	return (
		<button
			className="flex gap-2 items-center hover:opacity-65 text-sm bg-blue-100 text-blue-500 border border-blue-200 backdrop-blur-xl py-1 px-3 rounded-xl"
			onClick={handleAiAnalysis}
		>
			<Sparkles size={16} />
			AI Analysis
		</button>
	);
};

export default AiAnalysisButton;
