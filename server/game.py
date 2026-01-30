from Pieces.pawn import Pawn
from Pieces.knight import Knight
from Pieces.bishop import Bishop
from Pieces.rook import Rook
from Pieces.queen import Queen
from Pieces.king import King 
import asyncio
from constants import BOARD_SIZE, WHITE, BLACK

    

class ChessGame:
    def __init__(self, on_checkmate_callback=None, on_resign_callback=None):
        self.board = [[None for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)] # Empty 8x8 array of none
        self.turn = WHITE # white by default or black
        self.king_white = [7,4] # pointers to reduce time compexity
        self.king_black = [0,4] #y,x
        self.checkmate = False
        self.winner = None
        self.on_checkmate_callback = on_checkmate_callback
        self.on_resign_callback = on_resign_callback
        self.movelog = []
        
        self.can_castle_white_kingside = True
        self.can_castle_white_queenside = True
        self.can_castle_black_kingside = True
        self.can_castle_black_queenside = True
        
        self.setup_board()
        print(self.board)
        
    def setup_board(self):
        for col in range(BOARD_SIZE):
            self.board[1][col] = Pawn(BLACK) # black pawn
            self.board[6][col] = Pawn(WHITE) # white pawn
        
        #rooks
        self.board[0][0] = Rook(BLACK)
        self.board[0][7] = Rook(BLACK)
        self.board[7][0] = Rook(WHITE)
        self.board[7][7] = Rook(WHITE)

        #knights
        self.board[0][1] = Knight(BLACK)
        self.board[0][6] = Knight(BLACK)
        self.board[7][1] = Knight(WHITE)
        self.board[7][6] = Knight(WHITE)

        #bishops
        self.board[0][2] = Bishop(BLACK)
        self.board[0][5] = Bishop(BLACK)
        self.board[7][2] = Bishop(WHITE)
        self.board[7][5] = Bishop(WHITE)

        #queens
        self.board[0][3] = Queen(BLACK)
        self.board[7][3] = Queen(WHITE)

        #kings
        self.board[0][4] = King(BLACK)
        self.board[7][4] = King(WHITE)

    def print_board(self):
        for row in self.board:
            print(row)
        print(f"Turn: {self.turn}")
    
    def validation(self, piece, start_row, start_col, end_row, end_col):
        if piece is None:
            return "No piece at that position"
        
        if piece.colour != self.turn:
            return "Not your turn"
        
        if not (0 <= end_row < BOARD_SIZE and 0 <= end_col < BOARD_SIZE):
            return "Move out of bounds"
        
        if self.checkmate:
            return "Game already ended"
    
        return True
    
    def move_piece(self, start_row, start_col, end_row, end_col, websocket, players):
        piece = self.board[start_row][start_col]
        isCapture = False # Flag to determine if the move is a capture
        isPromotion = False # Flag to determine if the move is a capture
        captured_piece_code = None
        
        print(f"[GAME_DEBUG] Player Request Websocket: {websocket}")
        print(f"[GAME_DEBUG] Players websockets': {players}")
        print(f"[GAME]: {self.turn}")
        
        if players[self.turn] == websocket:
            print(f"[INFO] Turn Matches Websocket")
        else:
            print("[GAME] Move Blocked, Websocket doesnt match turn")
            print("[DEVELOPMENT] Remove Return Statement below for easier debug")
            return
        # Return error messages instead of just printing
        validation_result = self.validation(piece, start_row, start_col, end_row, end_col)
        if validation_result is not True:
            return {"success": False, "error": validation_result}
                
        moves = self.legal_moves(start_row, start_col)  # Changed from get_pseudo_moves
        print("legal moves:", moves)

        if (end_row, end_col) not in moves:
            print("Illegal move")
            return
        
        ##Update capture flag
        
        if self.board[end_row][end_col] is not None:
            isCapture = True
            captured_piece_code = self.board[end_row][end_col].code
        
        # update the boards state
        self.board[end_row][end_col] = piece
        self.board[start_row][start_col] = None
    
        if piece.code == "k" and piece.colour == BLACK:
            self.king_black[0] = end_row  # Fixed: should be end_row, not start_row
            self.king_black[1] = end_col  # Fixed: should be end_col, not start_col
            print(f"[GAME] King pointer {self.king_black} ")
            
        elif piece.code == "k" and piece.colour == WHITE:
            self.king_white[0] = end_row  # Fixed: should be end_row, not start_row
            self.king_white[1] = end_col  # Fixed: should be end_col, not start_col
            print(f"[GAME] King pointer {self.king_white} ")
        else:
            print("[GAME] Moved piece isnt King")
            
            end_piece = self.board[end_row][end_col]

            #Check promotion
            if end_row == 7 or end_row == 0:
                if end_piece.code == "p":
                    isPromotion = True
                print("end row hit")
                if end_piece.code  == "p" and end_piece.colour == BLACK:
                    print("code hit")
                    self.board[end_row][end_col] = Queen(BLACK)
                    print("new EP", end_piece)
                if end_piece.code  == "p" and end_piece.colour == WHITE:
                    print("code hit")
                    self.board[end_row][end_col] = Queen(WHITE)
                    print("new EP", end_piece)
            
            opposite_turn = "w" if self.turn == "b" else "b"
            
            print("Move successful")
            new_move = {"piece": f"{piece.code}",
                        "turn": f"{self.turn}", 
                        "to": (end_row, end_col),
                        "algebraicTo": self.algebraic_notation(end_col,end_row), 
                        "from": (start_row, start_col), 
                        "algebraicFrom": self.algebraic_notation(start_col,start_row), 
                        "capture": isCapture, 
                        "check": self.in_check(opposite_turn),
                        "checkmate": self.is_checkmate(opposite_turn),
                        # "stalemate": self.is_stalemate(opposite_turn),
                        "captured_piece": captured_piece_code,
                        "promotion": isPromotion, 
                        "special": None
                        }
            
            self.movelog.append(new_move)
            print(f"[MOVELOG] New move added. New move: {new_move} \n Movelog: {self.movelog}")

            self.print_board()
            
            if self.is_checkmate(self.turn):
                print("[GAME] Game ended by checkmate")
            elif self.is_stalemate(self.turn):
                print("[GAME] Game ended by stalemate")
                
        self.turn = BLACK if self.turn == WHITE else WHITE
        
    def is_square_attacked(self, row, col, by_colour):
        print(f"[DEBUG] Checking if ({row}, {col}) is attacked by {by_colour}")
        for r in range(BOARD_SIZE):
            for c in range(BOARD_SIZE):
                piece = self.board[r][c]
                if piece and piece.colour == by_colour:
                    moves = piece.get_pseudo_moves(self.board, r, c)
                    if (row, col) in moves:
                        print(f"[DEBUG] YES! {piece.code} at ({r}, {c}) can attack ({row}, {col})")
                        return True
        print(f"[DEBUG] NO attacks found on ({row}, {col})")
        return False
    
    def algebraic_notation(self, row, col):
        files = "abcdefgh"
        rank = 8 - col
        file = files[row]
        return f"{file}{rank}"
    
    def in_check(self, colour):
        opponent_colour = WHITE if colour == BLACK else BLACK
        
        king = self.king_white if colour == WHITE else self.king_black
        return self.is_square_attacked(king[0], king[1], opponent_colour)
    
    def legal_moves(self, start_row, start_col):
        try:
            piece = self.board[start_row][start_col]
            if not piece:
                #return []fix Causes bug with finding checkmate, game thinks checkmate has occured
                # return [9,9]
                pass
            
            # castlable = self.update_castling_rights(self.turn)
            
            # print(f"[GAME] {self.turn} Can castle: ",castlable)
            

            
            if piece.colour is not self.turn: #potential bug for analysis
                print("[GAME] Isnt players turn to move")
                # return [] # Empty array when its not the players turn
                # return [9,9] # Says there is a legal off the board move (unclickable on frontend)
                            # prevents server thinking checkmate has occured when there are no legal moves due to turns
                pass
            
            pseudo_moves = piece.get_pseudo_moves(self.board, start_row, start_col)
            legal = []
            
            
            print(f"[GAME] Legal Moves for piece {start_row}, {start_col}")
            
            for end_row, end_col in pseudo_moves:
                # Simulate the move
                original_piece = self.board[end_row][end_col]
                self.board[end_row][end_col] = piece
                self.board[start_row][start_col] = None
                
                # Update king pointer if moving a king
                original_king_pos = None
                if piece.code == "k":
                    if piece.colour == WHITE:
                        original_king_pos = self.king_white.copy()
                        self.king_white[0] = end_row
                        self.king_white[1] = end_col
                    else:
                        original_king_pos = self.king_black.copy()
                        self.king_black[0] = end_row
                        self.king_black[1] = end_col
                
                # Check if this move leaves our king in check
                if not self.in_check(piece.colour):
                    legal.append((end_row, end_col))
                else:
                    print(f"[DEBUG] Move to ({end_row}, {end_col}) would leave king in check")
                # Undo the move
                self.board[start_row][start_col] = piece
                self.board[end_row][end_col] = original_piece
                
                # Restore king pointer if it was moved
                if original_king_pos:
                    if piece.colour == WHITE:
                        self.king_white = original_king_pos
                    else:
                        self.king_black = original_king_pos
                         
        except Exception as e:
                print(f"[ERROR] in legal_moves: {e}")
                import traceback
                traceback.print_exc()
                return []
        return legal
    
    ## Decomposition of problems here =>
    
    def update_castling_rights(self, piece, start_row, start_col):
        if piece.code == "k":
            if piece.colour == WHITE:
                self.can_castle_white_kingside = False
                self.can_castle_white_queenside = False
                print("[GAME] White king moved - all castling rights lost")
            else:
                self.can_castle_black_kingside = False
                self.can_castle_black_queenside = False
                print("[GAME] Black king moved - all castling rights lost")
        
        elif piece.code == "r":
            if start_row == 7 and start_col == 0:  # White queenside rook
                self.can_castle_white_queenside = False
                print("[GAME] White queenside rook moved - queenside castling lost")
            elif start_row == 7 and start_col == 7:  # White kingside rook
                self.can_castle_white_kingside = False
                print("[GAME] White kingside rook moved - kingside castling lost")
            elif start_row == 0 and start_col == 0:  # Black queenside rook
                self.can_castle_black_queenside = False
                print("[GAME] Black queenside rook moved - queenside castling lost")
            elif start_row == 0 and start_col == 7:  # Black kingside rook
                self.can_castle_black_kingside = False
                print("[GAME] Black kingside rook moved - kingside castling lost")
            
    def has_legal_moves(self, colour):

        for row in range(BOARD_SIZE):
            for col in range(BOARD_SIZE):
                piece = self.board[row][col]
                if piece and piece.colour == colour:
                    moves = self.legal_moves(row, col)
                    if len(moves) > 0:
                        print(f"[GAME] {colour.upper()} has legal moves: {moves}")
                        return True
        
        print(f"[GAME] {colour.upper()} has no legal moves")
        return False

    def is_checkmate(self, colour):

        # Must be in check for checkmate
        if not self.in_check(colour):
            print(f"[GAME] {colour.upper()} is not in check - no checkmate")
            return False
        
        # If in check but has legal moves, not checkmate
        if self.has_legal_moves(colour):
            print(f"[GAME] {colour.upper()} is in check but has legal moves")
            return False
        
        # In check with no legal moves = checkmate
        self.checkmate = True
        self.winner = WHITE if colour == BLACK else BLACK
        
        print(f"[GAME] Checkmate! {self.winner.upper()} won the game")
        
        if self.on_checkmate_callback:
            asyncio.create_task(self.on_checkmate_callback(self.winner))
        
        return True

    def is_stalemate(self, colour):
        # not be in check for stalemate
        if self.in_check(colour):
            print(f"[GAME] {colour.upper()} is in check - no stalemate")
            return False
        
        # has legal moves, not stalemate
        if self.has_legal_moves(colour):
            print(f"[GAME] {colour.upper()} has legal moves - no stalemate")
            return False
        
        # Not in check with no legal moves = stalemate
        self.checkmate = True  
        self.winner = "draw"
        
        print(f"[GAME] Stalemate! Game is a draw")
        
        if self.on_checkmate_callback:
            asyncio.create_task(self.on_checkmate_callback("draw"))
        
        return True
                        
    def resign(self, websocket, players):
        """
        Returns: resigned, winner. Always return False, None for errors
            
        """
        if self.checkmate:
            print("[GAME]: Checkmate has occured, Resignation invalid")
            return False, None
        
        colour = None
        
        if players[WHITE] == websocket:
            colour = WHITE
            print("[DEBUG] Websocket ARGS: ", websocket,)
            print("[DEBUG] Players[white]: ", players[WHITE],)
            print("[DEBUG] players[black]: " ,players[BLACK])
        elif players[BLACK] == websocket:
            colour = BLACK
        else:
            print("[GAME] Do nothing, Request didnt come from player")
            return False, None
        
        self.checkmate = True # Not checkmate, signals game is over
        if colour == BLACK:
            self.winner = WHITE
            self.resign_callback(BLACK)
        elif colour == WHITE:
            self.winner = BLACK
            self.resign_callback(WHITE)
        else:
            return False, None  # ← SAFE

        
        return colour, self.winner
                
    def resign_callback(self,colour):
        if self.on_checkmate_callback:
            asyncio.create_task(self.on_resign_callback(f"{colour} Resigned", self.winner ))
        
            return True
        
        return f"{colour} Resigned"
            
        
        
# game = ChessGame()
# game.print_board()
