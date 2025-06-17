import { getConnection } from './config';
import { ChatMessage } from './types/message';

export async function sendMessage(message: ChatMessage) {
	try {
		const conn = await getConnection();
		const channel = await conn.createChannel();
		const buffer = Buffer.from(JSON.stringify(message));
		channel.assertExchange('chat', 'fanout', { durable: false });
		channel.publish('chat', '', buffer);
		console.log('Sending to queue from comet');
	} catch (error) {
		console.log('[Comet] Error while sending to queue: ', error);
	}
}
