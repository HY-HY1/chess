import pygame
import sys

WIDTH, HEIGHT = 640, 640  
BACKGROUND_COLOR = (255, 255, 255) 

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
        SQUARE_SIZE = self.width // 8
        LIGHT = (240, 217, 181)
        DARK = (181, 136, 99)
        ROWS, COLS = 8,8
        
        for row in range(ROWS):
            for col in range(COLS):
                colour = LIGHT if (row + col) % 2 == 0 else DARK
                pygame.draw.rect(self.screen, colour, (col*SQUARE_SIZE, row*SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE))

    def run(self):
        while self.running:
            self.handle_events()
            self.draw()
            self.draw_board()
            pygame.display.flip()
            self.clock.tick(60)  # limit to 60 FPS

        pygame.quit()
        sys.exit()


gui = ChessGUI()
gui.run()
