import time
from fastapi import WebSocket, APIRouter
from starlette.websockets import WebSocketDisconnect
from app.rabbitmq.schemas import ChatMessage
from app.rabbitmq.publisher import send_message

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("[WebSocket] Client connected")
    try:
        while True:
            data = await websocket.receive_text()
            print("[WebSocket] Received ", data)
            await websocket.send_text(f"Message text was: {data}")
            chat_msg = ChatMessage(
                type="chat",
                from_="server-orbit",
                to="server-comet",
                content=data,
                timestamp=int(time.time())
            )
            send_message("messages", chat_msg)
    except WebSocketDisconnect:
        print("WebSocket client disconnected")