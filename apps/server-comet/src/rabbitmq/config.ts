import { connect, Channel, Connection, ChannelModel } from 'amqplib';

const CONNECTION_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE = 'messages';

let connection: ChannelModel | null = null;

export async function getConnection(): Promise<ChannelModel> {
	if (!connection) {
		connection = await connect(CONNECTION_URL);
	}
	return connection;
}

export async function setupQueue(queueName = QUEUE): Promise<Channel> {
	const conn = (await getConnection()) as ChannelModel;
	const channel = await conn.createChannel();
	await channel.assertQueue(queueName, { durable: false });
	return channel;
}
