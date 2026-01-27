import { useState, useCallback, useEffect } from 'react'
import { getSkillVotes, voteForSkill } from '../lib/community'

interface VoteButtonProps {
  skillId: string
  className?: string
  size?: 'sm' | 'md'
}

export function VoteButton({ skillId, className = '', size = 'md' }: VoteButtonProps) {
  const [voteState, setVoteState] = useState({ votes: 0, hasVoted: false })
  const [isAnimating, setIsAnimating] = useState(false)
  
  useEffect(() => {
    setVoteState(getSkillVotes(skillId))
  }, [skillId])
  
  const handleVote = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsAnimating(true)
    const newState = voteForSkill(skillId)
    setVoteState(newState)
    
    setTimeout(() => setIsAnimating(false), 300)
  }, [skillId])
  
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-1 text-xs gap-1'
    : 'px-3 py-1.5 text-sm gap-1.5'
  
  const iconSize = size === 'sm' ? 12 : 14
  
  return (
    <button
      onClick={handleVote}
      className={`inline-flex items-center rounded-full transition-all ${sizeClasses} ${className} ${isAnimating ? 'scale-110' : ''}`}
      style={{
        backgroundColor: voteState.hasVoted ? 'rgba(168, 85, 247, 0.2)' : 'var(--glass-bg)',
        border: `1px solid ${voteState.hasVoted ? 'rgba(168, 85, 247, 0.4)' : 'var(--glass-border)'}`,
        color: voteState.hasVoted ? '#a855f7' : 'var(--color-grey-300)',
      }}
      title={voteState.hasVoted ? 'Remove vote' : 'Vote for this skill'}
      aria-label={`${voteState.hasVoted ? 'Remove vote from' : 'Vote for'} skill. Current votes: ${voteState.votes}`}
    >
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 24 24" 
        fill={voteState.hasVoted ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={`transition-transform ${isAnimating ? 'scale-125' : ''}`}
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
      <span className="font-medium">{voteState.votes}</span>
    </button>
  )
}
