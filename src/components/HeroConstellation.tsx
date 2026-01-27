import { useRef, useEffect, useCallback, useSyncExternalStore } from 'react'
import { skills } from '../data/skills'
import { categoryConfig } from '../config/categories'

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  mediaQuery.addEventListener('change', callback)
  return () => mediaQuery.removeEventListener('change', callback)
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getReducedMotionServerSnapshot() {
  return false
}

interface ConstellationNode {
  id: string
  icon: string
  category: string
  x: number
  y: number
  size: number
  color: string
  vx: number
  vy: number
}

interface Connection {
  from: number
  to: number
  opacity: number
}

const FEATURED_SKILLS = skills.filter(s => s.featured).slice(0, 8)
const OTHER_SKILLS = skills.filter(s => !s.featured).slice(0, 7)
const CONSTELLATION_SKILLS = [...FEATURED_SKILLS, ...OTHER_SKILLS]

function generateNodes(width: number, height: number): ConstellationNode[] {
  const nodes: ConstellationNode[] = []
  const padding = 60
  const minDistance = 80

  CONSTELLATION_SKILLS.forEach((skill) => {
    let x: number, y: number
    let attempts = 0
    const maxAttempts = 50

    do {
      x = padding + Math.random() * (width - padding * 2)
      y = padding + Math.random() * (height - padding * 2)
      attempts++
    } while (
      attempts < maxAttempts &&
      nodes.some(node => {
        const dx = node.x - x
        const dy = node.y - y
        return Math.sqrt(dx * dx + dy * dy) < minDistance
      })
    )

    const categoryColor = categoryConfig[skill.category]?.color || '#ffffff'
    const isFeatured = skill.featured

    nodes.push({
      id: skill.id,
      icon: skill.icon,
      category: skill.category,
      x,
      y,
      size: isFeatured ? 48 : 32,
      color: categoryColor,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    })
  })

  return nodes
}

function generateConnections(nodes: ConstellationNode[]): Connection[] {
  const connections: Connection[] = []
  const maxDistance = 180

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x
      const dy = nodes[j].y - nodes[i].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < maxDistance) {
        const opacity = 1 - distance / maxDistance
        connections.push({ from: i, to: j, opacity: opacity * 0.4 })
      }
    }
  }

  return connections
}

export function HeroConstellation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<ConstellationNode[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const animationRef = useRef<number>(0)
  const isReadyRef = useRef(false)

  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  )

  const initCanvas = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const canvas = canvasRef.current

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    nodesRef.current = generateNodes(rect.width, rect.height)
    connectionsRef.current = generateConnections(nodesRef.current)
    isReadyRef.current = true
  }, [])

  useEffect(() => {
    initCanvas()

    const handleResize = () => {
      initCanvas()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [initCanvas])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  useEffect(() => {
    if (prefersReducedMotion) return

    const startAnimation = () => {
      if (!isReadyRef.current || !canvasRef.current) {
        animationRef.current = requestAnimationFrame(startAnimation)
        return
      }

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1
      const width = canvas.width / dpr
      const height = canvas.height / dpr

      let time = 0

      const animate = () => {
        ctx.clearRect(0, 0, width, height)
        time += 0.01

        const nodes = nodesRef.current
        const mouse = mouseRef.current

        nodes.forEach((node, i) => {
          node.x += node.vx + Math.sin(time + i * 0.5) * 0.2
          node.y += node.vy + Math.cos(time + i * 0.3) * 0.2

          if (node.x < 40 || node.x > width - 40) node.vx *= -1
          if (node.y < 40 || node.y > height - 40) node.vy *= -1

          node.x = Math.max(40, Math.min(width - 40, node.x))
          node.y = Math.max(40, Math.min(height - 40, node.y))

          if (mouse.active) {
            const dx = mouse.x - node.x
            const dy = mouse.y - node.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const maxInfluence = 200

            if (distance < maxInfluence) {
              const force = (1 - distance / maxInfluence) * 15
              node.x -= (dx / distance) * force * 0.1
              node.y -= (dy / distance) * force * 0.1
            }
          }
        })

        connectionsRef.current = generateConnections(nodes)

        connectionsRef.current.forEach(conn => {
          const from = nodes[conn.from]
          const to = nodes[conn.to]

          ctx.beginPath()
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(to.x, to.y)
          ctx.strokeStyle = `rgba(255, 255, 255, ${conn.opacity * 0.3})`
          ctx.lineWidth = 1
          ctx.stroke()
        })

        nodes.forEach(node => {
          // Icon only - no background
          ctx.font = `${node.size * 0.5}px system-ui`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = node.color
          ctx.fillText(node.icon, node.x, node.y)
        })

        animationRef.current = requestAnimationFrame(animate)
      }

      animate()
    }

    startAnimation()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [prefersReducedMotion])


  if (prefersReducedMotion) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="grid grid-cols-5 gap-8 p-8">
            {CONSTELLATION_SKILLS.slice(0, 10).map(skill => (
              <div
                key={skill.id}
                className="text-2xl"
                style={{ color: categoryConfig[skill.category]?.color }}
              >
                {skill.icon}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-auto"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ mixBlendMode: 'screen' }}
      />
    </div>
  )
}
