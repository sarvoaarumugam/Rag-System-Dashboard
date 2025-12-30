import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { BreakdownDataType } from "../../types/MetricsType";

interface TradeResultBreakdownChartProps {
	breakdownDataProp: BreakdownDataType;
}

const categoryValues = [
	{ key: "profitable", value: "Profitable" },
	{ key: "non_profitable", value: "Non Profitable" },
];

const categoryColors = {
	profitable: "#22c55e", // green-500
	non_profitable: "#ef4444", // red-500
};

const TradeResultBreakdownChart: React.FC<TradeResultBreakdownChartProps> = ({ breakdownDataProp }) => {
	const [formattedData, setFormattedData] = useState<any[]>([]);

	useEffect(() => {
		if (breakdownDataProp) {
			setFormattedData(getFormattedBreakdown());
		}
	}, [breakdownDataProp]);

	const getFormattedBreakdown = () => {
		return Object.entries(breakdownDataProp).map(([key, value]) => {
			const category = categoryValues.find((cat) => cat.key === key);
			return {
				name: category ? category.value : key,
				value: value,
				itemStyle: {
					color: categoryColors[key as keyof typeof categoryColors],
				},
			};
		});
	};

	const option = {
		legend: {
			show: false,
		},
		tooltip: {
			trigger: "item",
			formatter: "{b} : {c} ({d}%)",
		},
		series: [
			{
				type: "pie",
				radius: ["30%", "65%"],
				center: ["50%", "50%"],
				selectedMode: "single",
				data: formattedData,
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: "rgba(0, 0, 0, 0.5)",
					},
				},
			},
		],
	};

	return (
		<div className="h-full w-full">
			<ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
		</div>
	);
};

export default TradeResultBreakdownChart;
