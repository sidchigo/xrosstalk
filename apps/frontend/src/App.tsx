import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const WS_ORBIT_URL = "ws://localhost:5001/ws";

type Flags = {
	enableDarkMode?: boolean;
};

function App() {
	const [isDarkMode, isDarkModeSet] = useState(false);
	const [messageOrbit, setOrbitMessage] = useState("");
	const [flags, setFlags] = useState<Flags>({});
	const [socket, setSocket] = useState<{
		wsOrbit: WebSocket;
	}>();

	useEffect(() => {
		const wsOrbit = new WebSocket(WS_ORBIT_URL);
		setSocket({ wsOrbit });

		wsOrbit.onopen = () => wsOrbit.send("WebSocket connected");
		wsOrbit.onclose = () => console.log("WebSocket disconnected");
		wsOrbit.onmessage = (event) => {
			const content = JSON.parse(JSON.parse(event.data).content);
			const { type, payload } = content;
			console.log(type, payload);
			if (type === "feature_flag_update") {
				setFlags((prev) => ({
					...prev,
					[payload.key]: payload.enabled,
				}));
				setOrbitMessage(
					`${payload.key} is ${
						payload.enabled ? "enabled" : "disabled"
					}`
				);
			}
		};

		return () => {
			wsOrbit.close();
		};
	}, []);

	useEffect(() => {
		document.documentElement.classList.toggle("dark-theme", !isDarkMode);
	}, [isDarkMode]);

	const sendMessageOrbit = () => {
		if (socket?.wsOrbit) {
			socket.wsOrbit.send("Hello from React!");
		}
	};

	return (
		<div>
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
			<h1>Client</h1>
			<div className="card">
				<p>
					<p>Received message from server-orbit: {messageOrbit}</p>
					<button onClick={sendMessageOrbit}>
						Send Message to server-orbit
					</button>
				</p>
				{flags.enableDarkMode && (
					<button onClick={() => isDarkModeSet((mode) => !mode)}>
						Dark mode
					</button>
				)}
			</div>
		</div>
	);
}

export default App;
