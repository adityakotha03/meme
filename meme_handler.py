import os
import random
from PIL import Image
import pygame           #pyinstaller --onefile meme_handler.py

WINDOW_WIDTH, WINDOW_HEIGHT = 400, 600
BLOCK_COLUMNS, BLOCK_ROWS = 4, 10
BACKGROUND_COLOR = (255, 255, 255)  # White background
TEXT_COLOR = (0, 0, 0)
FPS = 60

def decode_from_meme(input_file, output_file):
    # Load the image
    img = Image.open(input_file)
    orig_width, orig_height = img.size
    block_width, block_height = orig_width // BLOCK_COLUMNS, orig_height // BLOCK_ROWS

    # Initialize Pygame
    pygame.init()
    screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT + 50))  # Extra space for text
    pygame.display.set_caption("Image Tetris")
    clock = pygame.time.Clock()

    scale_x, scale_y = WINDOW_WIDTH / orig_width, WINDOW_HEIGHT / orig_height

    # Split the image into 4x10 blocks
    blocks = []
    for y in range(BLOCK_ROWS):
        for x in range(BLOCK_COLUMNS):
            block = img.crop((x * block_width, y * block_height, 
                              (x + 1) * block_width, (y + 1) * block_height))
            blocks.append(block)

    # Shuffle the blocks
    # random.shuffle(blocks)

    # Game variables
    current_block = None
    current_x, current_y = 1, 0
    grid = [[None for _ in range(BLOCK_COLUMNS)] for _ in range(BLOCK_ROWS)]
    game_over = False
    font = pygame.font.Font(None, 36)

    def new_block():
        nonlocal current_block, current_x, current_y
        if blocks:
            current_block = blocks.pop()
            current_x = BLOCK_COLUMNS // 2
            current_y = 0
        else:
            return False
        return True

    def draw_grid():
        for y, row in enumerate(grid):
            for x, block in enumerate(row):
                if block:
                    block_surface = pygame.image.fromstring(block.tobytes(), block.size, block.mode)
                    block_surface = pygame.transform.scale(
                        block_surface, (int(block_width * scale_x), int(block_height * scale_y))
                    )
                    screen.blit(block_surface, (x * block_width * scale_x, y * block_height * scale_y))

    def draw_current_block():
        if current_block:
            block_surface = pygame.image.fromstring(current_block.tobytes(), current_block.size, current_block.mode)
            block_surface = pygame.transform.scale(
                block_surface, (int(block_width * scale_x), int(block_height * scale_y))
            )
            screen.blit(block_surface, (current_x * block_width * scale_x, current_y * block_height * scale_y))

    def check_collision(x, y):
        if x < 0 or x >= BLOCK_COLUMNS or y >= BLOCK_ROWS:
            return True
        if y >= 0 and grid[y][x]:
            return True
        return False

    def place_block():
        grid[current_y][current_x] = current_block
        return new_block()

    new_block()

    # Show instructions
    screen.fill(BACKGROUND_COLOR)
    instructions = [
        "Image Tetris Instructions:",
        "Left Arrow: Move Left",
        "Right Arrow: Move Right",
        "Down Arrow: Move Down",
        "Space: Drop Block",
        "Press any key to start"
    ]
    for i, line in enumerate(instructions):
        text = font.render(line, True, TEXT_COLOR)
        screen.blit(text, (10, 10 + i * 40))
    pygame.display.flip()
    
    waiting = True
    while waiting:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                return
            if event.type == pygame.KEYDOWN:
                waiting = False

    # Game loop
    running = True
    while running and not game_over:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT and not check_collision(current_x - 1, current_y):
                    current_x -= 1
                elif event.key == pygame.K_RIGHT and not check_collision(current_x + 1, current_y):
                    current_x += 1
                elif event.key == pygame.K_DOWN and not check_collision(current_x, current_y + 1):
                    current_y += 1
                elif event.key == pygame.K_SPACE:
                    while not check_collision(current_x, current_y + 1):
                        current_y += 1
                    if not place_block():
                        running = False

        if not check_collision(current_x, current_y + 1):
            current_y += 1
        else:
            if not place_block():
                running = False

        screen.fill(BACKGROUND_COLOR)
        draw_grid()
        draw_current_block()

        # Display remaining blocks
        text = font.render(f"Remaining blocks: {len(blocks)}", True, TEXT_COLOR)
        screen.blit(text, (10, WINDOW_HEIGHT + 10))

        pygame.display.flip()
        clock.tick(5)  # Adjust game speed

    # Game over
    screen.fill(BACKGROUND_COLOR)
    if len(blocks) == 0:
        text = font.render("Congratulations! You completed the image!", True, (0, 255, 0))
    else:
        text = font.render("Game Over! Saving current progress...", True, (255, 0, 0))
    screen.blit(text, (WINDOW_WIDTH // 2 - text.get_width() // 2, WINDOW_HEIGHT // 2))
    pygame.display.flip()
    pygame.time.wait(3000)

    # Save the arranged image
    arranged_img = Image.new('RGB', (orig_width, orig_height))
    for y, row in enumerate(grid):
        for x, block in enumerate(row):
            if block:
                arranged_img.paste(block, (x * block_width, y * block_height))
    arranged_img.save(output_file)

    pygame.quit()

def main():
    if len(sys.argv) != 2:
        print("Usage: meme_handler.py <file.meme>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = input_file.replace(".meme", ".jpg")

    decode_from_meme(input_file, output_file)

if __name__ == "__main__":
    main()