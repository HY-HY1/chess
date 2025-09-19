import pygame
import sys
import json

WIDTH, HEIGHT = 640, 640
ROWS, COLS = 8, 8
SQUARE_SIZE = WIDTH // COLS
LIGHT = (240, 217, 181)
DARK = (181, 136, 99)
BACKGROUND_COLOR = (255,255,255)


with open("../assets/images.json") as f:
    data = json.load(f)   # now `data` is a Python object (list/dict)

PIECE_PATHS = data["pieces"]

class ChessPiece:
    def __init__(self, code, row, col):
        """code = 'wp', 'bn', etc. row/col = board position"""
        self.code = code
        self.row = row
        self.col = col
        self.image = pygame.image.load(PIECE_PATHS[code])
        self.image = pygame.transform.scale(self.image, (SQUARE_SIZE, SQUARE_SIZE))

    def draw(self, screen):
        x = self.col * SQUARE_SIZE
        y = self.row * SQUARE_SIZE
        screen.blit(self.image, (x, y))


class ChessGUI:
    def __init__(self, width=WIDTH, height=HEIGHT):
        pygame.init()
        self.width = width
        self.height = height
        self.screen = pygame.display.set_mode((self.width, self.height))
        pygame.display.set_caption("Chess Game")
        self.clock = pygame.time.Clock()
        self.running = True

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
        for piece in self.pieces:
            piece.draw(self.screen)

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
