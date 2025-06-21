import { useEffect, useState } from "react";
import { Globe, ScrollText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import "./App.css";
import { Button } from "./components/ui/button";
import React from "react";
import { logTimestamp } from "./lib/utils";

const WS_COMET_URL = "ws://localhost:5000/ws";

function Admin() {
	const [enableDarkMode, enableDarkModeSet] = useState(true);
	const [messageOrbit, messageOrbitSet] = useState<string[]>([]);
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
			const content = JSON.parse(JSON.parse(event.data).content);
			if (content.type === "presence_update") {
				const { payload } = content;
				const { status, user_id, timestamp } = payload;
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
					const logMessage = `[${logTimestamp()}] ${user_id} has disconnected`;
					messageOrbitSet((messages) => [...messages, logMessage]);
				}
			} else if (content.type === "theme_update") {
				const { user, currentTheme } = content.payload;
				const logMessage = `[${logTimestamp()}] ${user} has enabled ${currentTheme} theme`;
				messageOrbitSet((messages) => [...messages, logMessage]);
			} else if (content.type === "connection_update") {
				const { user, currentStatus } = content.payload;
				const logMessage = `[${logTimestamp()}] ${user} has ${currentStatus}`;
				messageOrbitSet((messages) => [...messages, logMessage]);
			} else if (
				content.type === "feature_flag_update" &&
				content.payload.key === "darkMode"
			) {
				enableDarkModeSet(!content.payload.enabled);
			}
		};

		return () => {
			wsComet.close();
		};
	}, []);

	const sendMessageComet = () => {
		if (socket?.wsComet) {
			const darkModePayload = {
				type: "feature_flag_update",
				payload: {
					key: "darkMode",
					enabled: enableDarkMode,
				},
			};
			socket.wsComet.send(JSON.stringify(darkModePayload));
		}
	};

	return (
		<div className="flex flex-col gap-5 min-h-svh w-full items-center justify-center p-6 md:p-10">
			<h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
				This is Admin
			</h1>
			<ScrollArea className="h-60 w-72 rounded-md border">
				<div className="p-4">
					<h4 className="mb-4 text-2xl text-center leading-none font-medium">
						<div className="flex justify-center gap-2">
							<Globe color="#b1f98b" strokeWidth={1.5} />
							<div>Online users</div>
						</div>
					</h4>

					{Array.from(onlineUsers.entries()).map(
						([userId, timestamp]) => (
							<React.Fragment key={userId}>
								<div className="text-sm">
									{userId} - {logTimestamp(timestamp)}
								</div>
								<Separator className="my-2" />
							</React.Fragment>
						)
					)}
				</div>
			</ScrollArea>

			<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
				Client log messages
			</h2>
			<ScrollArea className="h-60 w-72 rounded-md border">
				<div className="p-4">
					<h4 className="mb-4 text-2xl text-center leading-none font-medium">
						<div className="flex justify-center gap-2">
							<ScrollText />
							<div>Logs</div>
						</div>
					</h4>

					{messageOrbit.map((logMessage, index) => (
						<React.Fragment key={index}>
							<div className="text-sm">{logMessage}</div>
							<Separator className="my-2" />
						</React.Fragment>
					))}
				</div>
			</ScrollArea>

			<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
				Feature flag for clients
			</h2>
			<Button onClick={sendMessageComet}>
				{enableDarkMode ? "Enable" : "Disable"} dark mode for users
			</Button>
		</div>
	);
}

export default Admin;
