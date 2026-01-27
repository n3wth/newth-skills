---
name: Slack GIF Creator
version: 1.0.0
author: newth.ai
category: creative
tags:
  - gif
  - slack
  - animation
compatibility:
  - gemini
  - claude
---

# Slack GIF Creator

Create animated GIFs optimized for Slack with constraints, validation tools, and animation concepts. Build engaging, loop-friendly GIFs for team communication.

## Triggers

Use this skill when the user requests:
- Creating GIFs for Slack
- Optimizing animations for messaging platforms
- Building reaction GIFs
- Validating GIF file sizes
- Creating looping animations

Keywords: "gif", "slack", "animation", "reaction", "loop", "emoji", "animated"

## Features

- **Slack-Optimized Constraints**: Stay within file size and dimension limits
- **GIF Validation**: Test compatibility before sharing
- **Frame Rate Optimization**: Balance quality and file size
- **Color Palette Management**: Reduce colors for smaller files
- **Loop-Friendly Design**: Create seamless repeating animations

## Slack GIF Constraints

- **Maximum file size**: 15 MB (recommended: under 5 MB for fast loading)
- **Recommended dimensions**: 480x480 or smaller
- **Frame rate**: 10-15 fps for smooth playback
- **Color palette**: 256 colors maximum (GIF limitation)
- **Duration**: 2-5 seconds for reactions, up to 15 seconds for demos

## Usage Examples

### Create a simple animated GIF with Pillow

```python
from PIL import Image, ImageDraw, ImageFont
import io

def create_celebration_gif(text="Nice!", frames=20, size=(200, 200)):
    images = []
    
    for i in range(frames):
        img = Image.new('RGB', size, color='#4A154B')  # Slack purple
        draw = ImageDraw.Draw(img)
        
        # Bouncing effect
        offset = abs(10 - i % 20) * 2
        
        # Draw text with bounce
        try:
            font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 36)
        except:
            font = ImageFont.load_default()
        
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (size[0] - text_width) // 2
        y = (size[1] - text_height) // 2 - offset
        
        draw.text((x, y), text, font=font, fill='#FFFFFF')
        
        # Add sparkles
        import random
        random.seed(i)
        for _ in range(5):
            sx = random.randint(10, size[0] - 10)
            sy = random.randint(10, size[1] - 10)
            draw.ellipse([sx-2, sy-2, sx+2, sy+2], fill='#E8912D')
        
        images.append(img)
    
    # Save as GIF
    images[0].save(
        'celebration.gif',
        save_all=True,
        append_images=images[1:],
        duration=100,  # 100ms per frame = 10fps
        loop=0  # Loop forever
    )
    
    return 'celebration.gif'

create_celebration_gif()
```

### Optimize GIF file size

```python
from PIL import Image
import subprocess

def optimize_gif(input_path, output_path, max_colors=128, lossy=80):
    """Optimize GIF using gifsicle (must be installed)."""
    
    # First, reduce colors with Pillow
    img = Image.open(input_path)
    
    frames = []
    try:
        while True:
            frame = img.copy()
            # Reduce to limited palette
            frame = frame.convert('P', palette=Image.ADAPTIVE, colors=max_colors)
            frames.append(frame)
            img.seek(img.tell() + 1)
    except EOFError:
        pass
    
    # Save with reduced colors
    temp_path = 'temp_reduced.gif'
    frames[0].save(
        temp_path,
        save_all=True,
        append_images=frames[1:],
        duration=img.info.get('duration', 100),
        loop=0
    )
    
    # Further optimize with gifsicle if available
    try:
        subprocess.run([
            'gifsicle',
            '--optimize=3',
            f'--lossy={lossy}',
            temp_path,
            '-o', output_path
        ], check=True)
    except FileNotFoundError:
        # gifsicle not installed, use Pillow output
        import shutil
        shutil.move(temp_path, output_path)
    
    return output_path

# Usage
optimize_gif('large_animation.gif', 'optimized.gif', max_colors=64)
```

### Validate GIF for Slack

```python
from PIL import Image
import os

def validate_slack_gif(filepath):
    """Check if GIF meets Slack requirements."""
    issues = []
    recommendations = []
    
    # Check file size
    file_size = os.path.getsize(filepath)
    file_size_mb = file_size / (1024 * 1024)
    
    if file_size_mb > 15:
        issues.append(f"File too large: {file_size_mb:.2f}MB (max 15MB)")
    elif file_size_mb > 5:
        recommendations.append(f"Consider reducing size: {file_size_mb:.2f}MB (recommended <5MB)")
    
    # Check dimensions and frame count
    img = Image.open(filepath)
    width, height = img.size
    
    if width > 480 or height > 480:
        recommendations.append(f"Large dimensions: {width}x{height} (recommended 480x480)")
    
    # Count frames
    frame_count = 0
    try:
        while True:
            frame_count += 1
            img.seek(img.tell() + 1)
    except EOFError:
        pass
    
    # Check duration
    duration = img.info.get('duration', 100)
    total_duration = (frame_count * duration) / 1000
    
    if total_duration > 15:
        recommendations.append(f"Long duration: {total_duration:.1f}s (recommended <15s)")
    
    # Calculate effective FPS
    fps = 1000 / duration if duration > 0 else 10
    if fps > 20:
        recommendations.append(f"High frame rate: {fps:.1f}fps (recommended 10-15fps)")
    
    return {
        'valid': len(issues) == 0,
        'issues': issues,
        'recommendations': recommendations,
        'stats': {
            'file_size_mb': round(file_size_mb, 2),
            'dimensions': f"{width}x{height}",
            'frame_count': frame_count,
            'duration_seconds': round(total_duration, 1),
            'fps': round(fps, 1)
        }
    }

# Usage
result = validate_slack_gif('my_animation.gif')
print(f"Valid: {result['valid']}")
print(f"Stats: {result['stats']}")
for issue in result['issues']:
    print(f"ERROR: {issue}")
for rec in result['recommendations']:
    print(f"TIP: {rec}")
```

### Create seamless loop

```python
from PIL import Image

def create_seamless_loop(frames, crossfade_frames=5):
    """Create a seamless loop by crossfading end to beginning."""
    if len(frames) < crossfade_frames * 2:
        return frames
    
    result = frames[:-crossfade_frames]
    
    # Crossfade last frames with first frames
    for i in range(crossfade_frames):
        alpha = i / crossfade_frames
        
        end_frame = frames[-(crossfade_frames - i)]
        start_frame = frames[i]
        
        # Blend frames
        blended = Image.blend(
            end_frame.convert('RGBA'),
            start_frame.convert('RGBA'),
            alpha
        )
        result.append(blended.convert('P', palette=Image.ADAPTIVE))
    
    return result
```

## Dependencies

```bash
pip install Pillow
```

For advanced optimization:
```bash
# macOS
brew install gifsicle

# Ubuntu/Debian
sudo apt-get install gifsicle
```

## Best Practices

1. **Keep it short**: 2-5 seconds is ideal for reactions
2. **Use limited colors**: Fewer colors = smaller file size
3. **Test in Slack**: Preview before sharing widely
4. **Consider accessibility**: Avoid rapid flashing
5. **Design for loop**: Make the end flow into the beginning
