from pika.adapters.blocking_connection import BlockingChannel
from pika import BlockingConnection
import pika
import os

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://localhost")

def setup_queue() -> tuple[BlockingConnection, BlockingChannel]:
    params = pika.URLParameters(RABBITMQ_URL)
    connection = pika.BlockingConnection(params)
    channel = connection.channel()
    return connection, channel
