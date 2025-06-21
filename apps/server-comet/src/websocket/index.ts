import { Server as HTTPServer, IncomingMessage } from 'http';

import { ChatMessage } from '@/rabbitmq/types/message';
import { WebSocketServer, WebSocket } from 'ws';
import { sendMessage } from '@/rabbitmq/publisher';

export const wsClients = new Set<WebSocket>();

export function setupWebSocket(server: HTTPServer) {
	const wss = new WebSocketServer({ noServer: true });

	server.on('upgrade', (request: IncomingMessage, socket, head) => {
		if (request.url === '/ws') {
			wss.handleUpgrade(request, socket, head, ws => {
				wsClients.add(ws);
				ws.on('close', () => wsClients.delete(ws));
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

			const chatMessage: ChatMessage = {
				type: 'chat',
				content: msg.toString(),
				from: 'server-comet',
				to: 'server-orbit',
				timestamp: Math.floor(new Date().getTime() / 1000),
			};

			ws.send(JSON.stringify(chatMessage));

			// send to RabbitMQ
			sendMessage(chatMessage);
		});
	});
}
