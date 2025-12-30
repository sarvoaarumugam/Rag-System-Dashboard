const TradeHistoryTableSkeleton = () => {
	return (
		<div>
			<div className="w-full bg-black/5 h-[60px] animate-pulse border border-black/5"></div>

			<div className="flex justify-between">
				{Array.from({ length: 6 }).map((_, index) => (
					<div key={index} className=" h-[calc(100vh-220px)] w-full border bg-black/5 animate-pulse"></div>
				))}
			</div>
		</div>
	);
};

export default TradeHistoryTableSkeleton;
