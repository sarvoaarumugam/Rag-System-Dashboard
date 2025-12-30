import React, { createContext, SetStateAction, useContext, useEffect, useState } from "react";
import { WebSocketClient } from "../lib/websocket/WebSocketClient";
import { DEBUG_LOGS, WEBSOCKET_URL } from "../config";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const WS_URL = `${WEBSOCKET_URL}/ws`;

type WebSocketContextType = {
	client: WebSocketClient | null;
	setHasLoggedIn: React.Dispatch<SetStateAction<boolean>> | null;
};

// Allow WebSocketClient | null to avoid early render issues
const SocketContext = createContext<WebSocketContextType>({ client: null, setHasLoggedIn: null });

export const WebSocketContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [client, setClient] = useState<WebSocketClient | null>(null);
	const [hasLoggedIn, setHasLoggedIn] = useState<boolean>(false);

	const [connecting, setConnecting] = useState<boolean>(false);
	const [errorConnecting, setErrorConnecting] = useState<boolean>(false);
	const [tokenExpired, setTokenExpired] = useState<boolean>(false);

	const navigate = useNavigate();

	useEffect(() => {
		const accessToken = Cookies.get("access_token");

		if (!accessToken && !hasLoggedIn) {
			navigate("/auth/login");
			return;
		}

		if (!accessToken) return;

		if (accessToken || hasLoggedIn) {
			setConnecting(true);

			const ws = new WebSocketClient(`${WS_URL}?token=${accessToken}`, {
				onConnect: () => {
					console.log("✅ WebSocket connected");
					setConnecting(false);
					setErrorConnecting(false);
				},
				onDisconnect: () => {
					console.log("🔌 WebSocket disconnected");
					setConnecting(false);
				},
				onError: (e) => {
					console.error("❌ WebSocket error", e), setConnecting(false);
					setErrorConnecting(true);
				},
				onTokenExpiry: () => {
					console.log("Token Expired");
					setTokenExpired(true);
				},
				debug: DEBUG_LOGS,
			});
			setClient(ws);
			return () => {
				ws.close();
			};
		}
	}, [hasLoggedIn]);

	return (
		<SocketContext.Provider value={{ client, setHasLoggedIn }}>
			{connecting ? (
				<div className="h-screen w-screen bg-black flex items-center justify-center">
					<div className="text-4xl animate-pulse text-white/40 font-semibold">Loading...</div>
				</div>
			) : errorConnecting ? (
				<div className="h-screen w-screen bg-black flex items-center justify-center">
					<div className="text-4xl text-white/40 font-semibold">Error Connecting to the Server</div>
				</div>
			) : tokenExpired ? (
				<div className="h-screen w-screen bg-black flex items-center justify-center">
					<div className="flex flex-col items-center gap-4">
						<div className="text-center text-4xl text-white/40 font-semibold">
							Session expired! <br />
							Login again to continue
						</div>
						<button
							onClick={() => {
								navigate("/auth/login");
								setTokenExpired(false);
							}}
							className="text-white bg-white/20 w-fit rounded-full py-2 px-4"
						>
							Back To Login
						</button>
					</div>
				</div>
			) : (
				<>{children}</>
			)}
		</SocketContext.Provider>
	);
};

// Safe hook: returns client or null, handle null in consumer
export const useWebSocketContext = () => {
	return useContext(SocketContext);
};
