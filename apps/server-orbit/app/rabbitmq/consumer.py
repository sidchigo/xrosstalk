import json
from pika.adapters.blocking_connection import BlockingChannel
from pika.spec import Basic, BasicProperties
from .config import setup_queue

def handle_message(
    ch: BlockingChannel,
    method: Basic.Deliver,
    properties: BasicProperties,
    body: bytes
) -> None:
    try:
        data = json.loads(body.decode("utf-8"))
        print(" [x] Orbit Received:", data)
        # Do something useful here...
    except Exception as e:
        print(" [!] Error:", e)
    finally:
        ch.basic_ack(delivery_tag=method.delivery_tag)

def consume_message(queue_name: str) -> None:
    channel = setup_queue()
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue=queue_name, on_message_callback=handle_message)  # type: ignore
    print(" [*] Waiting for messages. To exit press CTRL+C")
    channel.start_consuming()
