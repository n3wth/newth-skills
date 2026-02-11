'use client'
import { useState } from 'react'
import {
  getApiKey,
  setApiKey,
  clearApiKey,
  hasApiKey,
  getRemainingFreeRuns,
  getFreeRunLimit
} from '../../lib/usageTracker'

export interface ApiKeyModalProps {
  onClose: () => void
  onKeySaved: () => void
}

export function ApiKeyModal({ onClose, onKeySaved }: ApiKeyModalProps) {
  const existingKey = getApiKey()
  const [keyValue, setKeyValue] = useState(existingKey || '')
  const [showKey, setShowKey] = useState(false)
  const remaining = getRemainingFreeRuns()
  const limit = getFreeRunLimit()
  const keyActive = hasApiKey()

  const handleSave = () => {
    if (keyValue.trim()) {
      setApiKey(keyValue.trim())
      onKeySaved()
      onClose()
    }
  }

  const handleClear = () => {
    clearApiKey()
    setKeyValue('')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--glass-border)] rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[var(--color-white)]">AI Settings</h3>
          <button
            onClick={onClose}
            className="p-1 text-[var(--color-grey-400)] hover:text-[var(--color-white)] transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6 p-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg">
          {keyActive ? (
            <div className="flex items-center gap-2 text-sm text-[var(--color-sage)]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Your API key is active. Unlimited runs.
            </div>
          ) : (
            <div className="text-sm text-[var(--color-grey-300)]">
              <span className="font-medium text-[var(--color-white)]">{remaining} of {limit}</span> free runs remaining.
              {remaining === 0 && (
                <span className="text-[var(--color-coral)] ml-1">Add an API key to continue.</span>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="api-key-input" className="block text-sm font-medium text-[var(--color-grey-300)] mb-1.5">
              Gemini API Key
            </label>
            <p className="text-xs text-[var(--color-grey-600)] mb-2">
              Get a free key from{' '}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-sage)] hover:underline"
              >
                Google AI Studio
              </a>
            </p>
            <div className="relative">
              <input
                id="api-key-input"
                type={showKey ? 'text' : 'password'}
                value={keyValue}
                onChange={e => setKeyValue(e.target.value)}
                placeholder="AIza..."
                className="w-full px-4 py-3 pr-12 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-[var(--color-white)] placeholder:text-[var(--color-grey-600)] focus:outline-none focus:border-[var(--glass-highlight)] text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-grey-400)] hover:text-[var(--color-white)] transition-colors"
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-[var(--color-grey-600)]">
            Your key is stored locally in your browser and sent directly to the Gemini API. We never store it on our servers.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          {keyActive && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-3 text-sm text-[var(--color-coral)] border border-[var(--color-coral)]/20 rounded-lg hover:bg-[var(--color-coral)]/10 transition-colors"
            >
              Remove Key
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm text-[var(--color-grey-400)] hover:text-[var(--color-white)] border border-[var(--glass-border)] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!keyValue.trim()}
            className="flex-1 px-4 py-3 text-sm bg-[var(--color-sage)] text-[var(--color-bg)] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  )
}
