from game_server import GameServer
from utility.websocket import broadcast

class GameManager:
    def __init__(self):
        self.games = {}

    def create_game(self, game_id=None):
        if game_id is None:
            game_id = str(len(self.games) + 1)
            while game_id in self.games:
                game_id = str(int(game_id) + 1)
        
        if game_id in self.games:
            print(f"[GameManager] Game /{game_id} already exists")
            return game_id
        
        self.games[game_id] = GameServer(gameId=game_id)
        print(f"[GameManager] Created new game /{game_id}")
        return game_id

    def join_game(self, game_id):
        if game_id in self.games:
            print(f"[GameManager] Joining existing game /{game_id}")
            return self.games[game_id]
        
        print(f"[GameManager] Game /{game_id} not found")
        return None

    def game_exists(self, game_id):
        return game_id in self.games

    def get_game(self, game_id):
        return self.games.get(game_id)

    async def route_connection(self, websocket, path):
        game_id = path.strip("/") or "1"
        
        game_server = self.join_game(game_id)
        
        # Create new game if doesn't exist
        if game_server is None:
            print(f"[GameManager] Game /{game_id} doesn't exist, creating new game")
            self.create_game(game_id)
            game_server = self.games[game_id]
        
        await broadcast(
            [websocket],
            {
                "type": "game_joined",
                "gameId": game_id
            }
        )
        
        await game_server.handler(websocket)

    def list_active_games(self):
        return {
            game_id: len(server.clients)
            for game_id, server in self.games.items()
        }

    def cleanup_empty_games(self):
        empty_games = [
            game_id for game_id, server in self.games.items()
            if len(server.clients) == 0
        ]
        
        for game_id in empty_games:
            del self.games[game_id]
            print(f"[GameManager] Cleaned up empty game /{game_id}")
        
        return len(empty_games)