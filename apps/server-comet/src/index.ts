import express from 'express';
import { createServer } from 'http';
import { setupWebSocket } from './websocket';

const app = express();
const server = createServer(app);

// Any REST routes can go here
app.get('/', (_req, res) => {
	res.send('Hello from Express Server! OP');
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
