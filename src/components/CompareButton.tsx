'use client'
import { useState, useCallback, useEffect } from 'react'
import { isInComparison, addToComparison, removeFromComparison, getComparisonSkills } from '../lib/community'

interface CompareButtonProps {
  skillId: string
  className?: string
  size?: 'sm' | 'md'
  onComparisonChange?: (skills: string[]) => void
}

export function CompareButton({ skillId, className = '', size = 'md', onComparisonChange }: CompareButtonProps) {
  const [inComparison, setInComparison] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  
  useEffect(() => {
    setInComparison(isInComparison(skillId))
  }, [skillId])
  
  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsAnimating(true)
    
    if (inComparison) {
      removeFromComparison(skillId)
      setInComparison(false)
    } else {
      const added = addToComparison(skillId)
      if (added) {
        setInComparison(true)
      }
    }
    
    onComparisonChange?.(getComparisonSkills())
    setTimeout(() => setIsAnimating(false), 300)
  }, [skillId, inComparison, onComparisonChange])
  
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-1 text-xs gap-1'
    : 'px-3 py-1.5 text-sm gap-1.5'
  
  const iconSize = size === 'sm' ? 12 : 14
  
  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center rounded-full transition-all ${sizeClasses} ${className} ${isAnimating ? 'scale-110' : ''}`}
      style={{
        backgroundColor: inComparison ? 'rgba(34, 197, 94, 0.2)' : 'var(--glass-bg)',
        border: `1px solid ${inComparison ? 'rgba(34, 197, 94, 0.4)' : 'var(--glass-border)'}`,
        color: inComparison ? '#22c55e' : 'var(--color-grey-300)',
      }}
      title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
      aria-label={inComparison ? 'Remove from comparison' : 'Add to comparison (max 4)'}
    >
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={`transition-transform ${isAnimating ? 'scale-125' : ''}`}
      >
        {inComparison ? (
          <>
            <polyline points="20 6 9 17 4 12" />
          </>
        ) : (
          <>
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </>
        )}
      </svg>
      <span className="font-medium">{inComparison ? 'Added' : 'Compare'}</span>
    </button>
  )
}
