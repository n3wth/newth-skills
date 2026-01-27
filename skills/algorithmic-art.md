---
name: Algorithmic Art
version: 1.3.0
author: newth.ai
category: creative
tags:
  - p5js
  - generative
  - art
  - creative-coding
compatibility:
  - gemini
  - claude
---

# Algorithmic Art

Create algorithmic art using p5.js with seeded randomness and interactive parameter exploration. Build flow fields, particle systems, and generative visuals with reproducible outputs.

## Triggers

Use this skill when the user requests:
- Generative art or algorithmic visuals
- p5.js sketches or creative coding
- Flow fields or particle systems
- Seeded randomness for reproducible art
- Interactive visual experiments

Keywords: "generative", "algorithmic art", "p5.js", "creative coding", "flow field", "particles", "procedural", "seed", "noise"

## Features

- **Seeded Randomness**: Create reproducible outputs by controlling random seeds
- **Interactive Parameters**: Explore parameter spaces with real-time adjustments
- **Flow Field Generation**: Build mesmerizing vector field visualizations
- **Particle Systems**: Create dynamic particle simulations with physics
- **High-Resolution Export**: Export artwork at print-quality resolutions

## Usage Examples

### Flow field with particles

```javascript
let particles = []
let flowField
let cols, rows
let scale = 20
let seed = 42

function setup() {
  createCanvas(800, 600)
  randomSeed(seed)
  noiseSeed(seed)
  
  cols = floor(width / scale)
  rows = floor(height / scale)
  flowField = new Array(cols * rows)
  
  for (let i = 0; i < 500; i++) {
    particles.push(new Particle())
  }
}

function draw() {
  background(0, 10)
  
  let yoff = 0
  for (let y = 0; y < rows; y++) {
    let xoff = 0
    for (let x = 0; x < cols; x++) {
      let angle = noise(xoff, yoff) * TWO_PI * 2
      let v = p5.Vector.fromAngle(angle)
      flowField[x + y * cols] = v
      xoff += 0.1
    }
    yoff += 0.1
  }
  
  particles.forEach(p => {
    p.follow(flowField)
    p.update()
    p.show()
  })
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height))
    this.vel = createVector(0, 0)
    this.acc = createVector(0, 0)
    this.maxSpeed = 2
    this.prevPos = this.pos.copy()
  }
  
  follow(vectors) {
    let x = floor(this.pos.x / scale)
    let y = floor(this.pos.y / scale)
    let index = x + y * cols
    let force = vectors[index]
    if (force) this.acc.add(force)
  }
  
  update() {
    this.vel.add(this.acc)
    this.vel.limit(this.maxSpeed)
    this.pos.add(this.vel)
    this.acc.mult(0)
    this.edges()
  }
  
  edges() {
    if (this.pos.x > width) this.pos.x = 0
    if (this.pos.x < 0) this.pos.x = width
    if (this.pos.y > height) this.pos.y = 0
    if (this.pos.y < 0) this.pos.y = height
    this.prevPos = this.pos.copy()
  }
  
  show() {
    stroke(255, 50)
    strokeWeight(1)
    point(this.pos.x, this.pos.y)
  }
}
```

### Seeded color palette generator

```javascript
function setup() {
  createCanvas(400, 100)
  colorMode(HSB, 360, 100, 100)
  randomSeed(42) // Change seed for different palettes
  noLoop()
}

function draw() {
  let palette = generatePalette(5)
  let w = width / palette.length
  
  palette.forEach((c, i) => {
    fill(c)
    noStroke()
    rect(i * w, 0, w, height)
  })
}

function generatePalette(count) {
  let baseHue = random(360)
  return Array.from({length: count}, (_, i) => {
    let h = (baseHue + i * 30) % 360
    let s = random(60, 90)
    let b = random(70, 100)
    return color(h, s, b)
  })
}
```

### Recursive tree with variation

```javascript
let seed = 12345

function setup() {
  createCanvas(600, 600)
  randomSeed(seed)
}

function draw() {
  background(20)
  stroke(255)
  translate(width / 2, height)
  branch(120)
  noLoop()
}

function branch(len) {
  strokeWeight(map(len, 10, 120, 1, 4))
  line(0, 0, 0, -len)
  translate(0, -len)
  
  if (len > 10) {
    let angle = random(PI / 6, PI / 4)
    let shrink = random(0.6, 0.8)
    
    push()
    rotate(angle)
    branch(len * shrink)
    pop()
    
    push()
    rotate(-angle)
    branch(len * shrink)
    pop()
  }
}
```

## Dependencies

Include p5.js via CDN or npm:

```html
<!-- CDN -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
```

```bash
# npm
npm install p5
```

## Best Practices

1. **Always set seeds** for reproducible artwork: `randomSeed(seed)` and `noiseSeed(seed)`
2. **Use noise over random** for organic, continuous variations
3. **Export at high resolution** using `pixelDensity(2)` or higher for print
4. **Optimize for performance** by limiting particle counts and using `noStroke()` when possible
5. **Document your seeds** so you can recreate specific outputs
