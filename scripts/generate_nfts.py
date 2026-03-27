#!/usr/bin/env python3
"""Generate 10 pixel art animated GIFs for NFT collection."""
import os
import random
from PIL import Image, ImageDraw, ImageFont

OUTDIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "img")
OUTDIR = os.path.normpath(OUTDIR)
os.makedirs(OUTDIR, exist_ok=True)

THUMBDIR = os.path.join(OUTDIR, "thumbs")
os.makedirs(THUMBDIR, exist_ok=True)
THUMB_SIZE = (64, 64)

# --- Metadata / Signature ---
META_AUTHOR = "Carlos Delfino Carvalho Pinheiro"
META_SITE   = "https://carlosdelfino.eti.br"
META_EMAIL  = "web3@carlosdelfino.eti.br"
SIGNATURE_TEXT = "https://carlosdelfino.eti.br"
SIGNATURE_ANGLE = 12  # slight counter-clockwise tilt (degrees)
SIGNATURE_COLOR = (255, 255, 255, 90)  # semi-transparent white

# Try to load a nice font; fall back to default
try:
    _FONT_PATH = "/usr/share/fonts/truetype/lato/Lato-Medium.ttf"
    SIGNATURE_FONT = ImageFont.truetype(_FONT_PATH, 13)
except (IOError, OSError):
    SIGNATURE_FONT = ImageFont.load_default()

PIXEL = 8          # each "pixel" will be 8x8 real pixels
GRID = 16          # 16x16 grid => 128x128 image
SIZE = PIXEL * GRID
FRAMES = 6
DURATION = 200     # ms per frame

# Color palettes per NFT theme
PALETTES = [
    # 0 - Fire Elemental
    {"bg": (20, 10, 30), "body": [(255, 80, 20), (255, 160, 40), (255, 220, 80), (200, 40, 10)]},
    # 1 - Water Spirit
    {"bg": (10, 10, 40), "body": [(30, 100, 220), (60, 160, 255), (120, 200, 255), (20, 60, 160)]},
    # 2 - Earth Golem
    {"bg": (30, 20, 10), "body": [(120, 80, 40), (160, 120, 60), (90, 60, 30), (60, 40, 20)]},
    # 3 - Lightning Bolt
    {"bg": (10, 10, 30), "body": [(255, 255, 80), (255, 220, 40), (200, 180, 30), (255, 255, 200)]},
    # 4 - Shadow Phantom
    {"bg": (5, 5, 15), "body": [(80, 40, 120), (120, 60, 180), (160, 100, 220), (40, 20, 80)]},
    # 5 - Crystal Gem
    {"bg": (20, 20, 40), "body": [(100, 220, 220), (60, 180, 200), (140, 240, 255), (40, 140, 160)]},
    # 6 - Solar Flare
    {"bg": (30, 10, 10), "body": [(255, 200, 40), (255, 140, 20), (255, 100, 10), (255, 240, 120)]},
    # 7 - Toxic Slime
    {"bg": (10, 20, 10), "body": [(80, 220, 40), (60, 180, 30), (120, 255, 80), (40, 140, 20)]},
    # 8 - Frost Shard
    {"bg": (20, 20, 50), "body": [(180, 220, 255), (140, 200, 240), (220, 240, 255), (100, 160, 220)]},
    # 9 - Magma Core
    {"bg": (20, 5, 5), "body": [(200, 50, 10), (255, 120, 20), (255, 60, 10), (180, 30, 5)]},
]

NAMES = [
    "fire_elemental", "water_spirit", "earth_golem", "lightning_bolt",
    "shadow_phantom", "crystal_gem", "solar_flare", "toxic_slime",
    "frost_shard", "magma_core",
]

# --- Sprite patterns (16x16 grids, 0=bg, 1-4=body color index) ---
# Each creature has a base pattern; animation will shift/pulse colors

def make_symmetric_sprite(seed):
    """Generate a random vertically-symmetric 16x16 sprite pattern."""
    rng = random.Random(seed)
    grid = [[0]*GRID for _ in range(GRID)]
    # body occupies center area
    for y in range(3, 14):
        for x in range(3, 9):
            if rng.random() < 0.55:
                v = rng.randint(1, 4)
                grid[y][x] = v
                grid[y][GRID - 1 - x] = v  # mirror
    # eyes
    grid[5][5] = 0
    grid[5][GRID - 1 - 5] = 0
    return grid


