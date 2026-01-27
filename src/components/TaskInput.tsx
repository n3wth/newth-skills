import { useState, useRef } from 'react'
import { getSuggestedTasks } from '../lib/recommendations'

interface TaskInputProps {
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
}

export function TaskInput({ value, onChange, onFocus, onBlur }: TaskInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestedTasks = getSuggestedTasks()

  const showSuggestions = isFocused && !value

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false)
    }, 150)
    onBlur?.()
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div
        className={`
          relative overflow-hidden rounded-2xl transition-all duration-300
          ${isFocused ? 'ring-2 ring-white/20' : ''}
        `}
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
        }}
      >
        <div className="flex items-center px-5 py-4">
          <span
            className="text-base md:text-lg font-medium mr-2 whitespace-nowrap"
            style={{ color: 'var(--color-grey-400)' }}
          >
            I want to
          </span>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="add smooth scroll animations..."
            className="flex-1 bg-transparent text-base md:text-lg font-medium text-white placeholder:text-grey-600 outline-none"
            aria-label="Describe what you want to accomplish"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="ml-2 p-1.5 rounded-full transition-colors hover:bg-white/10"
              style={{ color: 'var(--color-grey-400)' }}
              aria-label="Clear input"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {showSuggestions && (
        <div
          className="absolute top-full left-0 right-0 mt-2 p-3 rounded-xl z-20"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <p
            className="text-xs uppercase tracking-wider mb-2 px-1"
            style={{ color: 'var(--color-grey-600)' }}
          >
            Try something like
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedTasks.map((task) => (
              <button
                key={task}
                type="button"
                onClick={() => handleSuggestionClick(task)}
                className="glass-pill px-3 py-1.5 rounded-full text-sm"
              >
                {task}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
