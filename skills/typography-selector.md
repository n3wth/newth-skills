---
name: Typography Selector
version: 1.0.0
author: newth.ai
category: creative
tags:
  - fonts
  - typography
  - design
compatibility:
  - gemini
  - claude
---

# Typography Selector

Browse and select fonts from Google Fonts or curated pairings. Find perfect typography for design projects with harmonious heading and body combinations.

## Triggers

Use this skill when the user requests:
- Selecting fonts for a project
- Finding font pairings
- Choosing typography for websites
- Matching fonts to a brand or mood
- Google Fonts recommendations

Keywords: "font", "typography", "typeface", "Google Fonts", "font pairing", "heading font", "body font"

## Features

- **Google Fonts Integration**: Access to 1500+ free fonts
- **Curated Font Pairings**: Pre-tested combinations that work
- **Heading and Body Combinations**: Complementary type hierarchies
- **Font Weight Recommendations**: Optimal weights for readability
- **Readability Optimization**: Legibility-focused suggestions

## Curated Font Pairings

### Modern & Clean

#### Pairing 1: Inter + Inter
- **Heading**: Inter (600-700 weight)
- **Body**: Inter (400 weight)
- **Use case**: Tech products, SaaS, dashboards
- **Why it works**: Highly legible, neutral, professional

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

h1, h2, h3 { font-family: 'Inter', sans-serif; font-weight: 700; }
body { font-family: 'Inter', sans-serif; font-weight: 400; }
```

#### Pairing 2: Plus Jakarta Sans + Source Sans Pro
- **Heading**: Plus Jakarta Sans (700 weight)
- **Body**: Source Sans Pro (400 weight)
- **Use case**: Startups, modern brands
- **Why it works**: Friendly headings, readable body text

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700&family=Source+Sans+Pro:wght@400;600&display=swap');

h1, h2, h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; }
body { font-family: 'Source Sans Pro', sans-serif; font-weight: 400; }
```

### Classic & Elegant

#### Pairing 3: Playfair Display + Lato
- **Heading**: Playfair Display (700 weight)
- **Body**: Lato (400 weight)
- **Use case**: Editorial, luxury brands, portfolios
- **Why it works**: Sophisticated serif meets clean sans-serif

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap');

h1, h2, h3 { font-family: 'Playfair Display', serif; font-weight: 700; }
body { font-family: 'Lato', sans-serif; font-weight: 400; }
```

#### Pairing 4: Cormorant Garamond + Montserrat
- **Heading**: Cormorant Garamond (600 weight)
- **Body**: Montserrat (400 weight)
- **Use case**: Fashion, art, high-end products
- **Why it works**: Elegant contrast between old and new

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Montserrat:wght@400;500&display=swap');

h1, h2, h3 { font-family: 'Cormorant Garamond', serif; font-weight: 600; }
body { font-family: 'Montserrat', sans-serif; font-weight: 400; }
```

### Friendly & Approachable

#### Pairing 5: Poppins + Open Sans
- **Heading**: Poppins (600-700 weight)
- **Body**: Open Sans (400 weight)
- **Use case**: Consumer apps, friendly brands
- **Why it works**: Geometric warmth with neutral readability

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Open+Sans:wght@400;600&display=swap');

h1, h2, h3 { font-family: 'Poppins', sans-serif; font-weight: 700; }
body { font-family: 'Open Sans', sans-serif; font-weight: 400; }
```

#### Pairing 6: Nunito + Nunito Sans
- **Heading**: Nunito (700 weight)
- **Body**: Nunito Sans (400 weight)
- **Use case**: Education, healthcare, family brands
- **Why it works**: Rounded, friendly, highly readable

```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700&family=Nunito+Sans:wght@400;600&display=swap');

h1, h2, h3 { font-family: 'Nunito', sans-serif; font-weight: 700; }
body { font-family: 'Nunito Sans', sans-serif; font-weight: 400; }
```

### Technical & Developer

#### Pairing 7: JetBrains Mono + Inter
- **Heading**: JetBrains Mono (700 weight)
- **Body**: Inter (400 weight)
- **Use case**: Developer tools, technical docs
- **Why it works**: Monospace authority with readable body

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&family=Inter:wght@400;600&display=swap');

h1, h2, h3 { font-family: 'JetBrains Mono', monospace; font-weight: 700; }
body { font-family: 'Inter', sans-serif; font-weight: 400; }
code { font-family: 'JetBrains Mono', monospace; }
```

#### Pairing 8: Space Grotesk + IBM Plex Sans
- **Heading**: Space Grotesk (700 weight)
- **Body**: IBM Plex Sans (400 weight)
- **Use case**: Tech companies, data products
- **Why it works**: Modern geometric with corporate reliability

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=IBM+Plex+Sans:wght@400;500&display=swap');

h1, h2, h3 { font-family: 'Space Grotesk', sans-serif; font-weight: 700; }
body { font-family: 'IBM Plex Sans', sans-serif; font-weight: 400; }
```

## Typography Scale

### Recommended Sizes (Desktop)

```css
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  --text-6xl: 3.75rem;   /* 60px */
}

h1 { font-size: var(--text-5xl); line-height: 1.1; }
h2 { font-size: var(--text-4xl); line-height: 1.2; }
h3 { font-size: var(--text-3xl); line-height: 1.3; }
h4 { font-size: var(--text-2xl); line-height: 1.4; }
p { font-size: var(--text-base); line-height: 1.6; }
```

### Line Height Guidelines

| Element | Line Height |
|---------|-------------|
| Large headings (h1, h2) | 1.1 - 1.2 |
| Small headings (h3, h4) | 1.2 - 1.3 |
| Body text | 1.5 - 1.7 |
| Captions/small text | 1.4 - 1.5 |

## Font Selection by Mood

| Mood | Heading Font | Body Font |
|------|--------------|-----------|
| Professional | Inter, Helvetica | Inter, Source Sans Pro |
| Friendly | Poppins, Nunito | Open Sans, Lato |
| Elegant | Playfair Display, Cormorant | Lato, Montserrat |
| Technical | JetBrains Mono, Space Grotesk | Inter, IBM Plex Sans |
| Playful | Fredoka One, Quicksand | Quicksand, Nunito |
| Minimal | Helvetica Neue, Inter | Helvetica Neue, Inter |

## Best Practices

1. **Limit to 2 fonts**: One for headings, one for body
2. **Use font weights for hierarchy**: Not different fonts
3. **Test at actual sizes**: Fonts look different at different scales
4. **Check language support**: Ensure fonts support needed characters
5. **Consider loading performance**: Subset fonts when possible
