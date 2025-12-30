import TotalPnL from "./TotalPnL";
import TradeResultBreakdown from "./TradeResultBreakdown";

const MetricsSection = () => {
	return (
		<div className="flex items-center h-[320px] gap-5">
			<TotalPnL />
			<TradeResultBreakdown />
		</div>
	);
};

export default MetricsSection;
