import { forwardRef, useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { type Skill } from '../data/skills'
import { CategoryShape } from './CategoryShape'
import { getCopyCount } from '../lib/analytics'
import { HoverPreview } from './HoverPreview'

interface SkillCardProps {
  skill: Skill
  isSelected?: boolean
  showPopularity?: boolean
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
  function SkillCard({ skill, isSelected = false, showPopularity = false }, ref) {
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
          <div className="flex items-center gap-2">
            <CategoryShape category={skill.category} size={12} />
            {isNew && (
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

        <div className="flex flex-wrap gap-2">
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
