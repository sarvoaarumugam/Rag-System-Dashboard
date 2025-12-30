import React, { useState } from "react";
import loginAvatar from "../assets/images/login-avatar.png";
import { useNavigate } from "react-router-dom";
import { useWebSocketContext } from "../context/WebSocketContext";
import { handleLogin } from "../api/LoginAPI";
import Cookies from "js-cookie";

const Login: React.FC = () => {
	const navigate = useNavigate();

	const { setHasLoggedIn } = useWebSocketContext();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await handleLogin(email, password);

			if (setHasLoggedIn && response?.access_token && response?.user_name) {
				Cookies.set("access_token", response?.access_token, {
					expires: 7, // days until expiry
				});
				Cookies.set("user_name", response?.user_name, {
					expires: 7, // days until expiry
				});
				Cookies.set("email", email, {
					expires: 7, // days until expiry
				});

				setHasLoggedIn(true);
				navigate("/");
			}
		} catch (err: any) {
			setError(err?.message ?? "Login error");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="bg-white p-6 rounded-2xl shadow-xl w-96 flex flex-col items-center">
				<h2 className="text-3xl font-semibold mb-5 text-gray-800">Login</h2>

				{/* Avatar */}
				<img src={loginAvatar} alt="Login Avatar" className="w-36 h-36 mb-4 object-contain" />

				{/* Form */}
				<form onSubmit={handleSubmit} className="w-full flex flex-col space-y-4">
					<input
						type="email"
						placeholder="Email id"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
						required
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
						required
					/>
					<button
						type="submit"
						className="bg-[#4F93F5] text-white py-2 rounded-lg w-full hover:bg-blue-600 transition shadow-md"
						disabled={isLoading}
					>
						{isLoading ? "Logging in..." : "Submit"}
					</button>
					{error && <p className="text-red-500 text-sm">{error}</p>}
				</form>
			</div>
		</div>
	);
};

export default Login;
