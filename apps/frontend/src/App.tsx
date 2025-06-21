import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useParams } from "react-router";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";

const WS_ORBIT_URL = "ws://localhost:5001/ws";

type Flags = {
	enableDarkMode?: boolean;
};

function App() {
	const [messageOrbit, orbitMessageSet] = useState("");
	const [flags, flagsSet] = useState<Flags>({});
	const { user } = useParams();
	const [socket, socketSet] = useState<{
		wsOrbit: WebSocket;
	}>();

	useEffect(() => {
		const wsOrbit = new WebSocket(`${WS_ORBIT_URL}/${user}`);
		socketSet({ wsOrbit });

		wsOrbit.onopen = () => wsOrbit.send("WebSocket connected");
		wsOrbit.onclose = () => console.log("WebSocket disconnected");
		wsOrbit.onmessage = (event) => {
			const content = JSON.parse(JSON.parse(event.data).content);
			const { type, payload } = content;
			console.log(type, payload);
			if (type === "feature_flag_update") {
				flagsSet((prev) => ({
					...prev,
					[payload.key]: payload.enabled,
				}));
				orbitMessageSet(
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

	// useEffect(() => {
	// 	document.documentElement.classList.toggle("dark-theme", !isDarkMode);
	// }, [isDarkMode]);

	const sendMessageOrbit = () => {
		if (socket?.wsOrbit) {
			socket.wsOrbit.send("Hello from React!");
		}
	};

	return (
		<div className="flex flex-col gap-5 min-h-svh w-full items-center justify-center p-6 md:p-10">
			<h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
				Client
			</h1>

			<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
				Received message from server-orbit
			</h2>
			{messageOrbit && (
				<code className="bg-muted justify-start relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
					{messageOrbit}
				</code>
			)}
			<Button onClick={sendMessageOrbit}>
				Send Message to server-orbit
			</Button>

			{flags.enableDarkMode && <ModeToggle />}
		</div>
	);
}

export default App;
