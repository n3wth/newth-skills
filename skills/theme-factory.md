---
name: Theme Factory
version: 1.1.0
author: newth.ai
category: creative
tags:
  - themes
  - styling
  - design-system
compatibility:
  - gemini
  - claude
---

# Theme Factory

Style artifacts with themes. 10 pre-set themes with colors and fonts for slides, docs, reports, and landing pages. Create consistent, professional designs across all your content.

## Triggers

Use this skill when the user requests:
- Applying themes to documents or slides
- Creating consistent styling
- Choosing color palettes
- Selecting font pairings
- Building design systems

Keywords: "theme", "styling", "colors", "fonts", "design system", "palette", "branding", "consistent"

## Features

- **10 Curated Theme Presets**: Professional themes ready to use
- **Color Palette Definitions**: Primary, secondary, accent, and neutral colors
- **Typography Pairings**: Heading and body font combinations
- **Cross-Artifact Consistency**: Apply themes to any document type
- **Design Token System**: Structured variables for easy customization

## Available Themes

### 1. Corporate Blue
Professional and trustworthy, ideal for business documents.
```json
{
  "name": "Corporate Blue",
  "colors": {
    "primary": "#1e3a5f",
    "secondary": "#3d5a80",
    "accent": "#ee6c4d",
    "background": "#ffffff",
    "text": "#293241"
  },
  "fonts": {
    "heading": "Inter",
    "body": "Source Sans Pro"
  }
}
```

### 2. Modern Minimal
Clean and contemporary with subtle contrasts.
```json
{
  "name": "Modern Minimal",
  "colors": {
    "primary": "#000000",
    "secondary": "#333333",
    "accent": "#ff4444",
    "background": "#fafafa",
    "text": "#1a1a1a"
  },
  "fonts": {
    "heading": "Helvetica Neue",
    "body": "Helvetica Neue"
  }
}
```

### 3. Nature Green
Organic and calming, great for sustainability topics.
```json
{
  "name": "Nature Green",
  "colors": {
    "primary": "#2d5a27",
    "secondary": "#4a7c59",
    "accent": "#f4a261",
    "background": "#f8f9f3",
    "text": "#264027"
  },
  "fonts": {
    "heading": "Playfair Display",
    "body": "Lato"
  }
}
```

### 4. Tech Dark
Modern dark mode for technical content.
```json
{
  "name": "Tech Dark",
  "colors": {
    "primary": "#00d4ff",
    "secondary": "#7c3aed",
    "accent": "#10b981",
    "background": "#0f172a",
    "text": "#e2e8f0"
  },
  "fonts": {
    "heading": "JetBrains Mono",
    "body": "Inter"
  }
}
```

### 5. Warm Sunset
Inviting and energetic, perfect for creative projects.
```json
{
  "name": "Warm Sunset",
  "colors": {
    "primary": "#e63946",
    "secondary": "#f4a261",
    "accent": "#2a9d8f",
    "background": "#fff8f0",
    "text": "#1d3557"
  },
  "fonts": {
    "heading": "Poppins",
    "body": "Open Sans"
  }
}
```

### 6. Ocean Calm
Serene and professional, ideal for healthcare or wellness.
```json
{
  "name": "Ocean Calm",
  "colors": {
    "primary": "#0077b6",
    "secondary": "#00b4d8",
    "accent": "#90e0ef",
    "background": "#f0f9ff",
    "text": "#023e8a"
  },
  "fonts": {
    "heading": "Nunito",
    "body": "Nunito Sans"
  }
}
```

### 7. Elegant Purple
Sophisticated and creative, great for luxury brands.
```json
{
  "name": "Elegant Purple",
  "colors": {
    "primary": "#5b21b6",
    "secondary": "#7c3aed",
    "accent": "#fbbf24",
    "background": "#faf5ff",
    "text": "#1e1b4b"
  },
  "fonts": {
    "heading": "Cormorant Garamond",
    "body": "Montserrat"
  }
}
```

### 8. Startup Fresh
Energetic and modern, perfect for tech startups.
```json
{
  "name": "Startup Fresh",
  "colors": {
    "primary": "#6366f1",
    "secondary": "#8b5cf6",
    "accent": "#06b6d4",
    "background": "#ffffff",
    "text": "#1f2937"
  },
  "fonts": {
    "heading": "Plus Jakarta Sans",
    "body": "Inter"
  }
}
```

### 9. Classic Serif
Timeless and authoritative, ideal for academic or legal.
```json
{
  "name": "Classic Serif",
  "colors": {
    "primary": "#1c1c1c",
    "secondary": "#4a4a4a",
    "accent": "#8b0000",
    "background": "#fffef5",
    "text": "#2c2c2c"
  },
  "fonts": {
    "heading": "Merriweather",
    "body": "Georgia"
  }
}
```

### 10. Playful Pop
Fun and vibrant, great for consumer products or events.
```json
{
  "name": "Playful Pop",
  "colors": {
    "primary": "#ff006e",
    "secondary": "#8338ec",
    "accent": "#ffbe0b",
    "background": "#ffffff",
    "text": "#14213d"
  },
  "fonts": {
    "heading": "Fredoka One",
    "body": "Quicksand"
  }
}
```

## Usage Examples

### Apply theme to CSS

```css
:root {
  /* Corporate Blue Theme */
  --color-primary: #1e3a5f;
  --color-secondary: #3d5a80;
  --color-accent: #ee6c4d;
  --color-background: #ffffff;
  --color-text: #293241;
  
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Source Sans Pro', sans-serif;
}

h1, h2, h3 {
  font-family: var(--font-heading);
  color: var(--color-primary);
}

body {
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-background);
}

.accent {
  color: var(--color-accent);
}
```

### Generate theme variations

```python
def generate_theme_shades(primary_hex):
    """Generate light and dark shades from a primary color."""
    import colorsys
    
    # Convert hex to RGB
    r = int(primary_hex[1:3], 16) / 255
    g = int(primary_hex[3:5], 16) / 255
    b = int(primary_hex[5:7], 16) / 255
    
    # Convert to HSV
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    
    shades = {}
    for name, v_mod in [('50', 0.95), ('100', 0.9), ('200', 0.8), 
                         ('300', 0.7), ('400', 0.6), ('500', 0.5),
                         ('600', 0.4), ('700', 0.3), ('800', 0.2), ('900', 0.1)]:
        new_v = min(1, v + (1 - v) * v_mod) if v_mod > 0.5 else v * (v_mod * 2)
        new_s = s * (0.3 + v_mod * 0.7)
        r2, g2, b2 = colorsys.hsv_to_rgb(h, new_s, new_v)
        shades[name] = '#{:02x}{:02x}{:02x}'.format(
            int(r2 * 255), int(g2 * 255), int(b2 * 255)
        )
    
    return shades

# Usage
shades = generate_theme_shades('#1e3a5f')
print(shades)
```

## Best Practices

1. **Maintain contrast ratios** for accessibility (4.5:1 minimum for text)
2. **Use consistent spacing** based on a scale (4px, 8px, 16px, 24px, 32px)
3. **Limit accent color usage** to calls-to-action and highlights
4. **Test on multiple devices** to ensure colors render consistently
5. **Document your theme** for team consistency
