from Pieces.base import ChessPiece


class Bishop(ChessPiece):
    def __init__(self, colour):
        super().__init__("b", colour)

    def get_legal_moves(self, board, row, col):
        moves = []
        directions = [(-1,-1), (-1,1), (1,-1), (1,1)]  # diagonals
        for dr, dc in directions:
            r, c = row + dr, col + dc
            while 0 <= r < 8 and 0 <= c < 8:
                target = board[r][c]
                if target is None:
                    moves.append((r, c))
                elif target.colour != self.colour:
                    moves.append((r, c))
                    break
                else:
                    break
                r += dr
                c += dc
        return moves