def render_frame(grid, palette, frame_idx):
    """Render one animation frame from a grid + palette."""
    img = Image.new("RGB", (SIZE, SIZE), palette["bg"])
    draw = ImageDraw.Draw(img)
    colors = palette["body"]
    for y in range(GRID):
        for x in range(GRID):
            v = grid[y][x]
            if v > 0:
                # rotate color index per frame for animation effect
                ci = (v - 1 + frame_idx) % len(colors)
                color = colors[ci]
                x0, y0 = x * PIXEL, y * PIXEL
                draw.rectangle([x0, y0, x0 + PIXEL - 1, y0 + PIXEL - 1], fill=color)
    return img


def add_idle_animation(grid, frame_idx):
    """Return a slightly modified grid to simulate idle motion."""
    new_grid = [row[:] for row in grid]
    # subtle vertical bounce: shift body up/down by 1 pixel row on certain frames
    shift = 0
    if frame_idx in (1, 2):
        shift = -1
    elif frame_idx in (4, 5):
        shift = 1
    if shift != 0:
        shifted = [[0]*GRID for _ in range(GRID)]
        for y in range(GRID):
            ny = y + shift
            if 0 <= ny < GRID:
                shifted[ny] = new_grid[y][:]
        return shifted
    return new_grid


def stamp_signature(img):
    """Overlay the artistic signature on the bottom-right of a frame, slightly tilted."""
    # Create a transparent layer for the text
    txt_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    txt_draw = ImageDraw.Draw(txt_layer)

    # Measure text size
    bbox = txt_draw.textbbox((0, 0), SIGNATURE_TEXT, font=SIGNATURE_FONT)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]

    # Render text centered on a small canvas, then rotate
    padding = 10
    text_img = Image.new("RGBA", (tw + padding * 2, th + padding * 2), (0, 0, 0, 0))
    text_draw = ImageDraw.Draw(text_img)
    text_draw.text((padding, padding), SIGNATURE_TEXT, fill=SIGNATURE_COLOR, font=SIGNATURE_FONT)
    text_img = text_img.rotate(SIGNATURE_ANGLE, expand=True, resample=Image.BICUBIC)

    # Position: bottom-right corner with some margin
    rw, rh = text_img.size
    margin = 4
    pos_x = img.width - rw - margin
    pos_y = img.height - rh - margin

    # Composite onto frame
    base = img.convert("RGBA")
    base.paste(text_img, (pos_x, pos_y), text_img)
    return base.convert("RGB")


def build_gif_comment():
    """Build the GIF comment metadata string."""
    return (
        f"Autor: {META_AUTHOR}\n"
        f"Site: {META_SITE}\n"
        f"e-mail: {META_EMAIL}"
    )


def generate_gif(index):
    palette = PALETTES[index]
    name = NAMES[index]
    base_grid = make_symmetric_sprite(seed=index * 42 + 7)

    frames = []
    for f in range(FRAMES):
        g = add_idle_animation(base_grid, f)
        img = render_frame(g, palette, f)
        # Scale up 2x for nicer display (256x256)
        img = img.resize((SIZE * 2, SIZE * 2), Image.NEAREST)
        # Stamp artistic signature on every frame
        img = stamp_signature(img)
        frames.append(img)

    path = os.path.join(OUTDIR, f"nft_{index+1:02d}_{name}.gif")
    gif_comment = build_gif_comment()
    frames[0].save(
        path,
        save_all=True,
        append_images=frames[1:],
        duration=DURATION,
        loop=0,
        optimize=True,
        comment=gif_comment,
    )
    print(f"  ✔ {path}")


def generate_thumbnail(index):
    """Generate a 64x64 animated GIF thumbnail from the full-size NFT GIF."""
    name = NAMES[index]
    src_path = os.path.join(OUTDIR, f"nft_{index+1:02d}_{name}.gif")
    thumb_path = os.path.join(THUMBDIR, f"nft_{index+1:02d}_{name}_thumb.gif")

    src = Image.open(src_path)
    thumb_frames = []
    durations = []

    try:
        while True:
            frame = src.copy().convert("RGB")
            frame = frame.resize(THUMB_SIZE, Image.NEAREST)
            thumb_frames.append(frame)
            durations.append(src.info.get("duration", DURATION))
            src.seek(src.tell() + 1)
    except EOFError:
        pass

    if thumb_frames:
        thumb_frames[0].save(
            thumb_path,
            save_all=True,
            append_images=thumb_frames[1:],
            duration=durations,
            loop=0,
            optimize=True,
        )
    print(f"  ✔ thumb {thumb_path}")


if __name__ == "__main__":
    print("Generating 10 NFT pixel art GIFs...")
    for i in range(10):
        generate_gif(i)
    print("Generating 64x64 thumbnails...")
    for i in range(10):
        generate_thumbnail(i)
    print("Done!")
