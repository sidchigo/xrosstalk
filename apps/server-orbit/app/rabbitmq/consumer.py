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
    except Exception as e:
        print(" [!] Error:", e)
    finally:
        ch.basic_ack(delivery_tag=method.delivery_tag)

def consume_message() -> None:
    channel = setup_queue()[1]
    result = channel.queue_declare(queue='', exclusive=True) # type: ignore
    queue_name = result.method.queue # type: ignore
    channel.queue_bind(exchange='chat', queue=queue_name) # type: ignore
    channel.basic_consume(queue=queue_name, on_message_callback=handle_message)  # type: ignore
    print(" [*] Waiting for messages. To exit press CTRL+C")
    try:
        channel.start_consuming()
    except:
        print("Issue while sending to exchange")
