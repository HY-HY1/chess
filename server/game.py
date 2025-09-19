class ChessPiece:
    def __init__(self,code,colour):
        self.code = code # r,n,b,k,q,p
        self.colour = colour # b,w black or white
    
    def __repr__(self):
        return f"{self.code},{self.colour}"
    
    

class ChessGame:
    def __init__(self):
        self.board = [[None for _ in range(8)] for _ in range(8)] # Empty 8x8 array of none
        self.turn = "w" # white by default or black
        self.setup_board()
        print(self.board)
        
    def setup_board(self):
        for col in range(8):
            self.board[1][col] = ChessPiece('p', 'b') # black pawn
            self.board[6][col] = ChessPiece('p', 'w')
        
        #rooks
        self.board[0][0] = ChessPiece('r', 'b')
        self.board[0][7] = ChessPiece('r', 'b')
        self.board[7][0] = ChessPiece('r', 'w')
        self.board[7][7] = ChessPiece('r', 'w')

        #knights
        self.board[0][1] = ChessPiece('n', 'b')
        self.board[0][6] = ChessPiece('n', 'b')
        self.board[7][1] = ChessPiece('n', 'b')
        self.board[7][6] = ChessPiece('n', 'b')

        #bishops
        self.board[0][2] = ChessPiece('b', 'b')
        self.board[0][5] = ChessPiece('b', 'b')
        self.board[7][2] = ChessPiece('b', 'w')
        self.board[7][5] = ChessPiece('b', 'w')

        #queens
        self.board[0][3] = ChessPiece('q', 'b')
        self.board[7][3] = ChessPiece('q', 'w')

        #kings
        self.board[7][4] = ChessPiece('k', 'w')
        self.board[7][4] = ChessPiece('k', 'b')

    def print_board(self):
        for row in self.board:
            print(row)
        print(f"Turn: {self.turn}")
    
    def move_peice(self, start_row, start_col, end_row, end_col):
        piece = self.board[start_row][start_col]
        if piece is None:
            return "There is no piece here"
        
        if piece.colour != self.turn:
            return "its not your turn"
        
        if end_col >= 8 or end_row >= 8:
            return "Off the board"
        
        dest = self.board[end_row][end_col]
        
        
        

    

game = ChessGame()
game.print_board()
