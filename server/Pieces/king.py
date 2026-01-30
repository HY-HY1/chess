from Pieces.base import ChessPiece


class King(ChessPiece):
    def __init__(self, colour):
        super().__init__("k", colour)

    def get_pseudo_moves(self, board, row, col):
        moves = []
        steps = [(-1,-1), (-1,0), (-1,1),
                 (0,-1),         (0,1),
                 (1,-1), (1,0),  (1,1)]
        for dr, dc in steps:
            r, c = row + dr, col + dc
            if 0 <= r < 8 and 0 <= c < 8:
                target = board[r][c]
                if target is None or target.colour != self.colour:
                    moves.append((r, c))
        return moves

    def __init__(self, colour):
        super().__init__("k", colour)