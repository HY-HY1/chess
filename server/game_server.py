import asyncio
import websockets  # pyright: ignore[reportMissingImports]
import json
from game import ChessGame
from utility.websocket import serialize_board, broadcast

##game server.py
class GameServer:

    def __init__(self, gameId=None, host="localhost", port=8765):
        self.host = host
        self.port = port
        self.clients = set()

        # Track client roles
        self.client_roles = {}

        self.gameId = gameId
        self.game = ChessGame()

        #Player piece colout
        self.players = {
            "w": None,
            "b": None
        }

        print("[SERVER INIT] GameServer created")
        print("[SERVER INIT] Waiting for players...")

    async def handler(self, websocket):
        print("\n[CONNECTION] New client attempting to connect")

        self.clients.add(websocket)

        # assign roles
        if self.players["w"] is None:
            self.players["w"] = websocket
            self.client_roles[websocket] = "w"
            role = "WHITE"
            print("[ROLE ASSIGNMENT] Client assigned as WHITE")

        elif self.players["b"] is None:
            self.players["b"] = websocket
            self.client_roles[websocket] = "b"
            role = "BLACK"
            print("[ROLE ASSIGNMENT] Client assigned as BLACK")

        else:
            self.client_roles[websocket] = "spectator"
            role = "SPECTATOR"
            print("[ROLE ASSIGNMENT] Client assigned as SPECTATOR")

        print(f"[CONNECTION] Total clients: {len(self.clients)}")

        # send client role state
        await websocket.send(json.dumps({
            "type": "role",
            "role": self.client_roles[websocket]
        }))

        try:
            async for message in websocket:
                print("\n[MESSAGE RECEIVED]")
                print(f"  Raw message: {message}")

                data = json.loads(message)
                msg_type = data.get("type")

                print(f"  Parsed type: {msg_type}")
                print(f"  From role: {self.client_roles[websocket]}")

                # handle moves
                if msg_type == "move":
                    if self.client_roles[websocket] == "spectator":
                        print("[MOVE BLOCKED] Spectator attempted to move")
                        continue

                    start = data["start"]
                    end = data["end"]

                    print("[MOVE REQUEST]")
                    print(f"  From: {start}")
                    print(f"  To:   {end}")

                    try:
                        self.game.move_piece(
                            start[0], start[1],
                            end[0], end[1]
                        )
                        print("[MOVE SUCCESS] Board updated")

                    except Exception as e:
                        print("[MOVE ERROR]", e)
                        continue

                    board_state = serialize_board(self.game.board)

                    print("[BROADCAST] Sending board_update to all clients")
                    await broadcast(
                        self.clients,
                        {
                            "type": "board_update",
                            "board": board_state
                        }
                    )

                # handle board update requests
                elif msg_type == "board_update":
                    print("[BOARD UPDATE REQUEST] Sending current board")

                    await broadcast(
                        self.clients,
                        {
                            "type": "board_update",
                            "board": serialize_board(self.game.board)
                        }
                    )

                # legal moves
                elif msg_type == "legal_moves":
                    start = data["start"]
                    print("[LEGAL MOVES REQUEST]")
                    print(f"  Square: {start}")

                    moves = self.game.legal_moves(start[0], start[1])
                    print(f"  Legal moves calculated: {moves}")

                    await broadcast(
                        self.clients,
                        {
                            "type": "legal_moves",
                            "moves": moves
                        }
                    )

                else:
                    print("[UNKNOWN MESSAGE TYPE]", msg_type)

        except websockets.ConnectionClosed:
            print("\n[DISCONNECT] Client disconnected")

        finally:
            role = self.client_roles.get(websocket, "unknown")
            print(f"[CLEANUP] Removing client ({role})")

            self.clients.remove(websocket)
            self.client_roles.pop(websocket, None)

            if self.players["w"] == websocket:
                self.players["w"] = None
                print("[CLEANUP] WHITE slot freed")

            if self.players["b"] == websocket:
                self.players["b"] = None
                print("[CLEANUP] BLACK slot freed")

            print(f"[CLEANUP] Active clients: {len(self.clients)}")

