import { Ban, Check, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useWebSocketEvent } from "../hooks/UseWebSocketEvent";

type NotificationContextType = {
	addNotifications: (notification: Omit<NotificationType, "id">) => void;
};

type NotificationType = {
	id: string;
	type: NotificationTypes;
	message: string;
};

export type NotificationTypes = "error" | "success";

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationContextProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [notifications, setNotifications] = useState<NotificationType[]>([]);

	const errorMessage = useWebSocketEvent("error");

	useEffect(() => {
		if (errorMessage && errorMessage?.message) {
			addNotifications({ type: "error", message: `Error Occurred : ${errorMessage?.message}` });
		}
	}, [errorMessage]);

	const addNotifications = useCallback((notification: Omit<NotificationType, "id">) => {
		const id = crypto.randomUUID();
		const newNotification = { ...notification, id };

		setNotifications((prev) => [...prev, newNotification]);

		if (notification.type === "success") {
			setTimeout(() => {
				setNotifications((prev) => prev.filter((item) => item.id !== id));
			}, 3000);
		}
	}, []);

	const deleteNotification = (id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	return (
		<NotificationContext.Provider value={{ addNotifications }}>
			{children}
			<div className="pointer-events-none fixed inset-0 z-50 flex justify-center pt-3">
				<div className="flex flex-col items-center gap-4">
					{notifications &&
						notifications.map((notification, index) => (
							<div
								key={index}
								className="flex h-fit w-fit items-center gap-2 rounded-2xl  bg-white p-3 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25),0px_0px_8px_0px_rgba(0,0,0,0.2)]"
							>
								{notification.type === "error" ? (
									<Ban className="text-red-500" size={28} />
								) : (
									<Check className="text-green-500" size={28} />
								)}
								<div className="text-sm font-bold max-w-[1080px]">{notification.message}</div>
								{notification.type === "error" && (
									<button
										className="pointer-events-auto w-5 h-5  bg-black/5 rounded-full hover:opacity-50 cursor-pointer flex items-center justify-center border border-black/15"
										onClick={() => deleteNotification(notification.id)}
									>
										<X size={16} />
									</button>
								)}
							</div>
						))}
				</div>
			</div>
		</NotificationContext.Provider>
	);
};

export const useNotificationContext = () => {
	const context = useContext(NotificationContext);

	if (!context) {
		throw new Error("useNotificationContext should be used inside NotificationContextProvider");
	}

	return context;
};
