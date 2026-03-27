#!/usr/bin/env python3
"""
Convert .drawio diagrams to .png and inject image references into ETAPA_1.md.

Requirements:
    pip install Pillow

Usage:
    # Using draw.io CLI (recommended — best quality):
    python scripts/convert_drawio_to_png.py

    # If draw.io CLI is not installed, use --fallback to generate
    # placeholder PNGs from the XML metadata:
    python scripts/convert_drawio_to_png.py --fallback

The script will:
  1. Find all .drawio files in docs/diagrams/
  2. Export each to .png (same directory)
  3. Update docs/ETAPA_1.md to embed the PNG images inline

Draw.io CLI install (Linux):
    sudo snap install drawio
    # or download AppImage from https://github.com/jgraph/drawio-desktop/releases
"""

import argparse
import os
import re
import shutil
import subprocess
import sys
import textwrap
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
DIAGRAMS_DIR = PROJECT_ROOT / "docs" / "diagrams"
ETAPA_MD = PROJECT_ROOT / "docs" / "ETAPA_1.md"

# Map: drawio basename (without extension) → section heading in ETAPA_1.md
DIAGRAM_MAP = {
    "01_visao_geral_contratos": "### 2.1 Visão Geral dos Contratos",
    "02_fluxo_interacoes": "### 2.2 Fluxo de Interações entre Contratos",
    "03_ordem_deploy": "### 2.3 Ordem de Deploy",
    "04_estrutura_diretorios": "### 2.4 Estrutura de Diretórios",
}

# Friendly titles for fallback placeholder images
DIAGRAM_TITLES = {
    "01_visao_geral_contratos": "Visão Geral dos Contratos",
    "02_fluxo_interacoes": "Fluxo de Interações entre Contratos",
    "03_ordem_deploy": "Ordem de Deploy",
    "04_estrutura_diretorios": "Estrutura de Diretórios",
}


# ---------------------------------------------------------------------------
# Draw.io CLI detection
# ---------------------------------------------------------------------------
def find_drawio_cli() -> str | None:
    """Return the path/command for draw.io CLI, or None."""
    # Common command names
    for cmd in ("drawio", "draw.io", "xdg-drawio"):
        if shutil.which(cmd):
            return cmd
    # Snap path
    snap = "/snap/bin/drawio"
    if os.path.isfile(snap):
        return snap
    # AppImage in common locations
    for d in (Path.home(), Path.home() / "Applications", Path("/opt")):
        for f in d.glob("drawio-*.AppImage"):
            return str(f)
    return None


# ---------------------------------------------------------------------------
# Export via draw.io CLI
# ---------------------------------------------------------------------------
def export_with_drawio(drawio_cmd: str, drawio_file: Path, png_file: Path) -> bool:
    """Export a .drawio file to .png using the draw.io desktop CLI."""
    cmd = [
        drawio_cmd,
        "--export",
        "--format", "png",
        "--border", "10",
        "--scale", "2",
        "--output", str(png_file),
        str(drawio_file),
    ]
    print(f"  $ {' '.join(cmd)}")
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=60,
        )
        if result.returncode == 0:
            print(f"  ✓ {png_file.name} ({png_file.stat().st_size:,} bytes)")
            return True
        else:
            print(f"  ✗ drawio export failed: {result.stderr.strip()}")
            return False
    except FileNotFoundError:
        print(f"  ✗ Command not found: {drawio_cmd}")
        return False
    except subprocess.TimeoutExpired:
        print(f"  ✗ Timeout exporting {drawio_file.name}")
        return False


# ---------------------------------------------------------------------------
# Fallback: generate a placeholder PNG with diagram name
# ---------------------------------------------------------------------------
def extract_diagram_name(drawio_file: Path) -> str:
    """Extract the diagram name attribute from the .drawio XML."""
    try:
        content = drawio_file.read_text(encoding="utf-8")
        match = re.search(r'<diagram[^>]+name="([^"]+)"', content)
        if match:
            return match.group(1)
    except Exception:
        pass
    return drawio_file.stem


