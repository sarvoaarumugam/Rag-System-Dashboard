import { X } from "lucide-react";
import { SetStateAction } from "react";

export type TpType = {
	position_size: number;
	tp_percent: number;
};

interface MultipleTpInputProps {
	multipleTpProp: TpType[];
	setMultipleTpProp: React.Dispatch<SetStateAction<TpType[]>>;
}

const MultipleTpInput: React.FC<MultipleTpInputProps> = ({ multipleTpProp, setMultipleTpProp }) => {
	return (
		<>
			<div className="flex flex-col gap-2">
				{multipleTpProp.map((tp, index) => (
					<div className="flex flex-col gap-2 border border-dashed rounded-lg p-2" key={index}>
						<div className="flex justify-between">
							<div className="font-semibold text-black/50">Take Profit - {index + 1}</div>
							{index > 0 && (
								<button
									onClick={() => setMultipleTpProp((prev) => prev.filter((_, i) => i !== index))}
									className="hover:opacity-50 w-5 h-5 bg-black/20 rounded-full text-black/50 border  border-black/30 flex items-center justify-center"
								>
									<X />
								</button>
							)}
						</div>
						<hr />
						<div className="flex flex-col  gap-2">
							<div className="flex gap-2 whitespace-nowrap items-center justify-between">
								<div>Position size : </div>
								<input
									onChange={(e) =>
										setMultipleTpProp((prev) =>
											prev.map((item, i) => (i === index ? { ...item, position_size: Number(e.target.value) } : item))
										)
									}
									className="px-2 py-1 w-20 rounded border-2 shadow"
									type="number"
									step={1}
									value={tp.position_size}
								/>
							</div>
							<div className="flex gap-2 whitespace-nowrap items-center justify-between">
								<div>TP percent : </div>
								<input
									className="px-2 py-1 w-20 rounded border-2 shadow"
									type="number"
									step={1}
									value={tp.tp_percent}
									onChange={(e) =>
										setMultipleTpProp((prev) =>
											prev.map((item, i) => (i === index ? { ...item, tp_percent: Number(e.target.value) } : item))
										)
									}
								/>
							</div>
						</div>
					</div>
				))}
			</div>
			{multipleTpProp.length < 3 && (
				<button
					className="w-full py-1 bg-blue-100 border border-blue-400 text-blue-500 rounded-lg"
					onClick={() =>
						setMultipleTpProp((prev) => [
							...prev,
							{ id: `Take Profit - ${multipleTpProp.length}`, position_size: 0, tp_percent: 0 },
						])
					}
				>
					Add TP
				</button>
			)}
		</>
	);
};

export default MultipleTpInput;
