import pygame
import sys
import json
from client.client import ChessClient

client = ChessClient()


WIDTH, HEIGHT = 640, 640
ROWS, COLS = 8, 8
SQUARE_SIZE = WIDTH // COLS
LIGHT = (240, 217, 181)
DARK = (181, 136, 99)
BACKGROUND_COLOR = (255,255,255)

PIECE_LETTERS = { # temp letter mappings
    "p": "P",
    "r": "R",
    "n": "N",
    "b": "B",
    "q": "Q",
    "k": "K"
}

class ChessGUI:
    def __init__(self, width=WIDTH, height=HEIGHT):
        pygame.init()
        self.width = width
        self.height = height
        self.screen = pygame.display.set_mode((self.width, self.height))
        pygame.display.set_caption("Chess Game")
        self.clock = pygame.time.Clock()
        self.running = True
        self.font = pygame.font.SysFont("arial", 36, bold=True)
        ## Testing board, link to server later
        self.board = [
            ["br","bn","bb","bq","bk","bb","bn","br"],
            ["bp","bp","bp","bp","bp","bp","bp","bp"],
            [None]*8,
            [None]*8,
            [None]*8,
            [None]*8,
            ["wp","wp","wp","wp","wp","wp","wp","wp"],
            ["wr","wn","wb","wq","wk","wb","wn","wr"],
        ]


    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False

    def draw(self):
        self.screen.fill(BACKGROUND_COLOR)  # just empty white window for now
    
    def draw_board(self):
        for row in range(ROWS):
            for col in range(COLS):
                colour = LIGHT if (row + col) % 2 == 0 else DARK
                pygame.draw.rect(self.screen, colour, (col*SQUARE_SIZE, row*SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE))
                
    


    def draw_pieces(self):
        for row in range(ROWS):
            for col in range(COLS):
                piece = self.board[row][col]
                if piece:
                    colour = (0,0,0) if piece[0] == "b" else (255,255,255)  # black/white text
                    letter = PIECE_LETTERS[piece[1]]  # get symbol (p, r, n...)
                    text = self.font.render(letter, True, colour)
                    x = col * SQUARE_SIZE + SQUARE_SIZE//3
                    y = row * SQUARE_SIZE + SQUARE_SIZE//4
                    self.screen.blit(text, (x, y))


    def run(self):
        while self.running:
            self.handle_events()
            self.draw()
            self.draw_board()
            self.draw_pieces()
            pygame.display.flip()
            self.clock.tick(60)  # limit to 60 FPS

        pygame.quit()
        sys.exit()


    
    

gui = ChessGUI()
gui.run()