def generate_placeholder_png(drawio_file: Path, png_file: Path) -> bool:
    """Generate a placeholder PNG with the diagram title."""
    if not HAS_PIL:
        print("  ✗ Pillow not installed — cannot generate placeholder.")
        print("    Install with: pip install Pillow")
        return False

    name = DIAGRAM_TITLES.get(drawio_file.stem, extract_diagram_name(drawio_file))
    width, height = 800, 200
    bg_color = (245, 245, 250)
    border_color = (100, 130, 180)
    text_color = (60, 60, 80)

    img = Image.new("RGB", (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    # Border
    draw.rectangle([0, 0, width - 1, height - 1], outline=border_color, width=2)

    # Try to load a reasonable font
    font_title = None
    font_sub = None
    for fpath in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/lato/Lato-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ):
        if os.path.isfile(fpath):
            font_title = ImageFont.truetype(fpath, 22)
            font_sub = ImageFont.truetype(fpath.replace("Bold", "Regular"), 14)
            break
    if font_title is None:
        font_title = ImageFont.load_default()
        font_sub = font_title

    # Title
    title_text = name
    bbox = draw.textbbox((0, 0), title_text, font=font_title)
    tw = bbox[2] - bbox[0]
    draw.text(((width - tw) / 2, 50), title_text, fill=text_color, font=font_title)

    # Subtitle
    sub_text = f"(abrir {drawio_file.name} no draw.io para visualizar o diagrama completo)"
    bbox2 = draw.textbbox((0, 0), sub_text, font=font_sub)
    sw = bbox2[2] - bbox2[0]
    draw.text(((width - sw) / 2, 110), sub_text, fill=(120, 120, 140), font=font_sub)

    # Icon hint
    draw.text((20, 15), "📐", fill=text_color, font=font_title)

    img.save(str(png_file), "PNG", optimize=True)
    print(f"  ✓ {png_file.name} (placeholder, {png_file.stat().st_size:,} bytes)")
    return True


# ---------------------------------------------------------------------------
# Update ETAPA_1.md
# ---------------------------------------------------------------------------
def update_markdown(converted: dict[str, Path]) -> None:
    """
    For each diagram, add an inline ![image](diagrams/xxx.png) right after
    the existing drawio reference block.
    """
    if not converted:
        print("\nNo PNGs to inject — ETAPA_1.md not modified.")
        return

    content = ETAPA_MD.read_text(encoding="utf-8")
    changes = 0

    for stem, png_path in converted.items():
        png_rel = f"diagrams/{png_path.name}"
        title = DIAGRAM_TITLES.get(stem, stem)

        # Check if the PNG is already referenced
        if png_rel in content:
            print(f"  – {png_rel} already in ETAPA_1.md, skipping.")
            continue

        # Pattern: find the "> **Diagrama:**" block for this drawio file
        drawio_filename = f"{stem}.drawio"
        # We look for the blockquote that references the drawio file and
        # insert the image right after the "> Abrir com..." line
        pattern = re.compile(
            r'(>\s*\*\*Diagrama:\*\*\s*\[`diagrams/'
            + re.escape(drawio_filename)
            + r'`\][^\n]*\n'        # first line of blockquote
            + r'>\s*Abrir com[^\n]*\n)'  # second line of blockquote
        )
        match = pattern.search(content)
        if match:
            insert_point = match.end()
            image_md = f"\n![{title}]({png_rel})\n"
            content = content[:insert_point] + image_md + content[insert_point:]
            changes += 1
            print(f"  ✓ Injected ![{title}]({png_rel})")
        else:
            print(f"  ✗ Could not find insertion point for {drawio_filename}")

    if changes > 0:
        ETAPA_MD.write_text(content, encoding="utf-8")
        print(f"\n✓ ETAPA_1.md updated with {changes} image(s).")
    else:
        print("\nNo changes needed in ETAPA_1.md.")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(
        description="Convert .drawio diagrams to .png and inject into ETAPA_1.md"
    )
    parser.add_argument(
        "--fallback",
        action="store_true",
        help="Generate placeholder PNGs if draw.io CLI is not available",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Re-export even if .png already exists",
    )
    args = parser.parse_args()

    print("=" * 60)
    print("  Draw.io → PNG Converter")
    print("=" * 60)
    print(f"  Project root : {PROJECT_ROOT}")
    print(f"  Diagrams dir : {DIAGRAMS_DIR}")
    print(f"  Markdown file: {ETAPA_MD}")
    print()

    if not DIAGRAMS_DIR.is_dir():
        print(f"✗ Diagrams directory not found: {DIAGRAMS_DIR}")
        sys.exit(1)

    if not ETAPA_MD.is_file():
        print(f"✗ ETAPA_1.md not found: {ETAPA_MD}")
        sys.exit(1)

    # Discover .drawio files
    drawio_files = sorted(DIAGRAMS_DIR.glob("*.drawio"))
    if not drawio_files:
        print("✗ No .drawio files found in diagrams directory.")
        sys.exit(1)

    print(f"Found {len(drawio_files)} .drawio file(s):\n")
    for f in drawio_files:
        print(f"  • {f.name}")
    print()

    # Determine export method
    drawio_cmd = find_drawio_cli()
    use_cli = drawio_cmd is not None and not args.fallback

    if use_cli:
        print(f"Using draw.io CLI: {drawio_cmd}\n")
    elif args.fallback:
        print("Using --fallback mode: generating placeholder PNGs.\n")
        if not HAS_PIL:
            print("✗ Pillow is required for fallback mode.")
            print("  Install with: pip install Pillow")
            sys.exit(1)
    else:
        print("✗ draw.io CLI not found.")
        print("  Install draw.io desktop or use --fallback for placeholders.")
        print("  Linux: sudo snap install drawio")
        print("  Or download from: https://github.com/jgraph/drawio-desktop/releases")
        sys.exit(1)

    # Convert each file
    converted: dict[str, Path] = {}

    for drawio_file in drawio_files:
        stem = drawio_file.stem
        png_file = drawio_file.with_suffix(".png")

        print(f"[{stem}]")

        if png_file.exists() and not args.force:
            print(f"  – {png_file.name} already exists (use --force to re-export)")
            converted[stem] = png_file
            continue

        if use_cli:
            ok = export_with_drawio(drawio_cmd, drawio_file, png_file)
        else:
            ok = generate_placeholder_png(drawio_file, png_file)

        if ok:
            converted[stem] = png_file

    print()

    # Update ETAPA_1.md
    print("Updating ETAPA_1.md...")
    update_markdown(converted)

    print("\nDone.")


if __name__ == "__main__":
    main()
