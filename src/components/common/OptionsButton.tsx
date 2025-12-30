import { CircleUser, History, MessageSquare, Settings2, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useWebSocketContext } from "../../context/WebSocketContext";

const pageLinks = [
	{ label: "Chat", icon: <MessageSquare size={18} />, link: "/chat" },
	{ label: "Trade History", icon: <History size={18} />, link: "/trade-history" },
	{ label: "Strategy Agent", icon: <CircleUser size={18} />, link: "/strategy-agent" },
	{ label: "Strategy Tester", icon: <ShieldCheck size={18} />, link: "/strategy-tester" },
];

const OptionsButton = () => {
	const [panelVisibility, setPanelVisibility] = useState<boolean>(false);
	const { client, setHasLoggedIn } = useWebSocketContext();
	const containerRef = useRef<HTMLDivElement | null>(null);

	const navigate = useNavigate();

	const email = Cookies.get("email");
	const userName = Cookies.get("user_name");

	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setPanelVisibility(false);
			}
		};
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);

	const handleLogOut = () => {
		Cookies.remove("access_token");
		Cookies.remove("user_name");
		Cookies.remove("email");

		client?.close();
		if (setHasLoggedIn) {
			setHasLoggedIn(false);
		}
		navigate("/auth/login");
	};

	return (
		<div className="relative" ref={containerRef}>
			<button
				onClick={() => setPanelVisibility((prev) => !prev)}
				className="rounded-full w-10 h-10 border bg-gray-100 border-gray-300 flex items-center justify-center text-gray-400 hover:opacity-50"
			>
				<Settings2 />
			</button>
			{/* Panel */}
			{panelVisibility && (
				<div className="z-50 absolute rounded-lg w-fit p-4 bg-white border shadow-lg right-0 mt-2">
					<div className="flex flex-col gap-4">
						{/* Account Info */}
						<div className="flex py-4 justify-center flex-col text-center border border-dashed rounded-lg px-2">
							<div className="font-semibold">Hi! {userName}</div>
							<div className="text-sm text-black/50">{email}</div>
						</div>
						<div className="flex flex-col gap-1">
							{pageLinks.map((pageLink, index) => (
								<div key={index}>
									<button
										className="flex gap-2 items-center text-black/50 w-full hover:text-blue-500 hover:bg-blue-50 p-2 rounded-lg"
										onClick={() => navigate(pageLink.link)}
									>
										{pageLink.icon}
										<div className="whitespace-nowrap">{pageLink.label}</div>
									</button>
									{index !== pageLinks.length - 1 && <hr />}
								</div>
							))}
						</div>
						<button onClick={handleLogOut} className="bg-red-100 py-2 text-red-400 rounded-lg hover:opacity-50">
							Logout
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default OptionsButton;
