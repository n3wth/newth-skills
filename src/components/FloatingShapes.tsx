import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { floatingShapes, categoryConfig } from '../config/categories'
import { RenderShape } from './CategoryShape'

export function FloatingShapes() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const shapes = containerRef.current.querySelectorAll('.floating-shape')

    shapes.forEach((shape, i) => {
      // Randomize entrance timing for organic feel
      const entranceDelay = 0.3 + (i * 0.25) + (Math.random() * 0.3)

      // Initial state - scattered and invisible
      gsap.set(shape, {
        opacity: 0,
        scale: 0,
        rotation: Math.random() * 180 - 90,
        y: 50 + Math.random() * 30,
      })

      // Entrance animation - bounce in with varied stagger
      gsap.to(shape, {
        opacity: 1,
        scale: 1,
        rotation: Math.random() * 10 - 5,
        y: 0,
        duration: 1 + Math.random() * 0.5,
        delay: entranceDelay,
        ease: 'elastic.out(1, 0.5)',
      })

      // Continuous floating movement
      gsap.to(shape, {
        x: `random(-100, 100)`,
        y: `random(-80, 80)`,
        duration: `random(8, 14)`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.2,
      })

      // Rotation wobble
      gsap.to(shape, {
        rotation: `random(-30, 30)`,
        duration: `random(5, 9)`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.3,
      })

      // Scale breathing
      gsap.to(shape, {
        scale: `random(0.8, 1.2)`,
        duration: `random(4, 7)`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.1,
      })
    })
  }, { scope: containerRef })

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {floatingShapes.map((shape, i) => (
        <div
          key={i}
          className="floating-shape shape-glow absolute hidden md:block"
          style={{
            top: shape.top,
            right: shape.right,
            color: categoryConfig[shape.category]?.color,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          <RenderShape category={shape.category} size={shape.size} />
        </div>
      ))}
    </div>
  )
}
