import threading
from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.websocket.main import router as websocket_router
from app.rabbitmq.consumer import consume_message

@asynccontextmanager
async def lifespan(app: FastAPI):
    thread = threading.Thread(target=consume_message, daemon=True)
    thread.start()
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/")
def read_root():
    return {"Hello": "amazing World!"}

app.include_router(websocket_router)