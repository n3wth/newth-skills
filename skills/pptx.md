---
name: Presentations
version: 1.0.0
author: newth.ai
category: documents
tags:
  - powerpoint
  - slides
  - presentations
compatibility:
  - gemini
  - claude
---

# Presentations

Presentation creation, editing, and analysis. Work with layouts, speaker notes, slide design, and content extraction for PowerPoint files.

## Triggers

Use this skill when the user requests:
- Creating PowerPoint presentations
- Editing .pptx files
- Adding slides with layouts
- Managing speaker notes
- Extracting content from presentations

Keywords: "powerpoint", "pptx", "slides", "presentation", "speaker notes", "deck"

## Features

- **Slide Creation**: Build slides with various layouts
- **Speaker Notes**: Add and manage presentation notes
- **Design Themes**: Apply consistent styling across slides
- **Content Extraction**: Pull text and images from existing decks
- **Chart and Image Embedding**: Add visual elements to slides

## Usage Examples

### Create a presentation with python-pptx

```python
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RgbColor

prs = Presentation()

# Title slide
title_slide_layout = prs.slide_layouts[0]
slide = prs.slides.add_slide(title_slide_layout)
title = slide.shapes.title
subtitle = slide.placeholders[1]

title.text = "Q4 Business Review"
subtitle.text = "Strategic Insights and Recommendations"

# Content slide with bullets
bullet_slide_layout = prs.slide_layouts[1]
slide = prs.slides.add_slide(bullet_slide_layout)
shapes = slide.shapes

title_shape = shapes.title
title_shape.text = "Key Achievements"

body_shape = shapes.placeholders[1]
tf = body_shape.text_frame
tf.text = "Revenue growth of 25% YoY"

p = tf.add_paragraph()
p.text = "Customer satisfaction score: 4.8/5"
p.level = 0

p = tf.add_paragraph()
p.text = "New market expansion completed"
p.level = 0

# Add speaker notes
notes_slide = slide.notes_slide
notes_tf = notes_slide.notes_text_frame
notes_tf.text = "Emphasize the revenue growth - this exceeded our target by 5%"

prs.save('quarterly_review.pptx')
```

### Add images and charts

```python
from pptx import Presentation
from pptx.util import Inches
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE

prs = Presentation()
slide = prs.slides.add_slide(prs.slide_layouts[5])  # Blank layout

# Add image
left = Inches(1)
top = Inches(1)
slide.shapes.add_picture('logo.png', left, top, width=Inches(2))

# Add chart
chart_data = CategoryChartData()
chart_data.categories = ['Q1', 'Q2', 'Q3', 'Q4']
chart_data.add_series('Revenue', (1.2, 1.5, 1.8, 2.1))
chart_data.add_series('Profit', (0.3, 0.4, 0.5, 0.7))

x, y, cx, cy = Inches(4), Inches(1.5), Inches(5), Inches(4)
chart = slide.shapes.add_chart(
    XL_CHART_TYPE.COLUMN_CLUSTERED, x, y, cx, cy, chart_data
).chart

chart.has_legend = True
chart.legend.include_in_layout = False

prs.save('presentation_with_chart.pptx')
```

### Extract content from presentation

```python
from pptx import Presentation

def extract_presentation_content(filepath):
    prs = Presentation(filepath)
    content = []
    
    for slide_num, slide in enumerate(prs.slides, 1):
        slide_content = {
            'slide_number': slide_num,
            'texts': [],
            'notes': ''
        }
        
        # Extract text from shapes
        for shape in slide.shapes:
            if hasattr(shape, 'text'):
                if shape.text.strip():
                    slide_content['texts'].append(shape.text)
        
        # Extract speaker notes
        if slide.has_notes_slide:
            notes_slide = slide.notes_slide
            slide_content['notes'] = notes_slide.notes_text_frame.text
        
        content.append(slide_content)
    
    return content

# Usage
content = extract_presentation_content('presentation.pptx')
for slide in content:
    print(f"Slide {slide['slide_number']}:")
    for text in slide['texts']:
        print(f"  - {text[:50]}...")
    if slide['notes']:
        print(f"  Notes: {slide['notes'][:100]}...")
```

### Apply consistent formatting

```python
from pptx import Presentation
from pptx.util import Pt
from pptx.dml.color import RgbColor
from pptx.enum.text import PP_ALIGN

def apply_title_style(shape, font_size=44, color=(0, 51, 102)):
    """Apply consistent title styling."""
    for paragraph in shape.text_frame.paragraphs:
        paragraph.alignment = PP_ALIGN.LEFT
        for run in paragraph.runs:
            run.font.size = Pt(font_size)
            run.font.bold = True
            run.font.color.rgb = RgbColor(*color)

def apply_body_style(shape, font_size=18):
    """Apply consistent body text styling."""
    for paragraph in shape.text_frame.paragraphs:
        for run in paragraph.runs:
            run.font.size = Pt(font_size)
            run.font.color.rgb = RgbColor(51, 51, 51)

# Apply to all slides
prs = Presentation('deck.pptx')
for slide in prs.slides:
    for shape in slide.shapes:
        if shape.has_text_frame:
            if shape == slide.shapes.title:
                apply_title_style(shape)
            else:
                apply_body_style(shape)

prs.save('styled_deck.pptx')
```

## Dependencies

```bash
pip install python-pptx
```

For image processing:
```bash
pip install Pillow
```

## Best Practices

1. **Use slide layouts** for consistent positioning and formatting
2. **Add speaker notes** to guide presentation delivery
3. **Keep text concise** - slides should support, not replace, the speaker
4. **Use high-resolution images** (at least 150 DPI for projected content)
5. **Test on target display** to verify fonts and colors render correctly
