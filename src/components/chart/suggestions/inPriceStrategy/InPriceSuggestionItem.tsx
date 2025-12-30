import { InPriceSuggestionType } from "../../../../types/suggestions/InPriceSuggestionType";

interface InPriceSuggestionItemProps {
	dataProp: InPriceSuggestionType;
}

const InPriceSuggestionItem: React.FC<InPriceSuggestionItemProps> = ({ dataProp }) => {
	return (
		<div className="border w-full rounded-lg hover:cursor-pointer flex flex-col overflow-clip">
			<div className="flex flex-col gap-2 p-2">
				<div className="flex justify-between ">
					<div className="text-sm">
						<span className="font-bold text-black/50">Timestamp : </span>
						{dataProp.timestamp}
					</div>
				</div>
				<div className="flex justify-between">
					<div className="text-sm">
						<span className="font-bold text-black/50">OB Type : </span>
						{dataProp.orderblock_type}
					</div>
				</div>
				<div className="flex justify-between">
					<div className="text-sm">
						<span className="font-bold text-black/50">Zone : </span>
						{`${dataProp.zone_low.toFixed(2)} - ${dataProp.zone_high.toFixed(2)}`}
					</div>
				</div>
				<div className="flex justify-between">
					<div className="text-sm">
						<span className="font-bold text-black/50">Impulse Percentage : </span>
						{dataProp.impulse_percentage}
					</div>
				</div>
				<div className="flex justify-between">
					<div className="text-sm">
						<span className="font-bold text-black/50">Invalidated : </span>
						{dataProp.invalidated.toString()}
					</div>
				</div>
			</div>
		</div>
	);
};

export default InPriceSuggestionItem;
