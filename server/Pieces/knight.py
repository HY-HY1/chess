from Pieces.base import ChessPiece

class Knight(ChessPiece):
    def __init__(self, colour):
        super().__init__("n", colour)

    def get_pseudo_moves(self, board, row, col):
        moves = []
        jumps = [(-2,-1), (-2,1), (-1,-2), (-1,2),
                 (1,-2), (1,2), (2,-1), (2,1)]
        for dr, dc in jumps:
            r, c = row + dr, col + dc
            if 0 <= r < 8 and 0 <= c < 8:
                target = board[r][c]
                if target is None or target.colour != self.colour:
                    moves.append((r, c))
        return moves