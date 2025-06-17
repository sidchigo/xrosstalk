import 'module-alias/register';
import express from 'express';
import { createServer } from 'http';
import { setupWebSocket } from '@/websocket';
import { consumeMessage } from '@/rabbitmq/consumer';

const app = express();
const server = createServer(app);

consumeMessage().catch(console.error);

// Any REST routes can go here
app.get('/', (_req, res) => {
	res.send({ hello: 'world' });
});

app.get('/hello', (_req, res) => {
	res.send({ hello: 'Hello' });
});

// Setup WebSocket logic
setupWebSocket(server);

const PORT = process.env.COMET_PORT || 5000;
server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
