import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const WS_COMET_URL = "ws://localhost:5000";
const WS_ORBIT_URL = "ws://localhost:5001";

function App() {
	const [count, setCount] = useState(0);
	const [messageComet, setOrbitMessage] = useState("");
	const [messageOrbit, setCometMessage] = useState("");
	const [socket, setSocket] = useState<{
		wsComet: WebSocket;
		wsOrbit: WebSocket;
	}>();

	useEffect(() => {
		const wsComet = new WebSocket(WS_COMET_URL);
		const wsOrbit = new WebSocket(WS_ORBIT_URL);
		setSocket({ wsComet, wsOrbit });

		wsComet.onopen = () => console.log("WebSocket connected");
		wsComet.onclose = () => console.log("WebSocket disconnected");
		wsComet.onmessage = (event) => {
			setOrbitMessage(event.data);
		};

		wsOrbit.onopen = () => console.log("WebSocket connected");
		wsOrbit.onclose = () => console.log("WebSocket disconnected");
		wsOrbit.onmessage = (event) => {
			setCometMessage(event.data);
		};

		return () => {
			wsComet.close();
			wsOrbit.close();
		};
	}, []);

	const sendMessageComet = () => {
		if (socket?.wsComet) {
			socket.wsComet.send("Hello from React!");
		}
	};

	const sendMessageOrbit = () => {
		if (socket?.wsOrbit) {
			socket.wsOrbit.send("Hello from React!");
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
			<h1>Vite + React</h1>
			<div className="card">
				<p>
					<p>Received message from server-comet: {messageComet}</p>
					<button onClick={sendMessageComet}>
						Send Message to server-comet
					</button>
				</p>
				<p>
					<p>Received message from server-orbit: {messageOrbit}</p>
					<button onClick={sendMessageOrbit}>
						Send Message to server-orbit
					</button>
				</p>
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
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

export default App;
