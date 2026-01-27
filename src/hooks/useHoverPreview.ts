import { useState, useRef, useCallback, useEffect } from 'react'

interface UseHoverPreviewOptions {
  enterDelay?: number
  leaveDelay?: number
}

/**
 * Hook for managing hover preview state with delayed show/hide.
 * Handles both desktop hover and mobile tap interactions.
 */
export function useHoverPreview(options: UseHoverPreviewOptions = {}) {
  const { enterDelay = 300, leaveDelay = 150 } = options

  const [showPreview, setShowPreview] = useState(false)
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)
  const [isMobileTapped, setIsMobileTapped] = useState(false)

  const elementRef = useRef<HTMLElement | null>(null)
  const enterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const supportsHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

  const clearTimeouts = useCallback(() => {
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current)
      enterTimeoutRef.current = null
    }
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (!supportsHover) return

    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }

    enterTimeoutRef.current = setTimeout(() => {
      if (elementRef.current) {
        setAnchorRect(elementRef.current.getBoundingClientRect())
        setShowPreview(true)
      }
    }, enterDelay)
  }, [supportsHover, enterDelay])

  const handleMouseLeave = useCallback(() => {
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current)
      enterTimeoutRef.current = null
    }

    leaveTimeoutRef.current = setTimeout(() => {
      setShowPreview(false)
    }, leaveDelay)
  }, [leaveDelay])

  const handlePreviewMouseEnter = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }
  }, [])

  const handlePreviewMouseLeave = useCallback(() => {
    leaveTimeoutRef.current = setTimeout(() => {
      setShowPreview(false)
    }, leaveDelay)
  }, [leaveDelay])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (supportsHover) return

    if (!isMobileTapped) {
      e.preventDefault()
      if (elementRef.current) {
        setAnchorRect(elementRef.current.getBoundingClientRect())
        setShowPreview(true)
        setIsMobileTapped(true)
      }
    }
  }, [supportsHover, isMobileTapped])

  const closePreview = useCallback(() => {
    setShowPreview(false)
    setIsMobileTapped(false)
  }, [])

  // Close mobile preview when tapping elsewhere
  useEffect(() => {
    if (!isMobileTapped) return

    const handleTouchOutside = () => closePreview()

    const timeout = setTimeout(() => {
      document.addEventListener('touchstart', handleTouchOutside, { once: true })
    }, 100)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener('touchstart', handleTouchOutside)
    }
  }, [isMobileTapped, closePreview])

  // Cleanup timeouts on unmount
  useEffect(() => clearTimeouts, [clearTimeouts])

  return {
    // State
    showPreview,
    anchorRect,
    isMobileTapped,
    // Refs
    elementRef,
    // Handlers for the trigger element
    triggerProps: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleTouchStart,
    },
    // Handlers for the preview element
    previewProps: {
      onMouseEnter: handlePreviewMouseEnter,
      onMouseLeave: handlePreviewMouseLeave,
    },
    // Actions
    closePreview,
  }
}
