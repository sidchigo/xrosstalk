import { Server as HTTPServer } from 'http';
import { WebSocketServer } from 'ws';

export function setupWebSocket(server: HTTPServer) {
	const wss = new WebSocketServer({ server });

	wss.on('connection', ws => {
		console.log('[WebSocket] Client connected');

		ws.on('message', msg => {
			console.log('[WebSocket] Received:', msg.toString());
			ws.send(`Echo: ${msg}`);
		});
	});
}
