import { forwardRef, useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { type Skill } from '../data/skills'
import { CategoryShape } from './CategoryShape'
import { CompatibilityMatrix } from './CompatibilityMatrix'
import { getCopyCount } from '../lib/analytics'
import { HoverPreview } from './HoverPreview'

interface SkillCardProps {
  skill: Skill
  isSelected?: boolean
  showPopularity?: boolean
  isTrending?: boolean
  isPopular?: boolean
  showContributor?: boolean
}

function isRecentlyUpdated(lastUpdated: string): boolean {
  const updateDate = new Date(lastUpdated)
  const now = new Date()
  const daysDiff = Math.floor((now.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24))
  return daysDiff <= 30
}

// Check if device supports hover (desktop)
function supportsHover(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(hover: hover)').matches
}

export const SkillCard = forwardRef<HTMLAnchorElement, SkillCardProps>(
  function SkillCard({ skill, isSelected = false, showPopularity = false, isTrending = false, isPopular = false, showContributor = true }, ref) {
    const copyCount = showPopularity ? getCopyCount(skill.id) : 0
    const isNew = isRecentlyUpdated(skill.lastUpdated)
    const [showPreview, setShowPreview] = useState(false)
    const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)
    const cardRef = useRef<HTMLAnchorElement | null>(null)
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Combine refs
    const setRefs = useCallback(
      (element: HTMLAnchorElement | null) => {
        cardRef.current = element
        if (typeof ref === 'function') {
          ref(element)
        } else if (ref) {
          ref.current = element
        }
      },
      [ref]
    )

    const handleMouseEnter = useCallback(() => {
      if (!supportsHover()) return

      // Clear any leave timeout
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current)
        leaveTimeoutRef.current = null
      }

      // Delay showing preview to avoid flicker on quick mouse movements
      hoverTimeoutRef.current = setTimeout(() => {
        if (cardRef.current) {
          setAnchorRect(cardRef.current.getBoundingClientRect())
          setShowPreview(true)
        }
      }, 300)
    }, [])

    const handleMouseLeave = useCallback(() => {
      // Clear enter timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }

      // Delay hiding to allow moving mouse to preview
      leaveTimeoutRef.current = setTimeout(() => {
        setShowPreview(false)
      }, 150)
    }, [])

    const handlePreviewMouseEnter = useCallback(() => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current)
        leaveTimeoutRef.current = null
      }
    }, [])

    const handlePreviewMouseLeave = useCallback(() => {
      leaveTimeoutRef.current = setTimeout(() => {
        setShowPreview(false)
      }, 150)
    }, [])

    // Cleanup timeouts on unmount
    useEffect(() => {
      return () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
        if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current)
      }
    }, [])

    // Mobile tap handling
    const [isMobileTapped, setIsMobileTapped] = useState(false)

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      if (supportsHover()) return

      // Prevent navigation on first tap, show preview instead
      if (!isMobileTapped) {
        e.preventDefault()
        if (cardRef.current) {
          setAnchorRect(cardRef.current.getBoundingClientRect())
          setShowPreview(true)
          setIsMobileTapped(true)
        }
      }
    }, [isMobileTapped])

    // Close mobile preview when tapping elsewhere
    useEffect(() => {
      if (!isMobileTapped) return

      const handleTouchOutside = () => {
        setShowPreview(false)
        setIsMobileTapped(false)
      }

      // Add delay to prevent immediate close
      const timeout = setTimeout(() => {
        document.addEventListener('touchstart', handleTouchOutside, { once: true })
      }, 100)

      return () => {
        clearTimeout(timeout)
        document.removeEventListener('touchstart', handleTouchOutside)
      }
    }, [isMobileTapped])

    return (
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          ref={setRefs}
          to={`/skill/${skill.id}`}
          className={`skill-card glass-card group cursor-pointer p-5 md:p-6 block ${isSelected ? 'ring-2 ring-white/40' : ''}`}
          aria-current={isSelected ? 'true' : undefined}
          onTouchStart={handleTouchStart}
        >
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryShape category={skill.category} size={12} />
            {isTrending && (
              <span 
                className="text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ 
                  color: '#f97316',
                  backgroundColor: 'rgba(249, 115, 22, 0.15)',
                  border: '1px solid rgba(249, 115, 22, 0.3)'
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 7.5L10.5 12H14.5L12 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                Trending
              </span>
            )}
            {isPopular && !isTrending && (
              <span 
                className="text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ 
                  color: '#a855f7',
                  backgroundColor: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.3)'
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                </svg>
                Popular
              </span>
            )}
            {isNew && !isTrending && !isPopular && (
              <span 
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ 
                  color: '#22c55e',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}
              >
                New
              </span>
            )}
          </div>
          {showPopularity && copyCount > 0 && (
            <span 
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ 
                color: 'var(--color-grey-300)',
                backgroundColor: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)'
              }}
            >
              {copyCount} {copyCount === 1 ? 'install' : 'installs'}
            </span>
          )}
        </div>

        <h3 className="text-sm md:text-base font-semibold mb-2 text-white group-hover:opacity-70 transition-opacity">
          {skill.name}
        </h3>

        <p
          className="text-xs md:text-sm leading-relaxed mb-3 md:mb-4"
          style={{ color: 'var(--color-grey-200)' }}
        >
          {skill.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {skill.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-[9px] md:text-[10px] uppercase tracking-wider"
              style={{ color: 'var(--color-grey-400)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {skill.compatibility && skill.compatibility.length > 0 && (
          <div className="mb-3">
            <CompatibilityMatrix compatibility={skill.compatibility} size="sm" />
          </div>
        )}

        {showContributor && skill.contributor && (
          <div 
            className="flex items-center gap-2 pt-3 mt-auto"
            style={{ borderTop: '1px solid var(--glass-border)' }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: 'var(--color-grey-500)' }}
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span
              className="text-[10px]"
              style={{ color: 'var(--color-grey-400)' }}
            >
              by {skill.contributor.name}
            </span>
          </div>
        )}
      </Link>

      {showPreview && (
        <div
          onMouseEnter={handlePreviewMouseEnter}
          onMouseLeave={handlePreviewMouseLeave}
        >
          <HoverPreview
            skill={skill}
            isVisible={showPreview}
            anchorRect={anchorRect}
            onClose={() => {
              setShowPreview(false)
              setIsMobileTapped(false)
            }}
          />
        </div>
      )}
    </div>
    )
  }
)
