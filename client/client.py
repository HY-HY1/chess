import json
import asyncio
import websockets

class ChessClient: 
    def __init__(self, uri="ws://localhost:8765"):
        self.uri = uri
        self.board = None
    
    async def connect(self):
        async with websockets.connect(self.uri) as ws:
            print("Connected to websocket")

            # Run listen() and user_input() concurrently
            listen_task = asyncio.create_task(self.listen(ws))
            input_task = asyncio.create_task(self.user_input(ws))

            await asyncio.gather(listen_task, input_task) ## only required for command line testing
            await asyncio.gather(listen_task)

    async def listen(self, ws):
        async for message in ws:
            data = json.loads(message)
            print(f"Received: {data}")
            
            if data["type"] == "board_update":
                self.board = data["board"]
                self.print_board()
            
    async def send_move(self, ws, start, end): 
        move = {"type": "move", "start": start, "end": end}
        await ws.send(json.dumps(move))

    async def user_input(self, ws):
        """Non-blocking loop to enter moves continuously"""
        loop = asyncio.get_event_loop()
        while True:
            move_str = await loop.run_in_executor(None, input, "Enter move (row col row col): ")
            try:
                start_row, start_col, end_row, end_col = map(int, move_str.split())
                await self.send_move(ws, (start_row, start_col), (end_row, end_col))
            except Exception:
                print("Invalid input. Format: row col row col")

    def print_board(self):
        """Just for debugging comms (text-based board)"""
        for row in self.board:
            print(" ".join([p if p else "." for p in row]))
        print("\n")


if __name__ == "__main__": # only required for testing client in terminal
    client = ChessClient()
    asyncio.run(client.connect())
    asyncio.run(client.send_move())
