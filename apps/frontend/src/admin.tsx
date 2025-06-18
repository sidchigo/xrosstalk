import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const WS_COMET_URL = "ws://localhost:5000/ws";

function Admin() {
	const [enableDarkMode, enableDarkModeSet] = useState(true);
	const [messageComet, setOrbitMessage] = useState("");
	const [socket, setSocket] = useState<{
		wsComet: WebSocket;
	}>();

	useEffect(() => {
		const wsComet = new WebSocket(WS_COMET_URL);
		setSocket({ wsComet });

		wsComet.onopen = () => console.log("WebSocket connected");
		wsComet.onclose = () => console.log("WebSocket disconnected");
		wsComet.onmessage = (event) => {
			setOrbitMessage(event.data);
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
					version: 3,
				},
			};
			socket.wsComet.send(JSON.stringify(darkModePayload));
		}
	};

	return (
		<>
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
			<h1>Admin</h1>
			<div className="card">
				<p>
					<p>Received message from server-comet: {messageComet}</p>
					<button onClick={sendMessageComet}>
						{enableDarkMode ? "Enable" : "Disable"} dark mode for
						users
					</button>
				</p>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default Admin;
