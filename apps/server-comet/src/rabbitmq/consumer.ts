import { setupQueue } from './config';

export async function consumeMessage(queueName: string) {
	const channel = await setupQueue(queueName);
	console.log('Received from queue for comet');
	channel.consume(queueName, msg => {
		if (msg) {
			const content = msg.content.toString();
			console.log('[X] Received message:', content);
			channel.ack(msg);
		}
	});
}
