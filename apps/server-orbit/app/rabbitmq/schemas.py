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