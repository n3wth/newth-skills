'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getComparisonSkills, clearComparison, removeFromComparison } from '../lib/community'
import { skills } from '../data/skills'

interface ComparisonBarProps {
  onComparisonChange?: () => void
}

export function ComparisonBar({ onComparisonChange }: ComparisonBarProps) {
  const [comparisonSkills, setComparisonSkills] = useState<string[]>(() => getComparisonSkills())
  
  useEffect(() => {
    // Listen for storage changes (from other tabs or components)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'newth-skills-comparison') {
        setComparisonSkills(getComparisonSkills())
      }
    }
    window.addEventListener('storage', handleStorage)
    
    // Poll for changes (for same-tab updates)
    const interval = setInterval(() => {
      setComparisonSkills(getComparisonSkills())
    }, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [])
  
  useEffect(() => {
    onComparisonChange?.()
  }, [comparisonSkills, onComparisonChange])
  
  const handleRemove = useCallback((skillId: string) => {
    removeFromComparison(skillId)
    setComparisonSkills(getComparisonSkills())
  }, [])
  
  const handleClear = useCallback(() => {
    clearComparison()
    setComparisonSkills(getComparisonSkills())
  }, [])
  
  if (comparisonSkills.length === 0) return null
  
  const selectedSkills = comparisonSkills
    .map(id => skills.find(s => s.id === id))
    .filter(Boolean)
  
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-3 py-3 sm:px-4 md:px-6 safe-area-bottom"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        borderTop: '1px solid var(--glass-border)',
        backdropFilter: 'blur(20px)',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hidden">
          <span className="text-[11px] sm:text-xs font-medium shrink-0" style={{ color: 'var(--color-grey-400)' }}>
            Compare ({comparisonSkills.length}/4):
          </span>
          {selectedSkills.map(skill => skill && (
            <div
              key={skill.id}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full shrink-0"
              style={{
                backgroundColor: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <span className="text-[11px] sm:text-xs text-white font-medium max-w-[80px] sm:max-w-none truncate">{skill.name}</span>
              <button
                onClick={() => handleRemove(skill.id)}
                className="hover:opacity-70 transition-opacity p-0.5 min-w-[24px] min-h-[24px] flex items-center justify-center"
                style={{ color: 'var(--color-grey-400)' }}
                aria-label={`Remove ${skill.name} from comparison`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0 justify-end">
          <button
            onClick={handleClear}
            className="px-3 py-2 sm:py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-70 min-h-[40px] sm:min-h-0"
            style={{
              color: 'var(--color-grey-400)',
              border: '1px solid var(--glass-border)',
            }}
          >
            Clear
          </button>
          {comparisonSkills.length >= 2 && (
            <Link
              href={`/compare?skills=${comparisonSkills.join(',')}`}
              className="px-4 py-2 sm:py-1.5 rounded-full text-xs font-medium text-white transition-opacity hover:opacity-90 min-h-[40px] sm:min-h-0 flex items-center justify-center"
              style={{
                backgroundColor: '#22c55e',
              }}
            >
              Compare {comparisonSkills.length}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
