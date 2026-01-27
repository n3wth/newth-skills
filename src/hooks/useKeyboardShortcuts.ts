import { useEffect, useCallback, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { categories } from '../data/skills'

interface UseKeyboardShortcutsOptions {
  onFocusSearch?: () => void
  onClearSearch?: () => void
  onCategoryChange?: (categoryId: string) => void
  onNavigateSkill?: (direction: 'up' | 'down') => void
  filteredSkillsCount?: number
  selectedIndex?: number
}

interface UseKeyboardShortcutsReturn {
  showHelp: boolean
  setShowHelp: (show: boolean) => void
  selectedIndex: number
  setSelectedIndex: (index: number) => void
}

export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions = {}): UseKeyboardShortcutsReturn {
  const {
    onFocusSearch,
    onClearSearch,
    onCategoryChange,
    onNavigateSkill,
    filteredSkillsCount = 0,
    selectedIndex: externalSelectedIndex,
  } = options

  const navigate = useNavigate()
  const location = useLocation()
  const [showHelp, setShowHelp] = useState(false)
  const [internalSelectedIndex, setInternalSelectedIndex] = useState(-1)

  const selectedIndex = externalSelectedIndex ?? internalSelectedIndex
  const setSelectedIndex = setInternalSelectedIndex

  const isTyping = useCallback(() => {
    const activeElement = document.activeElement
    if (!activeElement) return false
    
    const tagName = activeElement.tagName.toLowerCase()
    const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select'
    const isContentEditable = activeElement.getAttribute('contenteditable') === 'true'
    
    return isInput || isContentEditable
  }, [])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (showHelp && event.key === 'Escape') {
      event.preventDefault()
      setShowHelp(false)
      return
    }

    if (event.key === '?' && !isTyping()) {
      event.preventDefault()
      setShowHelp(prev => !prev)
      return
    }

    if (showHelp) return

    if (isTyping()) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClearSearch?.()
        const activeElement = document.activeElement as HTMLElement
        activeElement?.blur()
      }
      return
    }

    switch (event.key) {
      case '/':
        event.preventDefault()
        onFocusSearch?.()
        break

      case 'Escape':
        event.preventDefault()
        onClearSearch?.()
        setSelectedIndex(-1)
        break

      case '1':
      case '2':
      case '3':
      case '4':
      case '5': {
        const index = parseInt(event.key) - 1
        if (index < categories.length && onCategoryChange) {
          event.preventDefault()
          onCategoryChange(categories[index].id)
          setSelectedIndex(-1)
        }
        break
      }

      case 'j':
      case 'ArrowDown':
        event.preventDefault()
        if (filteredSkillsCount > 0) {
          const newIndex = selectedIndex < filteredSkillsCount - 1 ? selectedIndex + 1 : 0
          setSelectedIndex(newIndex)
          onNavigateSkill?.('down')
        }
        break

      case 'k':
      case 'ArrowUp':
        event.preventDefault()
        if (filteredSkillsCount > 0) {
          const newIndex = selectedIndex > 0 ? selectedIndex - 1 : filteredSkillsCount - 1
          setSelectedIndex(newIndex)
          onNavigateSkill?.('up')
        }
        break

      case 'Enter':
        break

      case 'Backspace':
        if (location.pathname.startsWith('/skill/')) {
          event.preventDefault()
          navigate('/')
        }
        break
    }
  }, [
    showHelp,
    isTyping,
    onFocusSearch,
    onClearSearch,
    onCategoryChange,
    onNavigateSkill,
    filteredSkillsCount,
    selectedIndex,
    location.pathname,
    navigate,
    setSelectedIndex,
  ])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return {
    showHelp,
    setShowHelp,
    selectedIndex,
    setSelectedIndex,
  }
}
