from Pieces.base import ChessPiece
import Pieces.bishop as Bishop
import Pieces.rook as Rook

class Queen(ChessPiece):
    def __init__(self, colour):
        super().__init__("q", colour)

    def get_legal_moves(self, board, row, col):
        # Queen = rook + bishop
        moves = []
        rook_like = Rook(self.colour).get_legal_moves(board, row, col)
        bishop_like = Bishop(self.colour).get_legal_moves(board, row, col)
        moves.extend(rook_like)
        moves.extend(bishop_like)
        return moves