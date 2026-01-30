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
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 md:px-6"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderTop: '1px solid var(--glass-border)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          <span className="text-xs font-medium shrink-0" style={{ color: 'var(--color-grey-400)' }}>
            Compare ({comparisonSkills.length}/4):
          </span>
          {selectedSkills.map(skill => skill && (
            <div 
              key={skill.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0"
              style={{
                backgroundColor: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <span className="text-xs text-white font-medium">{skill.name}</span>
              <button
                onClick={() => handleRemove(skill.id)}
                className="hover:opacity-70 transition-opacity"
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
        
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-70"
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
              className="px-4 py-1.5 rounded-full text-xs font-medium text-white transition-opacity hover:opacity-90"
              style={{
                backgroundColor: '#22c55e',
              }}
            >
              Compare {comparisonSkills.length} Skills
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
