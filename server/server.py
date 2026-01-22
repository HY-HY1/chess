import asyncio
import websockets
from game_manager import GameManager

async def main():
    manager = GameManager()
    host = "0.0.0.0"   # <-- REQUIRED
    port = 8765

    print(f"[SERVER] Starting WebSocket server on ws://{host}:{port}")

    async def handler(websocket):
        path = websocket.request.path
        await manager.route_connection(websocket, path)

    async with websockets.serve(handler, host, port):
        await asyncio.Future()  # run forever

asyncio.run(main())
