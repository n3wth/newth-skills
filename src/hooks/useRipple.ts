import { useCallback, useRef } from 'react'
import gsap from 'gsap'

/**
 * Hook for adding delightful ripple effects on click
 * Creates an expanding circle from click point that fades out
 */
export function useRipple() {
  const containerRef = useRef<HTMLElement>(null)

  const createRipple = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Create ripple element
    const ripple = document.createElement('span')
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: currentColor;
      opacity: 0.15;
      pointer-events: none;
      transform: scale(0);
      left: ${x}px;
      top: ${y}px;
      width: 10px;
      height: 10px;
      margin-left: -5px;
      margin-top: -5px;
    `

    // Ensure container has relative positioning
    const computedStyle = window.getComputedStyle(container)
    if (computedStyle.position === 'static') {
      container.style.position = 'relative'
    }
    container.style.overflow = 'hidden'

    container.appendChild(ripple)

    // Calculate size to cover entire button
    const size = Math.max(rect.width, rect.height) * 2.5

    gsap.to(ripple, {
      scale: size / 10,
      opacity: 0,
      duration: 0.6,
      ease: 'cubic.out',
      onComplete: () => ripple.remove(),
    })
  }, [])

  return { ref: containerRef, onMouseDown: createRipple }
}
