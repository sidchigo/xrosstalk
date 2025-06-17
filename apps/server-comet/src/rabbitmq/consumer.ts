import { getConnection } from './config';

export async function consumeMessage() {
	const conn = await getConnection();
	const channel = await conn.createChannel();
	console.log('Received from queue for comet');
	const q = await channel.assertQueue('', { exclusive: true });
	await channel.bindQueue(q.queue, 'chat', '');
	channel.consume(q.queue, msg => {
		if (msg) {
			const content = msg.content.toString();
			console.log('[X] Received message:', content);
			channel.ack(msg);
		}
	});
}
