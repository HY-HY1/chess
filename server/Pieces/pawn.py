from Pieces.base import ChessPiece


class Pawn(ChessPiece):
    def __init__(self, colour):
        super().__init__("p", colour)
    
    def get_pseudo_moves(self, board, row,col ):
        moves = []
        direction = -1 if self.colour == "w" else 1 
        start_row = 6 if self.colour == "w" else 1 

        try:
            if board[row+direction][col] is None:
                moves.append((row + direction, col))
        except IndexError:
            print("Index Error, Ignored")
            
        if row == start_row and board[row+2 * direction][col] is None:
            moves.append((row + 2*direction, col))
        
        
        for dc in [-1, 1]:
            new_row, new_col = row + direction, col + dc
            if 0 <= new_row < 8 and 0 <= new_col < 8:
                target = board[new_row][new_col]
                if target is not None and target.colour != self.colour:
                    moves.append((new_row, new_col))

        return moves