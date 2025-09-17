# client_test.py
import asyncio
import websockets  # pyright: ignore[reportMissingImports]
import json

async def send_loop(ws):
    """Continuously read user input (in background thread) and send to server."""
    while True:
        msg = await asyncio.to_thread(input, "Enter message (or 'quit' to exit): ")
        if msg.lower() == "quit":
            await ws.close()
            break
        await ws.send(json.dumps({"msg": msg}))

async def recv_loop(ws):
    """Continuously receive and print messages from server."""
    try:
        async for reply in ws:
            print("Received:", reply)
    except websockets.ConnectionClosed:
        print("Server closed connection.")

async def main():
    uri = "ws://localhost:8765"
    async with websockets.connect(uri) as ws:
        # Run send and receive loops at the same time
        await asyncio.gather(
            send_loop(ws),
            recv_loop(ws)
        )

if __name__ == "__main__":
    asyncio.run(main())
