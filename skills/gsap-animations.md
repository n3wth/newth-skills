---
name: GSAP Animations
version: 1.2.0
author: newth.ai
category: development
tags:
  - animation
  - gsap
  - scrolltrigger
  - motion
compatibility:
  - gemini
  - claude
---

# GSAP Animations

Create beautiful, production-ready GSAP animations with ScrollTrigger, SplitText, and other plugins. Build scroll effects, text animations, hero entrances, page transitions, and micro-interactions.

## Triggers

Use this skill when the user requests:
- Web animations or motion design
- Scroll effects or scroll-triggered animations
- Text animations or text reveals
- Hero section entrances
- Page transitions
- Micro-interactions
- GSAP, GreenSock, or ScrollTrigger specifically

Keywords: "animate", "animation", "scroll effect", "entrance", "transition", "GSAP", "motion", "fade in", "parallax", "stagger", "reveal"

## Features

- **ScrollTrigger Integration**: Create scroll-based animations with precise trigger points, scrubbing, and pin behaviors
- **SplitText Effects**: Split text into characters, words, or lines for staggered reveal animations
- **Timeline Sequencing**: Build complex, choreographed animation sequences with precise timing control
- **Easing Functions**: Apply sophisticated easing curves for natural-feeling motion
- **Performance Optimized**: Use GSAP's optimized rendering for smooth 60fps animations

## Usage Examples

### Scroll-triggered fade-in

```javascript
gsap.from('.hero', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top 80%',
    end: 'top 20%',
    scrub: 1
  },
  opacity: 0,
  y: 100,
  duration: 1,
  ease: 'power3.out'
})
```

### Staggered text reveal

```javascript
const split = new SplitText('.headline', { type: 'words' })

gsap.from(split.words, {
  opacity: 0,
  y: 50,
  rotationX: -40,
  stagger: 0.1,
  duration: 0.8,
  ease: 'back.out(1.7)'
})
```

### Timeline sequence

```javascript
const tl = gsap.timeline()

tl.from('.logo', { opacity: 0, y: -50, duration: 0.6 })
  .from('.nav-item', { opacity: 0, y: -30, stagger: 0.1 }, '-=0.3')
  .from('.hero-title', { opacity: 0, y: 50, duration: 0.8 }, '-=0.2')
  .from('.hero-subtitle', { opacity: 0, y: 30 }, '-=0.5')
  .from('.cta-button', { opacity: 0, scale: 0.9 }, '-=0.3')
```

## Dependencies

This skill assumes GSAP is available. Include via CDN or npm:

```html
<!-- CDN -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

```bash
# npm
npm install gsap
```

```javascript
// ES modules
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
```

## Best Practices

1. **Register plugins** before using them: `gsap.registerPlugin(ScrollTrigger)`
2. **Use will-change sparingly** - GSAP handles optimization automatically
3. **Clean up ScrollTriggers** when components unmount in React/Vue
4. **Test on mobile** - reduce complexity for better performance on lower-powered devices
5. **Use `ease: 'none'` for scrub animations** when you want linear progress
