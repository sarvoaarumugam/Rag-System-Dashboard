const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

const DEBUG_LOGS = import.meta.env.VITE_DEBUG_LOGS || true;

export { API_BASE_URL, WEBSOCKET_URL, DEBUG_LOGS };
