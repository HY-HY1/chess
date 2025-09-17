import asyncio
import websockets # pyright: ignore[reportMissingImports]
import chess # pyright: ignore[reportMissingImports]
import json

class ChessServer:
    
    def __init__(self, host="localhost", port=8765):
        self.host = host
        self.port = port
        self.clients = set()
        
    async def handler(self,websocket): # handles when a new client connects to the socket
        # add websockets to clients array
        self.clients.add(websocket)
        print(f"Client connected. Total: {len(self.clients)}")
        try:
            async for message in websocket:
                data = json.loads(message)
                print(f"Recieved: {data}")
                
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

    async def run(self):
        print(f"Starting server on ws://{self.host}:{self.port}")
        ## open a websocket server on the objects host and port
        async with websockets.serve(self.handler, self.host, self.port):
            await asyncio.Future()  # stop server immediately exiting

server = ChessServer()
asyncio.run(server.run())