import { useMemo, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

export function Constellation() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate stars with stable positions
  const stars = useMemo<Star[]>(() => {
    const count = 40
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 4,
    }))
  }, [])

  useGSAP(() => {
    if (!containerRef.current) return

    const dots = containerRef.current.querySelectorAll('.constellation-dot')

    // Staggered entrance
    gsap.fromTo(dots,
      { opacity: 0, scale: 0 },
      {
        opacity: 0.5,
        scale: 1,
        duration: 1,
        stagger: {
          each: 0.05,
          from: 'random',
        },
        ease: 'power2.out',
        delay: 0.5,
      }
    )

    // Subtle drift for depth
    dots.forEach((dot, i) => {
      gsap.to(dot, {
        x: `random(-20, 20)`,
        y: `random(-20, 20)`,
        duration: 15 + Math.random() * 10,
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
      aria-hidden="true"
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="constellation-dot absolute rounded-full bg-white/60"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--twinkle-delay': `${star.delay}s`,
            '--twinkle-duration': `${star.duration}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
