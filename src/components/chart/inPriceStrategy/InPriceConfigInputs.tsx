import { SetStateAction } from "react";
import { ObStrategyType } from "./AddInPriceChartPopup";

interface InPriceConfigInputsProps {
	obStrategyConfigProp: ObStrategyType;
	setObStrategyConfigProp: React.Dispatch<SetStateAction<ObStrategyType>>;
}

const InPriceConfigInputs: React.FC<InPriceConfigInputsProps> = ({ obStrategyConfigProp, setObStrategyConfigProp }) => {
	return (
		<>
			<div className="flex justify-between items-center">
				<div>Include Invalidated OBs</div>
				<input
					className="form-checkbox mr-4 h-5 w-5 text-blue-600"
					type="checkbox"
					checked={obStrategyConfigProp.include_invalidated_obs}
					onChange={(e) => setObStrategyConfigProp((prev) => ({ ...prev, include_invalidated_obs: e.target.checked }))}
				/>
			</div>
			<div className="flex justify-between items-center">
				<div>Impulse Threshold</div>
				<input
					className="p-2 w-24 rounded-xl border-2 shadow"
					type="number"
					step={0.5}
					value={obStrategyConfigProp.impulse_threshold}
					onChange={(e) => setObStrategyConfigProp((prev) => ({ ...prev, impulse_threshold: parseFloat(e.target.value) }))}
				/>
			</div>
			<div className="flex justify-between items-center">
				<div>Impulse Window</div>
				<input
					className="p-2 w-24 rounded-xl border-2 shadow"
					type="number"
					step={1}
					value={obStrategyConfigProp.impulse_window}
					onChange={(e) => setObStrategyConfigProp((prev) => ({ ...prev, impulse_window: parseFloat(e.target.value) }))}
				/>
			</div>
			<div className="flex justify-between items-center">
				<div>Invalidation Candle</div>
				<input
					className="p-2 w-24 rounded-xl border-2 shadow"
					type="number"
					step={1}
					value={obStrategyConfigProp.invalidation_candle}
					onChange={(e) => setObStrategyConfigProp((prev) => ({ ...prev, invalidation_candle: parseFloat(e.target.value) }))}
				/>
			</div>
			<div className="flex justify-between items-center">
				<div>Max Orderblocks Displayed</div>
				<input
					className="p-2 w-24 rounded-xl border-2 shadow"
					type="number"
					step={1}
					value={obStrategyConfigProp.max_orderblocks}
					onChange={(e) => setObStrategyConfigProp((prev) => ({ ...prev, max_orderblocks: parseFloat(e.target.value) }))}
				/>
			</div>
		</>
	);
};

export default InPriceConfigInputs;
