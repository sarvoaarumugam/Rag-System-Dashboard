import { useEffect, useMemo, useState } from "react";
import TitleHeading from "../../common/TitleHeading";
import { AvailableOBTypes } from "../../../configs/AvailableOBTypes";
import InputContainer from "../reports/InputContainer";
import { AvailableTrends } from "../../../configs/AvailableTrends";
import { useParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";

interface FilterFeaturesInputProps {
	isLoadingProp: boolean;
	handleSubmitProp: (payload: any) => void;
}

// Defaults collected centrally for easy reuse
const DEFAULTS = {
	impulse_threshold: 0,
	ob_type: "all",
	mitigation_prct: 0,
	volume_spike: 0,
	displacement_strength: 0,
	orderblock_wick_ratio: 0,
	bos_detected: "not considered",
	trend_direction_swings: "all",
	outcome: "all",
};

const AvailableBoSValues = ["not considered", "true", "false"];
const AvailableOutcomes = ["all", "profit", "loss"];

type FilterKey =
	| "min_impulse"
	| "max_impulse"
	| "ob_type"
	//mitigation
	| "min_mitigation"
	| "max_mitigation"
	//volume spike
	| "min_volume_spike"
	| "max_volume_spike"
	//displacement
	| "min_displacement"
	| "max_displacement"
	//wick ratio
	| "min_ob_wick_ratio"
	| "max_ob_wick_ratio"
	| "bos_detected"
	| "trend_direction_swings"
	| "outcome";

const FilterFeaturesInput: React.FC<FilterFeaturesInputProps> = ({ isLoadingProp, handleSubmitProp }) => {
	const [obStrategyConfig, setObStrategyConfig] = useState<{
		impulse_threshold: { min: number; max: number };
		ob_type: string;
	}>({
		impulse_threshold: { min: DEFAULTS.impulse_threshold, max: DEFAULTS.impulse_threshold },
		ob_type: DEFAULTS.ob_type,
	});

	const [numericalfeatures, setNumericalFeatures] = useState<{
		mitigation_prct: { min: number; max: number };
		volume_spike: { min: number; max: number };
		displacement_strength: { min: number; max: number };
		orderblock_wick_ratio: { min: number; max: number };
	}>({
		mitigation_prct: { min: DEFAULTS.mitigation_prct, max: DEFAULTS.mitigation_prct },
		volume_spike: { min: DEFAULTS.volume_spike, max: DEFAULTS.volume_spike },
		displacement_strength: { min: DEFAULTS.displacement_strength, max: DEFAULTS.displacement_strength },
		orderblock_wick_ratio: { min: DEFAULTS.orderblock_wick_ratio, max: DEFAULTS.orderblock_wick_ratio },
	});

	const [categoricalFeatures, setCategoricalFeatures] = useState<{
		bos_detected: string;
		trend_direction_swings: string;
		outcome: string;
	}>({
		bos_detected: DEFAULTS.bos_detected,
		trend_direction_swings: DEFAULTS.trend_direction_swings,
		outcome: DEFAULTS.outcome,
	});

	const { report_id } = useParams();

	// Compute a normalized list of active filters (for chips AND payload)
	const activeFilters = useMemo(() => {
		const list: { key: FilterKey; value: string | number }[] = [];

		// OB / strategy
		if (obStrategyConfig.impulse_threshold.min !== DEFAULTS.impulse_threshold) {
			list.push({
				key: "min_impulse",
				value: obStrategyConfig.impulse_threshold.min,
			});
		}
		if (obStrategyConfig.impulse_threshold.max !== DEFAULTS.impulse_threshold) {
			list.push({
				key: "max_impulse",
				value: obStrategyConfig.impulse_threshold.max,
			});
		}
		if (obStrategyConfig.ob_type.toLowerCase() !== "all") {
			list.push({
				key: "ob_type",
				value: obStrategyConfig.ob_type,
			});
		}

		// Numeric features: thresholds > 0 are considered active
		if (numericalfeatures.mitigation_prct.min !== DEFAULTS.mitigation_prct) {
			list.push({
				key: "min_mitigation",
				value: numericalfeatures.mitigation_prct.min,
			});
		}
		if (numericalfeatures.mitigation_prct.max !== DEFAULTS.mitigation_prct) {
			list.push({
				key: "max_mitigation",
				value: numericalfeatures.mitigation_prct.max,
			});
		}
		if (numericalfeatures.volume_spike.min !== DEFAULTS.volume_spike) {
			list.push({
				key: "min_volume_spike",
				value: numericalfeatures.volume_spike.min,
			});
		}
		if (numericalfeatures.volume_spike.max !== DEFAULTS.volume_spike) {
			list.push({
				key: "max_volume_spike",
				value: numericalfeatures.volume_spike.max,
			});
		}
		if (numericalfeatures.displacement_strength.min !== DEFAULTS.displacement_strength) {
			list.push({
				key: "min_displacement",
				value: numericalfeatures.displacement_strength.min,
			});
		}
		if (numericalfeatures.displacement_strength.max !== DEFAULTS.displacement_strength) {
			list.push({
				key: "max_displacement",
				value: numericalfeatures.displacement_strength.max,
			});
		}
		if (numericalfeatures.orderblock_wick_ratio.min !== DEFAULTS.orderblock_wick_ratio) {
			list.push({
				key: "min_ob_wick_ratio",
				value: numericalfeatures.orderblock_wick_ratio.min,
			});
		}
		if (numericalfeatures.orderblock_wick_ratio.max !== DEFAULTS.orderblock_wick_ratio) {
			list.push({
				key: "max_ob_wick_ratio",
				value: numericalfeatures.orderblock_wick_ratio.max,
			});
		}

		// Categorical
		if (categoricalFeatures.bos_detected !== "not considered") {
			list.push({
				key: "bos_detected",
				value: categoricalFeatures.bos_detected,
			});
		}
		if (categoricalFeatures.trend_direction_swings.toLowerCase() !== "all") {
			list.push({
				key: "trend_direction_swings",
				value: categoricalFeatures.trend_direction_swings,
			});
		}
		if (categoricalFeatures.outcome.toLowerCase() !== "all") {
			list.push({
				key: "outcome",
				value: categoricalFeatures.outcome,
			});
		}

		return list;
	}, [obStrategyConfig, numericalfeatures, categoricalFeatures]);

	// Build payload only from active filters (ignore defaults)
	const buildPayloadFilters = () => {
		const filters: Record<string, string | number | boolean> = {};

		activeFilters.forEach(({ key, value }) => {
			// Convert string booleans for bos_detected
			if (key === "bos_detected") {
				if (value === "true") filters[key] = true;
				else if (value === "false") filters[key] = false;
			} else {
				filters[key] = typeof value === "string" && !isNaN(Number(value)) ? Number(value) : (value as any);
			}
		});

		return filters;
	};

	// Remove a single filter chip -> reset just that piece of state
	const removeFilter = (key: FilterKey) => {
		switch (key) {
			case "min_impulse":
				setObStrategyConfig((p) => ({
					...p,
					impulse_threshold: { min: DEFAULTS.impulse_threshold, max: p.impulse_threshold.max },
				}));
				break;
			case "max_impulse":
				setObStrategyConfig((p) => ({
					...p,
					impulse_threshold: { min: p.impulse_threshold.min, max: DEFAULTS.impulse_threshold },
				}));
				break;
			case "ob_type":
				setObStrategyConfig((p) => ({ ...p, ob_type: DEFAULTS.ob_type }));
				break;
			case "min_mitigation":
				setNumericalFeatures((p) => ({
					...p,
					mitigation_prct: { min: DEFAULTS.mitigation_prct, max: p.mitigation_prct.max },
				}));
				break;
			case "max_mitigation":
				setNumericalFeatures((p) => ({
					...p,
					mitigation_prct: { min: p.mitigation_prct.min, max: DEFAULTS.mitigation_prct },
				}));
				break;
			case "min_volume_spike":
				setNumericalFeatures((p) => ({
					...p,
					volume_spike: { min: DEFAULTS.volume_spike, max: p.volume_spike.max },
				}));
				break;
			case "max_volume_spike":
				setNumericalFeatures((p) => ({
					...p,
					volume_spike: { min: p.volume_spike.min, max: DEFAULTS.volume_spike },
				}));
				break;
			case "min_displacement":
				setNumericalFeatures((p) => ({
					...p,
					displacement_strength: { min: DEFAULTS.displacement_strength, max: p.displacement_strength.max },
				}));
				break;
			case "max_displacement":
				setNumericalFeatures((p) => ({
					...p,
					displacement_strength: { min: p.displacement_strength.min, max: DEFAULTS.displacement_strength },
				}));
				break;
			case "min_ob_wick_ratio":
				setNumericalFeatures((p) => ({
					...p,
					orderblock_wick_ratio: { min: DEFAULTS.orderblock_wick_ratio, max: p.orderblock_wick_ratio.max },
				}));
				break;
			case "max_ob_wick_ratio":
				setNumericalFeatures((p) => ({
					...p,
					orderblock_wick_ratio: { min: p.orderblock_wick_ratio.min, max: DEFAULTS.orderblock_wick_ratio },
				}));
				break;
			case "bos_detected":
				setCategoricalFeatures((p) => ({ ...p, bos_detected: DEFAULTS.bos_detected }));
				break;
			case "trend_direction_swings":
				setCategoricalFeatures((p) => ({
					...p,
					trend_direction_swings: DEFAULTS.trend_direction_swings,
				}));
				break;
			case "outcome":
				setCategoricalFeatures((p) => ({ ...p, outcome: DEFAULTS.outcome }));
				break;
			default:
				break;
		}
	};

	const clearAll = () => {
		setObStrategyConfig({
			impulse_threshold: { min: DEFAULTS.impulse_threshold, max: DEFAULTS.impulse_threshold },
			ob_type: DEFAULTS.ob_type,
		});
		setNumericalFeatures({
			mitigation_prct: { min: DEFAULTS.mitigation_prct, max: DEFAULTS.mitigation_prct },
			volume_spike: { min: DEFAULTS.volume_spike, max: DEFAULTS.volume_spike },
			displacement_strength: { min: DEFAULTS.displacement_strength, max: DEFAULTS.displacement_strength },
			orderblock_wick_ratio: { min: DEFAULTS.orderblock_wick_ratio, max: DEFAULTS.orderblock_wick_ratio },
		});
		setCategoricalFeatures({
			bos_detected: DEFAULTS.bos_detected,
			trend_direction_swings: DEFAULTS.trend_direction_swings,
			outcome: DEFAULTS.outcome,
		});
		handleReset();
	};

	const handleReset = () => {
		const payload = {
			type: "filter_backtest_report",
			data: {
				key: report_id,
			},
		};
		handleSubmitProp(payload);
	};

	const handleSubmit = () => {
		const payload = {
			type: "filter_backtest_report",
			data: {
				filters: buildPayloadFilters(),
				key: report_id,
			},
		};
		handleSubmitProp(payload);
	};

	useEffect(() => {
		handleSubmit();
	}, []);

	const appliedCount = activeFilters.length;

	return (
		<div className="w-full border-r h-full">
			<div className="flex flex-col gap-6 py-8 pr-8">
				<div className="text-2xl font-semibold text-center">Filter Strategy Report</div>

				{/* Reset filters */}

				<button
					onClick={clearAll}
					className={`px-4 py-2 rounded-2xl flex items-center justify-center text-sm border whitespace-nowrap gap-2 ${
						activeFilters.length === 0
							? "bg-black/5 border-black/10 text-black/50"
							: "bg-red-100 border-red-400 text-red-500 cursor-pointer"
					}`}
					disabled={activeFilters.length === 0}
				>
					<RefreshCw size={12} />
					Reset All Filters
				</button>

				<div className="flex flex-col gap-5">
					{/* OB Parameters */}
					<TitleHeading titleProp="OB Parameters" />
					<InputContainer labelProp="Impulse Threshold">
						<div className="flex flex-col gap-2">
							<div className="flex gap-2 items-center">
								<div className="whitespace-nowrap text-sm text-black/60">Min Impulse :</div>
								<input
									className={`p-2 w-full rounded   ${
										obStrategyConfig.impulse_threshold.min === DEFAULTS.impulse_threshold
											? "opacity-50 border-2 border-black/5"
											: "shadow border-2"
									}`}
									type="number"
									step={0.5}
									value={obStrategyConfig.impulse_threshold.min}
									onChange={(e) =>
										setObStrategyConfig((prev) => ({
											...prev,
											impulse_threshold: { min: parseFloat(e.target.value), max: prev.impulse_threshold.max },
										}))
									}
								/>
								{obStrategyConfig.impulse_threshold.min !== DEFAULTS.impulse_threshold && (
									<button
										onClick={() => removeFilter("min_impulse")}
										className="bg-blue-50 text-blue-500 border border-blue-400 rounded-full aspect-square w-6 h-6 flex items-center justify-center"
									>
										<RefreshCw size={16} />
									</button>
								)}
							</div>
							<div className="flex gap-2 items-center">
								<div className="whitespace-nowrap text-sm text-black/60">Max Impulse :</div>
								<input
									className={`p-2 w-full rounded   ${
										obStrategyConfig.impulse_threshold.max === DEFAULTS.impulse_threshold
											? "opacity-50 border-2 border-black/5"
											: "shadow border-2"
									}`}
									type="number"
									step={0.5}
									value={obStrategyConfig.impulse_threshold.max}
									onChange={(e) =>
										setObStrategyConfig((prev) => ({
											...prev,
											impulse_threshold: { min: prev.impulse_threshold.min, max: parseFloat(e.target.value) },
										}))
									}
								/>
								{obStrategyConfig.impulse_threshold.max !== DEFAULTS.impulse_threshold && (
									<button
										onClick={() => removeFilter("max_impulse")}
										className="bg-blue-50 text-blue-500 border border-blue-400 rounded-full aspect-square w-6 h-6 flex items-center justify-center"
									>
										<RefreshCw size={16} />
									</button>
								)}
							</div>
						</div>
					</InputContainer>
					<InputContainer labelProp="Order Block Type">
						<div className="flex gap-2 items-center">
							<select
								value={obStrategyConfig.ob_type}
								onChange={(e) => setObStrategyConfig((prev) => ({ ...prev, ob_type: e.target.value }))}
								className={`p-2 w-full rounded   ${
									obStrategyConfig.ob_type === DEFAULTS.ob_type ? "opacity-50 border-2 border-black/5" : "shadow border-2"
								}`}
							>
								{AvailableOBTypes.map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</select>
							{obStrategyConfig.ob_type !== DEFAULTS.ob_type && (
								<button
									onClick={() => removeFilter("ob_type")}
									className="bg-blue-50 text-blue-500 border border-blue-400 rounded-full aspect-square w-6 h-6 flex items-center justify-center"
								>
									<RefreshCw size={16} />
								</button>
							)}
						</div>
					</InputContainer>

					{/* Trade Parameters */}
					<TitleHeading titleProp="Features" />
					<InputContainer labelProp="Mitigation ( in % )">
						<div className="flex flex-col gap-2">
							<div className="flex gap-2 items-center">
								<div className="whitespace-nowrap text-sm text-black/60">Min Mitigation :</div>
								<input
									className={`p-2 w-full rounded   ${
										numericalfeatures.mitigation_prct.min === DEFAULTS.impulse_threshold
											? "opacity-50 border-2 border-black/5"
											: "shadow border-2"
									}`}
									type="number"
									step={0.5}
									value={numericalfeatures.mitigation_prct.min}
									onChange={(e) =>
										setNumericalFeatures((prev) => ({
											...prev,
											mitigation_prct: { min: parseFloat(e.target.value), max: prev.mitigation_prct.max },
										}))
									}
								/>
								{numericalfeatures.mitigation_prct.min !== DEFAULTS.mitigation_prct && (
									<button
										onClick={() => removeFilter("min_mitigation")}
										className="bg-blue-50 text-blue-500 border border-blue-400 rounded-full aspect-square w-6 h-6 flex items-center justify-center"
									>
										<RefreshCw size={16} />
									</button>
								)}
							</div>
							<div className="flex gap-2 items-center">
								<div className="whitespace-nowrap text-sm text-black/60">Max Mitigation :</div>
								<input
									className={`p-2 w-full rounded   ${
										numericalfeatures.mitigation_prct.max === DEFAULTS.mitigation_prct
											? "opacity-50 border-2 border-black/5"
											: "shadow border-2"
									}`}
									type="number"
									step={0.5}
									value={numericalfeatures.mitigation_prct.max}
									onChange={(e) =>
										setNumericalFeatures((prev) => ({
											...prev,
											mitigation_prct: { min: prev.mitigation_prct.min, max: parseFloat(e.target.value) },
										}))
									}
								/>
								{numericalfeatures.mitigation_prct.max !== DEFAULTS.impulse_threshold && (
									<button
										onClick={() => removeFilter("max_mitigation")}
										className="bg-blue-50 text-blue-500 border border-blue-400 rounded-full aspect-square w-6 h-6 flex items-center justify-center"
									>
										<RefreshCw size={16} />
									</button>
								)}
							</div>
						</div>
					</InputContainer>
					<InputContainer labelProp="Volume Spike">
						<div className="flex flex-col gap-2">
							<div className="flex gap-2 items-center">
								<div className="whitespace-nowrap text-sm text-black/60">Min Spike :</div>
								<input
									className={`p-2 w-full rounded   ${
										numericalfeatures.volume_spike.min === DEFAULTS.volume_spike
											? "opacity-50 border-2 border-black/5"
											: "shadow border-2"
									}`}
									type="number"
									step={0.5}
									value={numericalfeatures.volume_spike.min}
									onChange={(e) =>
										setNumericalFeatures((prev) => ({
											...prev,
											volume_spike: { min: parseFloat(e.target.value), max: prev.mitigation_prct.max },
										}))
									}
								/>
								{numericalfeatures.volume_spike.min !== DEFAULTS.volume_spike && (
									<button
										onClick={() => removeFilter("min_volume_spike")}
										className="bg-blue-50 text-blue-500 border border-blue-400 rounded-full aspect-square w-6 h-6 flex items-center justify-center"
									>
										<RefreshCw size={16} />
									</button>
								)}
							</div>
							<div className="flex gap-2 items-center">
								<div className="whitespace-nowrap text-sm text-black/60">Max Spike :</div>
								<input
									className={`p-2 w-full rounded   ${
										numericalfeatures.volume_spike.max === DEFAULTS.volume_spike
											? "opacity-50 border-2 border-black/5"
											: "shadow border-2"
									}`}
									type="number"
									step={0.5}
									value={numericalfeatures.volume_spike.max}
									onChange={(e) =>
										setNumericalFeatures((prev) => ({
											...prev,
											volume_spike: { min: prev.volume_spike.min, max: parseFloat(e.target.value) },
										}))
									}
								/>
								{numericalfeatures.volume_spike.max !== DEFAULTS.volume_spike && (
									<button
										onClick={() => removeFilter("max_volume_spike")}
										className="bg-blue-50 text-blue-500 border border-blue-400 rounded-full aspect-square w-6 h-6 flex items-center justify-center"
									>
										<RefreshCw size={16} />
									</button>
								)}
							</div>
						</div>
					</InputContainer>
					<InputContainer labelProp="Displacement Strength">
						<div className="flex flex-col gap-2">
							<div className="flex gap-2 items-center">
								<div className="whitespace-nowrap text-sm text-black/60">Min Value :</div>
								<input
									className={`p-2 w-full rounded   ${
										numericalfeatures.displacement_strength.min === DEFAULTS.displacement_strength
											? "opacity-50 border-2 border-black/5"
											: "shadow border-2"
									}`}
									type="number"
									step={0.5}
									value={numericalfeatures.displacement_strength.min}
									onChange={(e) =>
										setNumericalFeatures((prev) => ({
											...prev,
											displacement_strength: { min: parseFloat(e.target.value), max: prev.displacement_strength.max },
										}))
									}
								/>
								{numericalfeatures.displacement_strength.min !== DEFAULTS.displacement_strength && (
									<button
										onClick={() => removeFilter("min_displacement")}
										className="bg-blue-50 text-blue-500 border border-blue-400 rounded-full aspect-square w-6 h-6 flex items-center justify-center"
									>
										<RefreshCw size={16} />
									</button>
								)}
							</div>
							<div className="flex gap-2 items-center">
								<div className="whitespace-nowrap text-sm text-black/60">Max Value :</div>
								<input
									className={`p-2 w-full rounded   ${
										numericalfeatures.displacement_strength.max === DEFAULTS.displacement_strength
											? "opacity-50 border-2 border-black/5"
											: "shadow border-2"
									}`}
									type="number"
									step={0.5}
									value={numericalfeatures.displacement_strength.max}
									onChange={(e) =>
										setNumericalFeatures((prev) => ({
											...prev,
											displacement_strength: { min: prev.displacement_strength.min, max: parseFloat(e.target.value) },
										}))
									}
								/>
								{numericalfeatures.displacement_strength.max !== DEFAULTS.impulse_threshold && (
									<button
										onClick={() => removeFilter("max_displacement")}
										className="bg-blue-50 text-blue-500 border border-blue-400 rounded-full aspect-square w-6 h-6 flex items-center justify-center"
									>
										<RefreshCw size={16} />
									</button>
								)}
							</div>
						</div>
					</InputContainer>
					<InputContainer labelProp="OB Wick Ratio ( in % )">
						<div className="flex flex-col gap-2">
							<div className="flex gap-2 items-center">
								<div className="whitespace-nowrap text-sm text-black/60">Min Value :</div>
								<input
									className={`p-2 w-full rounded   ${
										numericalfeatures.orderblock_wick_ratio.min === DEFAULTS.orderblock_wick_ratio
											? "opacity-50 border-2 border-black/5"
											: "shadow border-2"
									}`}
									type="number"
									step={0.5}
									value={numericalfeatures.orderblock_wick_ratio.min}
									onChange={(e) =>
										setNumericalFeatures((prev) => ({
											...prev,
											orderblock_wick_ratio: { min: parseFloat(e.target.value), max: prev.orderblock_wick_ratio.max },
										}))
									}
								/>
								{numericalfeatures.orderblock_wick_ratio.min !== DEFAULTS.orderblock_wick_ratio && (
									<button
										onClick={() => removeFilter("min_ob_wick_ratio")}
										className="bg-blue-50 text-blue-500 border border-blue-400 rounded-full aspect-square w-6 h-6 flex items-center justify-center"
									>
										<RefreshCw size={16} />
									</button>
								)}
							</div>
							<div className="flex gap-2 items-center">
								<div className="whitespace-nowrap text-sm text-black/60">Max Value :</div>
								<input
									className={`p-2 w-full rounded   ${
										numericalfeatures.orderblock_wick_ratio.max === DEFAULTS.orderblock_wick_ratio
											? "opacity-50 border-2 border-black/5"
											: "shadow border-2"
									}`}
									type="number"
									step={0.5}
									value={numericalfeatures.orderblock_wick_ratio.max}
									onChange={(e) =>
										setNumericalFeatures((prev) => ({
											...prev,
											orderblock_wick_ratio: { min: prev.orderblock_wick_ratio.min, max: parseFloat(e.target.value) },
										}))
									}
								/>
								{numericalfeatures.orderblock_wick_ratio.max !== DEFAULTS.orderblock_wick_ratio && (
									<button
										onClick={() => removeFilter("max_ob_wick_ratio")}
										className="bg-blue-50 text-blue-500 border border-blue-400 rounded-full aspect-square w-6 h-6 flex items-center justify-center"
									>
										<RefreshCw size={16} />
									</button>
								)}
							</div>
						</div>
					</InputContainer>
					<InputContainer labelProp="BoS Detected">
						<div className="flex gap-2 items-center">
							<select
								value={categoricalFeatures.bos_detected}
								onChange={(e) => setCategoricalFeatures((prev) => ({ ...prev, bos_detected: e.target.value }))}
								className={`p-2 w-full rounded   ${
									categoricalFeatures.bos_detected === DEFAULTS.bos_detected
										? "opacity-50 border-2 border-black/5"
										: "shadow border-2"
								}`}
							>
								{AvailableBoSValues.map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</select>
							{categoricalFeatures.bos_detected !== DEFAULTS.bos_detected && (
								<button
									onClick={() => removeFilter("bos_detected")}
									className="bg-blue-50 text-blue-500 border border-blue-400 rounded-full aspect-square w-6 h-6 flex items-center justify-center"
								>
									<RefreshCw size={16} />
								</button>
							)}
						</div>
					</InputContainer>
					<InputContainer labelProp="Trend">
						<div className="flex gap-2 items-center">
							<select
								value={categoricalFeatures.trend_direction_swings}
								onChange={(e) =>
									setCategoricalFeatures((prev) => ({
										...prev,
										trend_direction_swings: e.target.value,
									}))
								}
								className={`p-2 w-full rounded   ${
									categoricalFeatures.trend_direction_swings === DEFAULTS.trend_direction_swings
										? "opacity-50 border-2 border-black/5"
										: "shadow border-2"
								}`}
							>
								{AvailableTrends.map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</select>
							{categoricalFeatures.trend_direction_swings !== DEFAULTS.trend_direction_swings && (
								<button
									onClick={() => removeFilter("trend_direction_swings")}
									className="bg-blue-50 text-blue-500 border border-blue-400 rounded-full aspect-square w-6 h-6 flex items-center justify-center"
								>
									<RefreshCw size={16} />
								</button>
							)}
						</div>
					</InputContainer>
					<InputContainer labelProp="Outcome">
						<div className="flex gap-2 items-center">
							<select
								value={categoricalFeatures.outcome}
								onChange={(e) => setCategoricalFeatures((prev) => ({ ...prev, outcome: e.target.value }))}
								className={`p-2 w-full rounded   ${
									categoricalFeatures.outcome === DEFAULTS.outcome ? "opacity-50 border-2 border-black/5" : "shadow border-2"
								}`}
							>
								{AvailableOutcomes.map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</select>
							{categoricalFeatures.outcome !== DEFAULTS.outcome && (
								<button
									onClick={() => removeFilter("outcome")}
									className="bg-blue-50 text-blue-500 border border-blue-400 rounded-full aspect-square w-6 h-6 flex items-center justify-center"
								>
									<RefreshCw size={16} />
								</button>
							)}
						</div>
					</InputContainer>

					<div className="flex items-center gap-2">
						<button
							onClick={handleSubmit}
							disabled={isLoadingProp}
							className="hover:opacity-50 w-full font-semibold flex items-center gap-2 justify-center text-white bg-blue-500 rounded-2xl py-2 px-4 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
						>
							Filter Trades
							{appliedCount > 0 && (
								<span className="ml-1 text-blue-500 bg-white rounded-full text-xs px-2 py-0.5">{appliedCount}</span>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilterFeaturesInput;
