from pika.adapters.blocking_connection import BlockingChannel
import pika
import os

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://localhost")
QUEUE = "messages"

def setup_queue(queue_name: str = QUEUE) -> BlockingChannel:
    params = pika.URLParameters(RABBITMQ_URL)
    connection = pika.BlockingConnection(params)
    channel = connection.channel()
    channel.queue_declare(queue=queue_name, durable=False) # type: ignore
    return channel
