import { useEffect, useRef } from 'react'

interface KeyboardShortcutsHelpProps {
  isOpen: boolean
  onClose: () => void
}

const shortcuts = [
  { key: '/', description: 'Focus search input' },
  { key: 'Escape', description: 'Clear search, close modals' },
  { key: '1-5', description: 'Switch category filters' },
  { key: 'j / k', description: 'Navigate between skills' },
  { key: 'Enter', description: 'Open selected skill' },
  { key: 'Backspace', description: 'Go back from detail page' },
  { key: '?', description: 'Toggle this help' },
]

export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-shortcuts-title"
    >
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div
        ref={overlayRef}
        className="relative glass-card p-6 md:p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 
            id="keyboard-shortcuts-title"
            className="text-lg font-semibold text-white"
          >
            Keyboard Shortcuts
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-grey-400 hover:text-white transition-colors p-1 -m-1"
            aria-label="Close keyboard shortcuts help"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ul className="space-y-3" role="list">
          {shortcuts.map(({ key, description }) => (
            <li key={key} className="flex items-center justify-between gap-4">
              <span 
                className="text-sm"
                style={{ color: 'var(--color-grey-200)' }}
              >
                {description}
              </span>
              <kbd
                className="px-2 py-1 text-xs font-mono rounded"
                style={{
                  backgroundColor: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--color-white)',
                }}
              >
                {key}
              </kbd>
            </li>
          ))}
        </ul>

        <p 
          className="mt-6 text-xs text-center"
          style={{ color: 'var(--color-grey-400)' }}
        >
          Press <kbd className="px-1.5 py-0.5 text-xs font-mono rounded" style={{ backgroundColor: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>?</kbd> to toggle this help
        </p>
      </div>
    </div>
  )
}
