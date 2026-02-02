'use client'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Shape, CompositeShape, type CompositePreset, type ShapeType, type PatternType } from '@n3wth/ui'

interface FloatingElement {
  type: 'shape' | 'composite'
  // For simple shapes
  shapeType?: ShapeType
  color?: string
  pattern?: PatternType
  patternColors?: string[]
  // For composite shapes
  preset?: CompositePreset
  // Common
  size: number
  top: string
  right: string
  rotation?: number
}

// Playful floating shapes configuration
const floatingElements: FloatingElement[] = [
  // Composite shapes - the fun layered ones
  { type: 'composite', preset: 'rainbow-arc', size: 140, top: '15%', right: '8%' },
  { type: 'composite', preset: 'flower', size: 90, top: '55%', right: '5%' },
  { type: 'composite', preset: 'cluster', size: 100, top: '70%', right: '25%' },
  { type: 'composite', preset: 'orbit', size: 80, top: '30%', right: '38%' },

  // Patterned shapes
  { type: 'shape', shapeType: 'circle', color: '#FF6B9D', pattern: 'checkered', patternColors: ['#FF6B9D', '#FFAB91'], size: 100, top: '40%', right: '15%' },
  { type: 'shape', shapeType: 'square', color: '#2ECC71', pattern: 'striped', patternColors: ['#2ECC71', '#20B2AA'], size: 70, top: '75%', right: '12%', rotation: 15 },
  { type: 'shape', shapeType: 'arc', color: '#A78BFA', size: 120, top: '25%', right: '28%', rotation: -20 },

  // Solid accent shapes
  { type: 'shape', shapeType: 'diamond', color: '#FFD93D', size: 50, top: '60%', right: '35%' },
  { type: 'shape', shapeType: 'semicircle', color: '#922B3E', size: 60, top: '80%', right: '40%', rotation: 45 },
  { type: 'shape', shapeType: 'triangle', color: '#5DADE2', size: 45, top: '20%', right: '45%', rotation: 10 },
  { type: 'shape', shapeType: 'star', color: '#F39C12', size: 35, top: '45%', right: '42%' },
]

export function FloatingShapes() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const shapes = containerRef.current.querySelectorAll('.floating-shape')
    const ctx = gsap.context(() => {
      // Stagger entrance of shapes
      gsap.fromTo(
        shapes,
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 0.7,
          scale: 1,
          duration: 1.2,
          delay: (i: number) => i * 0.08,
          ease: 'power2.out',
          stagger: 0.05,
        }
      )

      // Floating animation - layered and orchestrated
      shapes.forEach((shape, i) => {
        // Create a layered floating effect with varied speeds
        const timeline = gsap.timeline({ repeat: -1, yoyo: true })

        timeline.to(
          shape,
          {
            x: `random(-50, 50)`,
            duration: 14 + i * 1.2,
            ease: 'sine.inOut',
          },
          0
        )

        timeline.to(
          shape,
          {
            y: `random(-35, 35)`,
            duration: 16 + i * 1.5,
            ease: 'sine.inOut',
          },
          0
        )

        timeline.to(
          shape,
          {
            rotation: `random(-15, 15)`,
            duration: 18 + i * 1.8,
            ease: 'sine.inOut',
          },
          0
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, { scope: containerRef })

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {floatingElements.map((element, i) => (
        <div
          key={i}
          className="floating-shape absolute hidden lg:block"
          style={{
            top: element.top,
            right: element.right,
            transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
          }}
        >
          {element.type === 'composite' && element.preset ? (
            <CompositeShape preset={element.preset} scale={element.size / 100} />
          ) : (
            <Shape
              type={element.shapeType || 'circle'}
              size={element.size}
              color={element.color}
              pattern={element.pattern}
              patternColors={element.patternColors}
            />
          )}
        </div>
      ))}
    </div>
  )
}
