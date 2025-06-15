import { Server as HTTPServer, IncomingMessage } from 'http';

import { ChatMessage } from '@/rabbitmq/types/message';
import { WebSocketServer } from 'ws';
import { sendMessage } from '@/rabbitmq/publisher';
import { consumeMessage } from '@/rabbitmq/consumer';

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

			const chatMessage: ChatMessage = {
				type: 'chat',
				content: msg.toString(),
				from: 'server-comet',
				to: 'server-orbit',
				timestamp: Math.floor(new Date().getTime() / 1000),
			};

			// send to RabbitMQ
			sendMessage('messages', chatMessage);
		});
	});
}
