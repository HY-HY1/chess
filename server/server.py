import asyncio
import websockets
from game_manager import GameManager

async def main():
    manager = GameManager()
    host = "0.0.0.0"
    port = 8765

    print(f"[SERVER] Starting WebSocket server on ws://{host}:{port}")

    async def handler(websocket):
        path = websocket.request.path
        await manager.route_connection(websocket, path)

    async with websockets.serve(handler, host, port):
        print("[SERVER] Server running. Press Ctrl+C to stop.")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n[SERVER] Shutting down gracefully...")
    finally:
        print("[SERVER] Server stopped.")