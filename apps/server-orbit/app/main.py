from fastapi import FastAPI
from app.websocket.main import router as websocket_router

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "amazing World!"}

app.include_router(websocket_router)