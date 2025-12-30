import { handleMessage } from "./MessageRouter";

const RECONNECT_INTERVAL_MS = 5000;

type WebSocketClientOptions = {
	onConnect?: () => void;
	onDisconnect?: () => void;
	onError?: (e: Event) => void;
	onTokenExpiry?: () => void;
	debug?: boolean;
	autoConnect?: boolean; // optional: default true
};

export class WebSocketClient {
	private url: string;
	private socket: WebSocket | null = null;
	private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
	private isConnecting = false;
	private shouldReconnect = true; // NEW

	public connected = false;

	private readonly onConnect?: () => void;
	private readonly onDisconnect?: () => void;
	private readonly onError?: (e: Event) => void;
	private readonly onTokenExpiry?: () => void;
	private readonly debug: boolean;

	constructor(url: string, options: WebSocketClientOptions = {}) {
		this.url = url;
		this.onConnect = options.onConnect;
		this.onDisconnect = options.onDisconnect;
		this.onError = options.onError;
		this.onTokenExpiry = options.onTokenExpiry;
		this.debug = options.debug ?? false;

		if (options.autoConnect ?? true) {
			this.connect();
		}
	}

	private connect() {
		// Guard: existing socket states
		if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
			this.debug && console.warn("⏳ Existing socket OPEN/CONNECTING, skipping connect()");
			return;
		}
		if (this.isConnecting || this.connected) {
			this.debug && console.warn("⏳ Already connecting/connected, skipping connect()");
			return;
		}

		this.isConnecting = true;
		this.shouldReconnect = true; // reconnect allowed for normal closes
		this.socket = new WebSocket(this.url);

		this.socket.onopen = () => {
			this.isConnecting = false; // FIX
			this.connected = true;
			this.debug && console.log("✅ WebSocket connected");
			this.onConnect?.();
		};

		this.socket.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data);

				// FIX: use message.type, not event.type; avoid double-parse
				if (message?.type !== "chat" && message?.data?.status !== "streaming") {
					this.debug && console.log("📩 Received Message:\n" + JSON.stringify(message, null, 2));
				}

				handleMessage(message);
			} catch (error) {
				console.error("❌ Failed to parse WebSocket message:", event.data);
			}
		};

		this.socket.onerror = (event) => {
			console.error("❌ WebSocket error:", event);
			this.isConnecting = false;
			this.onError?.(event);
		};

		this.socket.onclose = (ev) => {
			this.connected = false;
			this.isConnecting = false;
			this.debug && console.warn(`🔌 WebSocket closed: code=${ev.code} reason="${ev.reason || ""}"`);

			// Don’t reconnect if we intentionally closed
			if (!this.shouldReconnect) {
				this.debug && console.log("🛑 Reconnect suppressed (manual close).");
				this.onDisconnect?.();
				return;
			}

			// Token/policy (1008): surface to caller; don't reconnect automatically
			if (ev.code === 1008) {
				this.onTokenExpiry?.();
				return;
			}

			this.onDisconnect?.();
			this.scheduleReconnect();
		};
	}

	private scheduleReconnect() {
		if (this.reconnectTimer || !this.shouldReconnect) return;
		this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = null;
			this.connect();
		}, RECONNECT_INTERVAL_MS);
	}

	public reconnectNow() {
		// explicit manual reconnect (e.g., token refreshed)
		this.shouldReconnect = true;
		this.clearTimer();
		this.socket?.close(1000, "reconnect");
	}

	public send(payload: object) {
		if (this.socket?.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify(payload));
			this.debug && console.log("📤 Sent:", payload);
		} else {
			console.warn("⚠️ WebSocket not open. Message not sent:", payload);
		}
	}

	public isConnected() {
		return this.connected;
	}

	public close() {
		// Mark as user-initiated so onclose won’t reconnect
		this.shouldReconnect = false; // NEW
		this.clearTimer();
		if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
			this.socket.close(1000, "client closing");
		}
		this.debug && console.log("❎ WebSocket closed (manual)");
	}

	private clearTimer() {
		if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
		this.reconnectTimer = null;
	}
}
