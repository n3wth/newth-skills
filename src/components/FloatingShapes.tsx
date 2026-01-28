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
    const ctx = gsap.context(() => {
      // Stagger entrance of shapes
      gsap.fromTo(
        shapes,
        {
          opacity: 0,
        },
        {
          opacity: 0.6,
          duration: 1.2,
          delay: (i: number) => i * 0.1,
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
            x: `random(-60, 60)`,
            duration: 12 + i * 1.5,
            ease: 'sine.inOut',
          },
          0
        )

        timeline.to(
          shape,
          {
            y: `random(-40, 40)`,
            duration: 14 + i * 1.8,
            ease: 'sine.inOut',
          },
          0
        )

        timeline.to(
          shape,
          {
            rotation: `random(-20, 20)`,
            duration: 16 + i * 2,
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
      {floatingShapes.map((shape, i) => (
        <div
          key={i}
          className="floating-shape absolute hidden md:block"
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
