import asyncio
import time
import json
from fastapi import WebSocket, APIRouter
from starlette.websockets import WebSocketDisconnect
from app.rabbitmq.schemas import ChatMessage
from app.rabbitmq.publisher import send_message
from app.rabbitmq.shared import message_queue
from queue import Empty

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("[WebSocket] Client connected")
    try:
        while True:
            # check for rabbitMQ messages in queue
            try:
                msg = message_queue.get_nowait()
                print(f"[QUEUE] From consumer: {msg}")
                await websocket.send_text(json.dumps(msg))
            except Empty:
                pass

            # handle messages from connected clients
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=0.1)
                print("[WebSocket] Received ", data)
                await websocket.send_text(f"Message text was: {data}")
                chat_msg = ChatMessage(
                    type="chat",
                    from_="server-orbit",
                    to="server-comet",
                    content=data,
                    timestamp=int(time.time())
                )
                send_message(chat_msg)
            except asyncio.TimeoutError:
                pass
    except WebSocketDisconnect:
        print("WebSocket client disconnected")