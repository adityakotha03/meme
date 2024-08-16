import os
import shutil
import random
from PIL import Image
import pygame

WINDOW_WIDTH, WINDOW_HEIGHT = 500, 600
BLOCK_COLUMNS, BLOCK_ROWS = 4, 6
BACKGROUND_COLOR = (0, 0, 0)  # Black background
TEXT_COLOR = (255, 255, 255)  # White text
ACCENT_COLOR = (50, 50, 50)  # Dark gray for UI elements
BORDER_COLOR = (100, 100, 100)  # Light gray for borders

INITIAL_FALL_SPEED = 1  # Initial speed (blocks per second)
SPEED_INCREASE_RATE = 0.05  # Speed increase per block placed

def encode_to_meme(input_file, output_file):
    shutil.copy(input_file, output_file)

def decode_from_meme(input_file, output_file):
    img = Image.open(input_file)
    orig_width, orig_height = img.size
    block_width, block_height = orig_width // BLOCK_COLUMNS, orig_height // BLOCK_ROWS

    pygame.init()
    screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT + 100))  # Extra space for UI
    pygame.display.set_caption("Image Tetris")
    clock = pygame.time.Clock()

    scale_x, scale_y = WINDOW_WIDTH / orig_width, WINDOW_HEIGHT / orig_height

    blocks = []
    for y in range(BLOCK_ROWS):
        cols = []
        for x in range(BLOCK_COLUMNS):
            block = img.crop((x * block_width, y * block_height, 
                              (x + 1) * block_width, (y + 1) * block_height))
            cols.append(block)
        random.shuffle(cols)
        blocks.extend(cols)

    current_block = None
    current_x, current_y = 1, 0
    grid = [[None for _ in range(BLOCK_COLUMNS)] for _ in range(BLOCK_ROWS)]
    game_over = False
    font = pygame.font.Font(None, 36)
    fall_speed = INITIAL_FALL_SPEED
    fall_timer = 0

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
                else:
                    pygame.draw.rect(screen, ACCENT_COLOR, 
                                     (x * block_width * scale_x, y * block_height * scale_y, 
                                      block_width * scale_x, block_height * scale_y), 1)

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
        nonlocal fall_speed
        grid[current_y][current_x] = current_block
        fall_speed += SPEED_INCREASE_RATE
        return new_block()

    def draw_ui():
        pygame.draw.rect(screen, ACCENT_COLOR, (0, WINDOW_HEIGHT, WINDOW_WIDTH, 100))
        pygame.draw.line(screen, BORDER_COLOR, (0, WINDOW_HEIGHT), (WINDOW_WIDTH, WINDOW_HEIGHT), 2)
        
        remaining_text = font.render(f"Remaining: {len(blocks)}", True, TEXT_COLOR)
        screen.blit(remaining_text, (10, WINDOW_HEIGHT + 10))
        
        speed_text = font.render(f"Speed: {fall_speed:.1f}", True, TEXT_COLOR)
        screen.blit(speed_text, (10, WINDOW_HEIGHT + 50))

    def draw_text_middle(text, size, color, surface, y_offset=0):
        fontpath = None  # Default system font
        font = pygame.font.Font(fontpath, size, bold=False, italic=True)
        label = font.render(text, 1, color)
        surface.blit(label, (WINDOW_WIDTH // 2 - label.get_width() // 2, WINDOW_HEIGHT // 2 + y_offset - label.get_height() // 2))

    def display_instructions():
        screen.fill(BACKGROUND_COLOR)
        instructions = [
            "Image Tetris Instructions:",
            "Left/Right: Move",
            "Down: Soft Drop",
            "Space: Hard Drop",
            "Press any key to start"
        ]
        for i, line in enumerate(instructions):
            draw_text_middle(line, 35, TEXT_COLOR, screen, y_offset=-100 + i * 40)
        pygame.display.flip()
        
        waiting = True
        while waiting:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    return
                if event.type == pygame.KEYDOWN:
                    waiting = False

    new_block()

    display_instructions()

    running = True
    while running and not game_over:
        dt = clock.tick(60) / 1000.0  # Delta time in seconds
        fall_timer += dt

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT and not check_collision(current_x - 1, current_y):
                    current_x -= 1
                elif event.key == pygame.K_RIGHT and not check_collision(current_x + 1, current_y):
                    current_x += 1
                elif event.key == pygame.K_DOWN:
                    if not check_collision(current_x, current_y + 1):
                        current_y += 1
                    fall_timer = 0
                elif event.key == pygame.K_SPACE:
                    while not check_collision(current_x, current_y + 1):
                        current_y += 1
                    if not place_block():
                        running = False
                    fall_timer = 0

        if fall_timer > 1 / fall_speed:
            if not check_collision(current_x, current_y + 1):
                current_y += 1
            else:
                if not place_block():
                    running = False
            fall_timer = 0

        screen.fill(BACKGROUND_COLOR)
        draw_grid()
        draw_current_block()
        draw_ui()

        pygame.display.flip()

    screen.fill(BACKGROUND_COLOR)
    if len(blocks) == 0:
        text = font.render("Congratulations! Image completed!", True, (0, 255, 0))
    else:
        text = font.render("Game Over! Saving progress...", True, (255, 0, 0))
    screen.blit(text, (WINDOW_WIDTH // 2 - text.get_width() // 2, WINDOW_HEIGHT // 2))
    pygame.display.flip()
    pygame.time.wait(2000)

    arranged_img = Image.new('RGB', (orig_width, orig_height))
    for y, row in enumerate(grid):
        for x, block in enumerate(row):
            if block:
                arranged_img.paste(block, (x * block_width, y * block_height))
    arranged_img.save(output_file)

    pygame.quit()

def main():
    encode_to_meme("sample/input.jpg", "sample/output.meme")
    decode_from_meme("sample/output.meme", "sample/decoded.jpg")

if __name__ == "__main__":
    main()