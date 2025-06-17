import json
from .config import setup_queue
from .schemas import ChatMessage

def send_message(message: ChatMessage):
    channel = setup_queue()[1]
    body = json.dumps(message.model_dump())
    channel.exchange_declare(exchange='chat', exchange_type='fanout', durable=False) # type: ignore
    channel.basic_publish(exchange='chat', routing_key='', body=body)
    print("[X] Orbit sent: ", body)