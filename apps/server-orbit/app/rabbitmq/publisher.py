import json
from .config import setup_queue
from .schemas import ChatMessage

def send_message(queue_name: str, message: ChatMessage):
    channel = setup_queue(queue_name)
    body = json.dumps(message.model_dump())
    channel.basic_publish(
        exchange='',
        routing_key=queue_name,
        body=body
    )
    print("[X] Orbit sent: ", body)