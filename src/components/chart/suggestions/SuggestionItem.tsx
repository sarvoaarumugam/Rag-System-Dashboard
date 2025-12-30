import { useState } from "react";
import { useObSuggestionsContext } from "../../../context/ObSuggestionsContext";
import AddLogPopup from "../logging/AddLogPopup";

export type OBSuggestionType = {
	features: {
		bos: boolean;
		displacement: number;
		htf_bias_confluence: boolean;
		impulse_percentage: number;
		mitigation_prct: number;
		ob_1d_htf_proximity: number;
		ob_4h_htf_proximity: number;
		orderblock_wick_ratio: number;
		trend_1d_swings: "uptrend" | "sideways" | "downtrend";
		trend_4h_swings: "uptrend" | "sideways" | "downtrend";
		volume_spike: number;
	};
	impulse_percentage: number;
	ml_prediction: {
		result: "profitable" | "not_profitable" | null;
		confindence_score: number | null;
	};
	timestamp: string;
	type: "bearish" | "bullish";
	zone_high: number;
	zone_low: number;
};

interface SuggestionItemProps {
	suggestionProp: OBSuggestionType;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({ suggestionProp }) => {
	const { selectedSuggestion, setSelectedSuggestion } = useObSuggestionsContext();

	const [addLogPopupVisibility, setAddLogPopupVisibility] = useState<boolean>(false);

	const handleSelection = () => {
		if (selectedSuggestion === suggestionProp) {
			setSelectedSuggestion(null);
		} else {
			setSelectedSuggestion(suggestionProp);
		}
	};

	return (
		<>
			<div
				className={`border w-full rounded-lg hover:cursor-pointer flex flex-col overflow-clip ${
					selectedSuggestion === suggestionProp ? "shadow-lg" : "hover:shadow-md"
				}`}
				onClick={handleSelection}
			>
				{suggestionProp.ml_prediction.confindence_score && suggestionProp.ml_prediction.result && (
					<div
						className={`w-full p-2 flex justify-between items-center ${
							suggestionProp.ml_prediction.result === "profitable" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
						}`}
					>
						<div>{suggestionProp.ml_prediction.result === "profitable" ? "Profitable" : "Non Profitable"}</div>
						<div className="font-bold">{suggestionProp.ml_prediction.confindence_score.toFixed(0)} %</div>
					</div>
				)}
				<div className="flex flex-col gap-2 p-2">
					<div className="flex justify-between ">
						<div className="text-sm">
							<span className="font-bold text-black/50">Timestamp :</span> {suggestionProp.timestamp}
						</div>
					</div>
					<div className="flex justify-between">
						<div className="text-sm">
							<span className="font-bold text-black/50">OB Type :</span> {suggestionProp.type}
						</div>
					</div>
					<div className="flex justify-between">
						<div className="text-sm">
							<span className="font-bold text-black/50">Zone :</span>{" "}
							{`${suggestionProp.zone_low.toFixed(2)} - ${suggestionProp.zone_high.toFixed(2)}`}
						</div>
					</div>
					{selectedSuggestion?.timestamp === suggestionProp.timestamp && (
						<>
							<div className="flex flex-col gap-2 text-sm">
								<div className="font-bold text-black/50">Features :</div>
								{Object.entries(suggestionProp.features).map(([key, value]) => (
									<div className="flex pl-6 gap-2" key={key}>
										<span className="font-bold text-black/50">{key} :</span>
										<span>{JSON.stringify(value)}</span>
									</div>
								))}
							</div>
							<button
								className="bg-blue-500 text-white rounded-2xl py-1 mt-2 hover:opacity-50"
								onClick={(e) => {
									setAddLogPopupVisibility(true), e.stopPropagation();
								}}
							>
								Log Trade
							</button>
						</>
					)}
				</div>
			</div>
			{addLogPopupVisibility && <AddLogPopup setPopupVisibilityProp={setAddLogPopupVisibility} />}
		</>
	);
};

export default SuggestionItem;
