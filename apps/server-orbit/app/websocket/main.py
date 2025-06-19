import asyncio
import time
import json
from typing import List
from fastapi import WebSocket, APIRouter
from starlette.websockets import WebSocketDisconnect
from app.rabbitmq.schemas import ChatMessage
from app.rabbitmq.publisher import send_message
from app.rabbitmq.shared import message_queue
from queue import Empty

router = APIRouter()
active_connections: List[WebSocket] = []

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    print(active_connections)

    print("[WebSocket] Client connected")
    try:
        while True:
            # check for rabbitMQ messages in queue
            try:
                msg = message_queue.get_nowait()
                print(f"[QUEUE] From consumer: {msg}")
                for client in active_connections:
                    await client.send_text(json.dumps(msg))
            except Empty:
                pass

            # handle messages from connected clients
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=0.1)
                print("[WebSocket] Received ", data)
                chat_msg = ChatMessage(
                    type="chat",
                    from_="server-orbit",
                    to="server-comet",
                    content=json.dumps(data),
                    timestamp=int(time.time())
                )
                content = json.dumps({ "type": "notification", "payload": data })
                for client in active_connections:
                    await client.send_text(json.dumps({ "type": "chat", "content": content }))
                send_message(chat_msg)
            except asyncio.TimeoutError:
                pass
    except WebSocketDisconnect:
        print("WebSocket client disconnected")
        active_connections.remove(websocket)