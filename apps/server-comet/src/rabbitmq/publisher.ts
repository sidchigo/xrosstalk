import { setupQueue } from './config';
import { ChatMessage } from './types/message';

export async function sendMessage(queueName: string, message: ChatMessage) {
	const channel = await setupQueue(queueName);
	const buffer = Buffer.from(JSON.stringify(message));
	channel.sendToQueue(queueName, buffer);
	console.log('Sending to queue from comet');
}
