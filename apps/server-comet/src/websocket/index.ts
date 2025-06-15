import { Server as HTTPServer, IncomingMessage } from 'http';
import { WebSocketServer } from 'ws';

export function setupWebSocket(server: HTTPServer) {
	const wss = new WebSocketServer({ noServer: true });

	server.on('upgrade', (request: IncomingMessage, socket, head) => {
		if (request.url === '/ws') {
			wss.handleUpgrade(request, socket, head, ws => {
				wss.emit('connection', ws, request);
			});
		} else {
			socket.destroy();
		}
	});

	wss.on('connection', ws => {
		console.log('[WebSocket] Client connected');

		ws.on('message', msg => {
			console.log('[WebSocket] Received:', msg.toString());
			ws.send(`Echo: ${msg}`);
		});
	});
}
