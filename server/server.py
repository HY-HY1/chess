import asyncio
import websockets # pyright: ignore[reportMissingImports]
import json
from game import ChessGame


class Server:
    
    def __init__(self, host="localhost", port=8765):
        self.host = host
        self.port = port
        self.clients = set()
        self.game = ChessGame()
        
    async def handler(self,websocket): # handles when a new client connects to the socket
        # add websockets to clients array
        self.clients.add(websocket)
        print(f"Client connected. Total: {len(self.clients)}")
        try:
            async for message in websocket:
                data = json.loads(message)
                print(f"Recieved: {data}")

                if data["type"] == "move":
                    # handle movements here 
                    print(data["start"], data["end"])
                    start = data["start"]
                    end = data["end"]
                    self.game.move_piece(start[0], start[1], end[0], end[1])

                    # broadcast updated board to all clients
                    await self.broadcast({
                        "type": "board_update",
                        "board": self.serialize_board()
                    })
                
                #echo message to sender
                await websocket.send(json.dumps({"type": "echo", "msg": data}))
                
                ## echo message to other connected clients
                await self.broadcast({
                    "data": data
                }, exclude=websocket)

            
        except websockets.ConnectionClosed:
            print("Client disconnected")
        finally:
            ## Remove the disconnected client
            self.clients.remove(websocket)
            
        
    async def broadcast(self, message, exclude=None): # send message to all connected clients
            msg = json.dumps(message) # convert to json
            # store all connected non excluded clients in array 
            targets = [c for c in self.clients if c != exclude] 
            
            if targets:
                # asyncrynously broadcast to all connected clients
                await asyncio.gather(*(c.send(msg) for c in targets))

    def serialize_board(self): # convert board into JSON-safe format
        serial = []
        for row in self.game.board:
            serial_row = []
            for piece in row:
                if piece:
                    serial_row.append(f"{piece.code}{piece.colour}")  # e.g. "pw", "rb"
                else:
                    serial_row.append(None)
            serial.append(serial_row)
        return serial

    async def run(self):
        print(f"Starting server on ws://{self.host}:{self.port}")
        ## open a websocket server on the objects host and port
        async with websockets.serve(self.handler, self.host, self.port):
            await asyncio.Future()  # stop server immediately exiting

server = Server()
asyncio.run(server.run())
