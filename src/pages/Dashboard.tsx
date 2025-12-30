import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import { ChartNoAxesGantt, TrendingUpDown } from "lucide-react";

const Strategies = [
	{
		label: "OB Strategy",
		route: "ob-strategy/charts",
		icon: <ChartNoAxesGantt className="text-blue-400 w-full h-full" />,
	},
	{
		label: "In Price Strategy",
		route: "in-price-strategy/charts",
		icon: <TrendingUpDown className="text-blue-400 w-full h-full" />,
	},
];

const Dashboard = () => {
	const navigate = useNavigate();

	return (
		<>
			<Header />
			<div className="flex flex-col gap-2 w-full h-[calc(100vh-88px)]">
				<div className="flex w-full h-full items-center justify-center max-w-[1440px] mx-auto  gap-10">
					{Strategies.map((strategy) => (
						<button
							key={strategy.label}
							onClick={() => navigate(`/${strategy.route}`)}
							className="rounded-xl border w-1/2 max-w-[420px] h-full max-h-[420px] items-center group justify-center bg-blue-50 gap-10 hover:bg-blue-100/75 border-blue-400 flex flex-col"
						>
							<div className="w-32 group-hover:w-36 transition-all ease-in-out duration-300">{strategy.icon}</div>
							<div className="text-2xl font-semibold text-blue-500 group-hover:text-3xl transition-all ease-in-out duration-300">
								{strategy.label}
							</div>
						</button>
					))}
				</div>
			</div>
		</>
	);
};

export default Dashboard;
