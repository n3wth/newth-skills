import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Skill } from '../data/skills'

interface UseSkillNavigationOptions {
  skills: Skill[]
  enabled?: boolean
}

/**
 * Hook for keyboard navigation through skill cards.
 * Handles j/k/arrow navigation and Enter to select.
 */
export function useSkillNavigation({ skills, enabled = true }: UseSkillNavigationOptions) {
  const navigate = useNavigate()
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const isKeyboardNav = useRef(false)

  // Reset selection when skills change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [skills])

  // Handle Enter to navigate
  useEffect(() => {
    if (!enabled) return

    const handleEnter = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return
      if (selectedIndex < 0 || selectedIndex >= skills.length) return

      const activeEl = document.activeElement
      const isTyping = activeEl?.tagName.toLowerCase() === 'input' ||
                       activeEl?.tagName.toLowerCase() === 'textarea'
      if (isTyping) return

      e.preventDefault()
      navigate(`/skill/${skills[selectedIndex].id}`)
    }

    window.addEventListener('keydown', handleEnter)
    return () => window.removeEventListener('keydown', handleEnter)
  }, [enabled, selectedIndex, skills, navigate])

  // Track keyboard navigation for scroll behavior
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['j', 'k', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        isKeyboardNav.current = true
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled])

  // Scroll selected card into view
  useEffect(() => {
    if (!isKeyboardNav.current) return
    if (selectedIndex < 0) return

    cardRefs.current[selectedIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
    isKeyboardNav.current = false
  }, [selectedIndex])

  const setCardRef = useCallback((index: number) => (el: HTMLAnchorElement | null) => {
    cardRefs.current[index] = el
  }, [])

  return {
    selectedIndex,
    setSelectedIndex,
    setCardRef,
  }
}
