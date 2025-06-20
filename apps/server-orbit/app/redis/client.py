# redis_client.py
import redis.asyncio as redis

redis_client = redis.Redis(host="redis", port=6379, decode_responses=True)

async def mark_user_online(user_id: str):
    await redis_client.set(f"presence:{user_id}", "online", ex=30)

async def mark_user_offline(user_id: str):
    await redis_client.set(f"presence:{user_id}", "offline")

async def is_user_online(user_id: str) -> bool:
    status = await redis_client.get(f"presence:{user_id}")
    return status == "online"
