// api/auth.ts
import axios from "axios";
import { API_BASE_URL } from "../config";

export type LoginResponse = {
	access_token: string;
	user_name: string;
	token_type?: string;
};

export const handleLogin = async (email: string, password: string): Promise<LoginResponse> => {
	const formData = new URLSearchParams();
	formData.append("email", email);
	formData.append("password", password);

	try {
		const { data } = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, formData, {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});
		return data;
	} catch (err) {
		if (axios.isAxiosError(err)) {
			// Bubble up a proper Error so caller's catch triggers
			const msg = (err.response?.data as any)?.detail ?? "Login failed";
			throw new Error(msg);
		}
		throw new Error("An unexpected error occurred");
	}
};
