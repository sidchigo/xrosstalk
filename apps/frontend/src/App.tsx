import { useEffect, useState } from "react";
import "./App.css";
import { useParams } from "react-router";
import { ModeToggle } from "./components/mode-toggle";

const WS_ORBIT_URL = "ws://localhost:5001/ws";

type Flags = {
	darkMode?: boolean;
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

		const message = {
			type: "connection_update",
			payload: {
				user,
				currentStatus: "connected",
			},
		};

		wsOrbit.onopen = () => wsOrbit.send(JSON.stringify(message));
		wsOrbit.onclose = () => console.log("WebSocket disconnected");
		wsOrbit.onmessage = (event) => {
			const content = JSON.parse(JSON.parse(event.data).content);
			const { type, payload } = content;
			if (type === "feature_flag_update") {
				flagsSet((prev) => ({
					...prev,
					[payload.key]: payload.enabled,
				}));
				orbitMessageSet(
					`Feature ${payload.key} is ${
						payload.enabled ? "enabled" : "disabled"
					}`
				);
			}
		};

		return () => {
			wsOrbit.close();
		};
	}, []);

	const sendMessageOrbit = (theme: string) => {
		const message = {
			type: "theme_update",
			payload: {
				user,
				currentTheme: theme,
			},
		};
		if (socket?.wsOrbit) {
			socket.wsOrbit.send(JSON.stringify(message));
		}
	};

	return (
		<div className="flex flex-col gap-5 min-h-svh w-full items-center justify-center p-6 md:p-10">
			<h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
				Hi! {user}, you are client
			</h1>

			<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
				Received message from admin
			</h2>

			<code className="bg-muted justify-start relative rounded px-[1rem] py-[1.5rem] font-mono text-sm font-semibold">
				{messageOrbit
					? messageOrbit
					: "Messages received from server will be displayed here."}
			</code>

			{flags.darkMode && <ModeToggle handleMessage={sendMessageOrbit} />}
		</div>
	);
}

export default App;
