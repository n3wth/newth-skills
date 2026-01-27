---
name: Canvas Design
version: 1.0.0
author: newth.ai
category: creative
tags:
  - design
  - art
  - visual
  - canvas
compatibility:
  - gemini
  - claude
---

# Canvas Design

Create beautiful visual art in PNG and PDF using design philosophy. Build posters, art pieces, and static visuals with programmatic precision and artistic intent.

## Triggers

Use this skill when the user requests:
- Creating posters or print designs
- Generating visual artwork
- Building static graphics
- Exporting to PNG or PDF
- Applying design principles programmatically

Keywords: "poster", "design", "canvas", "art", "visual", "png", "pdf", "graphic", "print"

## Features

- **High-Resolution PNG Export**: Generate print-quality images
- **PDF Generation**: Create vector-based documents for print
- **Design Philosophy**: Apply composition, color theory, and typography principles
- **Layout Tools**: Grid systems, alignment, and spacing
- **Color Theory**: Harmonious palettes and contrast management

## Usage Examples

### Create a poster with Pillow

```python
from PIL import Image, ImageDraw, ImageFont
import os

def create_poster(width=1200, height=1800, dpi=300):
    # Create high-resolution canvas
    img = Image.new('RGB', (width, height), color='#1a1a2e')
    draw = ImageDraw.Draw(img)
    
    # Load fonts (adjust paths as needed)
    try:
        title_font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 72)
        body_font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 24)
    except:
        title_font = ImageFont.load_default()
        body_font = ImageFont.load_default()
    
    # Add geometric accent
    draw.rectangle([0, 0, width, 200], fill='#e94560')
    
    # Title
    title = "DESIGN\nCONFERENCE"
    draw.multiline_text(
        (60, 250),
        title,
        font=title_font,
        fill='#ffffff',
        spacing=20
    )
    
    # Subtitle
    draw.text(
        (60, 500),
        "Exploring the intersection of art and technology",
        font=body_font,
        fill='#a0a0a0'
    )
    
    # Date and location
    draw.text(
        (60, height - 200),
        "MARCH 15-17, 2026",
        font=body_font,
        fill='#e94560'
    )
    draw.text(
        (60, height - 150),
        "San Francisco, CA",
        font=body_font,
        fill='#ffffff'
    )
    
    return img

# Create and save
poster = create_poster()
poster.save('conference_poster.png', dpi=(300, 300))
```

### Generate PDF with reportlab

```python
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, cm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

def create_pdf_poster(filename='poster.pdf'):
    c = canvas.Canvas(filename, pagesize=A4)
    width, height = A4
    
    # Background
    c.setFillColor(HexColor('#1a1a2e'))
    c.rect(0, 0, width, height, fill=True)
    
    # Accent bar
    c.setFillColor(HexColor('#e94560'))
    c.rect(0, height - 2*cm, width, 2*cm, fill=True)
    
    # Title
    c.setFillColor(HexColor('#ffffff'))
    c.setFont('Helvetica-Bold', 48)
    c.drawString(2*cm, height - 5*cm, "DESIGN")
    c.drawString(2*cm, height - 6.5*cm, "CONFERENCE")
    
    # Body text
    c.setFont('Helvetica', 14)
    c.setFillColor(HexColor('#a0a0a0'))
    c.drawString(2*cm, height - 9*cm, "Exploring the intersection of art and technology")
    
    # Footer
    c.setFillColor(HexColor('#e94560'))
    c.drawString(2*cm, 3*cm, "MARCH 15-17, 2026")
    c.setFillColor(HexColor('#ffffff'))
    c.drawString(2*cm, 2*cm, "San Francisco, CA")
    
    c.save()

create_pdf_poster()
```

### Apply grid-based layout

```python
from PIL import Image, ImageDraw

def create_grid_layout(width=1200, height=1600, cols=12, rows=16, gutter=20):
    img = Image.new('RGB', (width, height), color='#ffffff')
    draw = ImageDraw.Draw(img)
    
    # Calculate cell dimensions
    cell_width = (width - gutter * (cols + 1)) / cols
    cell_height = (height - gutter * (rows + 1)) / rows
    
    # Draw grid (for visualization)
    for col in range(cols):
        for row in range(rows):
            x = gutter + col * (cell_width + gutter)
            y = gutter + row * (cell_height + gutter)
            draw.rectangle(
                [x, y, x + cell_width, y + cell_height],
                outline='#e0e0e0'
            )
    
    return img, cell_width, cell_height

def place_element(draw, col_start, col_span, row_start, row_span, 
                  cell_width, cell_height, gutter, color='#333333'):
    """Place an element on the grid."""
    x = gutter + col_start * (cell_width + gutter)
    y = gutter + row_start * (cell_height + gutter)
    w = col_span * cell_width + (col_span - 1) * gutter
    h = row_span * cell_height + (row_span - 1) * gutter
    
    draw.rectangle([x, y, x + w, y + h], fill=color)

# Usage
img, cw, ch = create_grid_layout()
draw = ImageDraw.Draw(img)

# Place header spanning full width
place_element(draw, 0, 12, 0, 2, cw, ch, 20, '#e94560')

# Place main content area
place_element(draw, 0, 8, 3, 10, cw, ch, 20, '#f5f5f5')

# Place sidebar
place_element(draw, 9, 3, 3, 10, cw, ch, 20, '#1a1a2e')

img.save('grid_layout.png')
```

### Color palette generation

```python
from PIL import Image, ImageDraw
import colorsys

def generate_palette(base_hue, scheme='complementary'):
    """Generate harmonious color palettes."""
    palettes = {
        'complementary': [0, 0.5],
        'triadic': [0, 0.33, 0.67],
        'analogous': [-0.08, 0, 0.08],
        'split_complementary': [0, 0.42, 0.58],
    }
    
    offsets = palettes.get(scheme, [0])
    colors = []
    
    for offset in offsets:
        h = (base_hue + offset) % 1.0
        # Generate light, medium, and dark variants
        for s, v in [(0.7, 0.95), (0.8, 0.75), (0.9, 0.55)]:
            r, g, b = colorsys.hsv_to_rgb(h, s, v)
            colors.append('#{:02x}{:02x}{:02x}'.format(
                int(r * 255), int(g * 255), int(b * 255)
            ))
    
    return colors

def visualize_palette(colors, width=600, height=100):
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)
    
    swatch_width = width // len(colors)
    for i, color in enumerate(colors):
        draw.rectangle(
            [i * swatch_width, 0, (i + 1) * swatch_width, height],
            fill=color
        )
    
    return img

# Generate and visualize
palette = generate_palette(0.6, 'triadic')  # Blue-based triadic
img = visualize_palette(palette)
img.save('color_palette.png')
```

## Dependencies

```bash
pip install Pillow reportlab
```

For advanced typography:
```bash
pip install cairocffi
```

## Best Practices

1. **Use high DPI** (300+) for print-quality output
2. **Apply the rule of thirds** for balanced compositions
3. **Limit color palette** to 3-5 colors for cohesion
4. **Maintain visual hierarchy** through size and contrast
5. **Test on target medium** - screen colors differ from print
