import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const WS_COMET_URL = "ws://localhost:5000/ws";

function Admin() {
	const [enableDarkMode, enableDarkModeSet] = useState(true);
	const [messageOrbit, messageOrbitSet] = useState("");
	const [socket, setSocket] = useState<{
		wsComet: WebSocket;
	}>();
	const [onlineUsers, onlineUsersSet] = useState<Map<string, number>>(
		new Map()
	);

	useEffect(() => {
		const wsComet = new WebSocket(WS_COMET_URL);
		setSocket({ wsComet });

		wsComet.onopen = () => console.log("WebSocket connected");
		wsComet.onclose = () => console.log("WebSocket disconnected");
		wsComet.onmessage = (event) => {
			// messageOrbitSet(event.data);
			const content = JSON.parse(JSON.parse(event.data).content);
			const { type, payload } = content;
			const { status, user_id, timestamp } = payload;
			if (type === "presence_update") {
				if (status === "online") {
					onlineUsersSet((users) => {
						const newUsers = new Map(users);
						newUsers.set(user_id, timestamp);
						return newUsers;
					});
				} else {
					onlineUsersSet((users) => {
						const newUsers = new Map(users);
						newUsers.delete(user_id);
						return newUsers;
					});
				}
			}
		};

		return () => {
			wsComet.close();
		};
	}, []);

	const sendMessageComet = () => {
		enableDarkModeSet((mode) => !mode);
		if (socket?.wsComet) {
			const darkModePayload = {
				type: "feature_flag_update",
				payload: {
					key: "enableDarkMode",
					enabled: enableDarkMode,
				},
			};
			socket.wsComet.send(JSON.stringify(darkModePayload));
		}
	};

	return (
		<>
			<h1>Admin</h1>
			<div>
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img
						src={reactLogo}
						className="logo react"
						alt="React logo"
					/>
				</a>
			</div>
			<div>
				{Array.from(onlineUsers.entries()).map(
					([userId, timestamp]) => (
						<li key={userId}>
							{userId} -{" "}
							{new Date(timestamp).toLocaleString("en", {
								dateStyle: "medium",
								timeStyle: "short",
							})}
						</li>
					)
				)}
			</div>
			<div className="card">
				<p>
					<p>Received message from server-comet: {messageOrbit}</p>
					<button onClick={sendMessageComet}>
						{enableDarkMode ? "Enable" : "Disable"} dark mode for
						users
					</button>
				</p>
			</div>
		</>
	);
}

export default Admin;
