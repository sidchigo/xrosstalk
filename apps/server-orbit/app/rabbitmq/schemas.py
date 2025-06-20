from pydantic import BaseModel
from typing import Literal

class ChatMessage(BaseModel):
    type: Literal["chat"]
    from_: str 
    to: str
    content: str
    timestamp: int

    class Config:
        fields = {"from_": "from"}


class PresencePayload(BaseModel):
    user_id: str
    status: Literal["online", "offline"]
    timestamp: int

class PresenceMessage(BaseModel):
    type: Literal["presence_update"]
    payload: PresencePayload