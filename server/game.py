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
        self.board[0][4] = King("b")
        self.board[7][4] = King("w")

    def print_board(self):
        for row in self.board:
            print(row)
        print(f"Turn: {self.turn}")
    
    def validation(self,piece, start_row, start_col, end_row, end_col):
        piece = self.board[start_row][start_col]
        
        if piece is None:
            print("There is no piece here")
            return False
        
        if piece.colour != self.turn:
            print("its not your turn")
            return False
        
        if not (0 <= end_row < 8 and 0 <= end_col < 8):
            print("Off the board")
            return False
        
        return True
    
    def move_piece(self, start_row, start_col, end_row, end_col):
        piece = self.board[start_row][start_col]
        
        if not self.validation(piece, start_row, start_col, end_row, end_col):
            print("Validation not met")
            return
                
        moves = piece.get_legal_moves(self.board, start_row, start_col)
        print("legal moves:", moves)

        if (end_row, end_col) not in moves:
            print("Illegal move")
            return
        # update the boards state
        self.board[end_row][end_col] = piece
        self.board[start_row][start_col] = None
        
        end_piece = self.board[end_row][end_col]

        #Check promotion
        if end_row == 7 or end_row == 0:
            print("end row hit")
            if end_piece.code  == "p" and end_piece.colour == "b":
                print("code hit")
                self.board[end_row][end_col] = Queen("b")
                print("new EP", end_piece)
            if end_piece.code  == "p" and end_piece.colour == "w":
                print("code hit")
                self.board[end_row][end_col] = Queen("w")
                print("new EP", end_piece)

        #change turn
        self.turn = "b" if self.turn == "w" else "w"

        print("Move successful")

        self.print_board()
    
    def legal_moves(self, start_row, start_col):
        piece = self.board[start_row][start_col]
        moves = piece.get_legal_moves(self.board, start_row, start_col)
        
        return moves
        pass

            
        
# game = ChessGame()
# game.print_board()
