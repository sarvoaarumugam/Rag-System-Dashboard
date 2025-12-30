import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import tradingAgent from "../../assets/images/icon.png";
import { useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../../context/WebSocketContext";
import OptionsButton from "./OptionsButton";

const Header = () => {
	const { client } = useWebSocketContext();
	const [connectionStatus, setConnectionStatus] = useState<boolean>(false);

	useEffect(() => {
		if (client) {
			setConnectionStatus(client?.isConnected());
		}
	}, []);

	const navigate = useNavigate();

	return (
		<div className="sticky top-0 z-50 bg-white shadow-md">
			<div className="bg-white flex justify-center">
				<div className="max-w-[1440px] w-full bg-white flex flex-col gap-6">
					<div className="flex items-center justify-between p-4">
						{/* ✅ Left Section: Trading Agent Info */}
						<button className="flex items-center gap-3 py-2 " onClick={() => navigate("/")}>
							{/* 🟢 Trading Agent Avatar */}
							<img src={tradingAgent} alt="Trading Agent" className="w-10 h-10 rounded-full border border-black" />

							{/* 🟢 Trading Agent Name */}
							<h2 className="text-lg font-semibold">Trading Agent</h2>

							{/* 🟢 Connection Status Indicator */}
							<div className="flex items-center gap-1 px-2">
								<div
									className={`flex items-center justify-center w-6 h-6 rounded-full ${
										connectionStatus ? "bg-green-500" : "bg-red-500"
									}`}
								>
									{connectionStatus ? (
										<Play size={14} className="text-white fill-white" />
									) : (
										<X size={14} className="text-white" />
									)}
								</div>

								{/* 🟢 Status Text */}
								<div
									className={`flex items-center gap-1 px-3 py-1 text-sm rounded-full font-semibold ${
										connectionStatus ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
									}`}
								>
									{connectionStatus ? "Active" : "Disconnected"}
								</div>
							</div>
						</button>
						<OptionsButton />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;
