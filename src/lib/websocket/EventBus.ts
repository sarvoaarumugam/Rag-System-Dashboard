type Callback<T = any> = (data: T) => void;

/*
 Listeners is an object which keeps track of all the event types and their callbacks

listeners = {
//  "wallet_balance": [setData1, setData2],
//  "trade_history": [setData3],
}
*/
const listeners: { [event: string]: Callback[] } = {};

// Triggers all the events of that particular event type with the data provided
export function emitEvent<T = any>(event: string, data: T) {
	if (listeners[event]) {
		listeners[event].forEach((callback) => callback(data));
	}
}

// Subscribes to the event
export function onEvent<T = any>(event: string, cb: Callback<T>) {
	if (!listeners[event]) {
		listeners[event] = [];
	}

	// pushes the callback to the callbacks list for that particular event type
	listeners[event].push(cb);

	return () => {
		listeners[event] = listeners[event].filter((fn) => fn !== cb);
	};
}
