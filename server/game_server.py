import asyncio
import websockets  # pyright: ignore[reportMissingImports]
import json
from game import ChessGame
from utility.websocket import serialize_board, broadcast
from messenger import Messenger

##game server.py
class GameServer:

    def __init__(self, gameId=None, host="localhost", port=8765):
        self.host = host
        self.port = port
        self.clients = set()

        # Track client roles: websocket -> "w" | "b" | "spectator"
        self.client_roles = {}

        self.gameId = gameId
        self.game = ChessGame(on_checkmate_callback=self.on_checkmate,
                              on_resign_callback=self.on_resign
                              ) # callback for game win state update

        # Explicit player slots
        self.players = {
            "w": None,
            "b": None
        }
        
        self.messenger = Messenger()

        print("[SERVER INIT] GameServer created")
        print("[SERVER INIT] Waiting for players...")
        
    async def on_checkmate(self, winner):
        print(f"[CHECKMATE] Game over! Winner: {winner}")
        await broadcast(
            self.clients,
            {
                "type": "game_over",
                "winner": winner,
                "reason": "checkmate"
            }
        )
    
    async def on_resign(self, resigned_player, winner):
        print(f"[RESIGN] Game over! Resigned_Player: {resigned_player}. Winner: {winner}")
        await broadcast(
            self.clients,
            {
                "type": "game_over",
                "resigned_player": resigned_player,
                "reason": "resignation"
            }
        )

    async def handler(self, websocket):
        print("\n[CONNECTION] New client attempting to connect")

        self.clients.add(websocket)

        # ---- Assign role ----
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

        # Notify client of their role
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

                # ---- MOVE HANDLING ----
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
                            end[0], end[1],
                            websocket,
                            self.players
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
                            "board": board_state,
                            "movelog": self.game.movelog
                        }
                    )

                # ---- BOARD UPDATE REQUEST ----
                elif msg_type == "board_update":
                    print("[BOARD UPDATE REQUEST] Sending current board")

                    await broadcast(
                        self.clients,
                        {
                            "type": "board_update",
                            "board": serialize_board(self.game.board)
                        }
                    )

                # ---- LEGAL MOVES ----
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
                    
                elif msg_type == "resign":
                    resgined, winner = self.game.resign(websocket, self.players)
                    if not resgined:
                        print("[GAME_SERVER] There was an issue with resignation")
                        return
                    await broadcast(
                        self.clients,
                        {
                            "type": "resign",
                            "message": "Player resigned"
                        }
                    )
                    await self.messenger.handle_chat_message(
                        websocket,
                        "Server",
                        f"Game Over Player {resgined} Resigned. {winner} Wins!",
                        self.clients
                    )

                elif msg_type == "chat":
                    chat_message = data.get("message", "")
                    sender_role = self.client_roles[websocket]
                    
                    await self.messenger.handle_chat_message(
                        websocket,
                        sender_role,
                        chat_message,
                        self.clients
                    )
                    
                elif msg_type == "chat_history":
                    await self.messenger.get_history(websocket)

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

