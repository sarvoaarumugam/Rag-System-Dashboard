import { JSX, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
	children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const navigate = useNavigate();
	const accessToken = Cookies.get("access_token");

	useEffect(() => {
		if (!accessToken) {
			navigate("/auth/login"); // Redirect to Login if not authenticated
		}
	}, [accessToken, navigate]);

	if (!accessToken) {
		return null;
	}

	return children;
};

export default ProtectedRoute;
