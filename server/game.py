from Pieces.pawn import Pawn
from Pieces.knight import Knight
from Pieces.bishop import Bishop
from Pieces.rook import Rook
from Pieces.queen import Queen
from Pieces.king import King 
    

class ChessGame:
    def __init__(self):
        self.board = [[None for _ in range(8)] for _ in range(8)] # Empty 8x8 array of none
        self.turn = "w" # white by default or black
        self.setup_board()
        print(self.board)
        
    def setup_board(self):
        for col in range(8):
            self.board[1][col] = Pawn("b") # black pawn
            self.board[6][col] = Pawn("w") # white pawn
        
        #rooks
        self.board[0][0] = Rook("b")
        self.board[0][7] = Rook("b")
        self.board[7][0] = Rook("w")
        self.board[7][7] = Rook("w")

        #knights
        self.board[0][1] = Knight("b")
        self.board[0][6] = Knight("b")
        self.board[7][1] = Knight("w")
        self.board[7][6] = Knight("w")

        #bishops
        self.board[0][2] = Bishop("b")
        self.board[0][5] = Bishop("b")
        self.board[7][2] = Bishop("w")
        self.board[7][5] = Bishop("w")

        #queens
        self.board[0][3] = Queen("b")
        self.board[7][3] = Queen("w")

        #kings
        self.board[7][4] = King("b")
        self.board[7][4] = King("w")

    def print_board(self):
        for row in self.board:
            print(row)
        print(f"Turn: {self.turn}")
    
    def move_piece(self, start_row, start_col, end_row, end_col):
        piece = self.board[start_row][start_col]
        if piece is None:
            print("There is no piece here")
            return "There is no piece here"
        
        if piece.colour != self.turn:
            print("its not your turn")
            return "its not your turn"
        
        if not (0 <= end_row < 8 and 0 <= end_col < 8):
            print("Off the board")
            return "Off the board"
        
        moves = piece.get_legal_moves(self.board, start_row, start_col)
        print("legal moves:", moves)

        if (end_row, end_col) not in moves:
            print("Illegal move")
            return
        # update the boards state
        self.board[end_row][end_col] = piece
        self.board[start_row][start_col] = None

        #change turn
        self.turn = "b" if self.turn == "w" else "w"

        print("Move successful")

        self.print_board()

            
        
# game = ChessGame()
# game.print_board()
