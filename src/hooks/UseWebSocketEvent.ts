import { useEffect, useState } from "react";
import { onEvent } from "../lib/websocket/EventBus";

export function useWebSocketEvent<T = any>(event: string) {
	const [data, setData] = useState<T | null>(null);

	useEffect(() => {
		const off = onEvent(event, setData);
		return () => off();
	}, [event]);

	return data;
}
