'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { type Skill } from '../data/skills'
import { CategoryShape } from './CategoryShape'
import { AssistantBadge } from './AssistantBadge'
import { categoryConfig } from '../config/categories'
import { trackCopyEvent } from '../lib/analytics'

interface HoverPreviewProps {
  skill: Skill
  isVisible: boolean
  anchorRect: DOMRect | null
  onClose: () => void
}

export function HoverPreview({ skill, isVisible, anchorRect, onClose }: HoverPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [position, setPosition] = useState<{ top: number; left: number; placement: 'right' | 'left' | 'top' | 'bottom' }>({
    top: 0,
    left: 0,
    placement: 'right'
  })
  const previewRef = useRef<HTMLDivElement>(null)

  const calculatePosition = useCallback(() => {
    if (!anchorRect || !previewRef.current) return

    const preview = previewRef.current
    const previewWidth = 320
    const previewHeight = preview.offsetHeight || 280
    const padding = 12
    const offset = 8

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Calculate available space in each direction (viewport-relative, no scrollY needed for fixed positioning)
    const spaceRight = viewportWidth - anchorRect.right - padding
    const spaceLeft = anchorRect.left - padding
    const spaceBelow = viewportHeight - anchorRect.bottom - padding
    const spaceAbove = anchorRect.top - padding

    let top = 0
    let left = 0
    let placement: 'right' | 'left' | 'top' | 'bottom' = 'right'

    // Prefer right, then left, then bottom, then top
    if (spaceRight >= previewWidth + offset) {
      placement = 'right'
      left = anchorRect.right + offset
      top = anchorRect.top + (anchorRect.height / 2) - (previewHeight / 2)
    } else if (spaceLeft >= previewWidth + offset) {
      placement = 'left'
      left = anchorRect.left - previewWidth - offset
      top = anchorRect.top + (anchorRect.height / 2) - (previewHeight / 2)
    } else if (spaceBelow >= previewHeight + offset) {
      placement = 'bottom'
      left = anchorRect.left + (anchorRect.width / 2) - (previewWidth / 2)
      top = anchorRect.bottom + offset
    } else if (spaceAbove >= previewHeight + offset) {
      placement = 'top'
      left = anchorRect.left + (anchorRect.width / 2) - (previewWidth / 2)
      top = anchorRect.top - previewHeight - offset
    } else {
      placement = 'right'
      left = Math.min(anchorRect.right + offset, viewportWidth - previewWidth - padding)
      top = anchorRect.top
    }

    // Keep within viewport bounds
    left = Math.max(padding, Math.min(left, viewportWidth - previewWidth - padding))
    top = Math.max(padding, Math.min(top, viewportHeight - previewHeight - padding))

    setPosition({ top, left, placement })
  }, [anchorRect])

  useEffect(() => {
    if (isVisible && anchorRect) {
      requestAnimationFrame(calculatePosition)
    }
  }, [isVisible, anchorRect, calculatePosition])

  // Close preview on scroll since anchor position becomes stale
  useEffect(() => {
    if (!isVisible) return
    const handleScroll = () => onClose()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isVisible, onClose])

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const command = `curl -fsSL https://skills.newth.ai/install.sh | bash -s -- ${skill.id}`
    await navigator.clipboard.writeText(command)
    setCopied(true)
    trackCopyEvent(skill.id)
    setTimeout(() => setCopied(false), 2000)
  }

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isVisible) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const config = categoryConfig[skill.category]
  const features = skill.features?.slice(0, 3) || []
  const useCases = skill.useCases?.slice(0, 3) || []
  const previewItems = features.length > 0 ? features : useCases

  return (
    <div
      ref={previewRef}
      className="hover-preview"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 50,
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={(e) => e.stopPropagation()}
      data-placement={position.placement}
    >
      <div className="hover-preview-content">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{
              backgroundColor: config?.color ? `${config.color}15` : 'var(--glass-bg)',
              border: config?.color ? `1px solid ${config.color}30` : '1px solid var(--glass-border)'
            }}
          >
            {skill.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">{skill.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <CategoryShape category={skill.category} size={10} />
              <span
                className="text-[10px] font-medium capitalize"
                style={{ color: config?.color || 'var(--color-grey-400)' }}
              >
                {skill.category}
              </span>
            </div>
          </div>
        </div>

        {/* Compatibility badges */}
        {skill.compatibility && skill.compatibility.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            {skill.compatibility.map(assistantId => (
              <AssistantBadge key={assistantId} assistantId={assistantId} size="sm" showName={false} />
            ))}
          </div>
        )}

        {/* Preview items */}
        {previewItems.length > 0 && (
          <ul className="space-y-1.5 mb-4">
            {previewItems.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-xs"
                style={{ color: 'var(--color-grey-300)' }}
              >
                <span
                  className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: config?.color || 'var(--color-grey-400)' }}
                />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Install button */}
        <button
          onClick={handleCopy}
          className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
            copied ? 'bg-green-500/20 text-green-400' : ''
          }`}
          style={copied ? {} : {
            backgroundColor: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            color: 'var(--color-grey-200)'
          }}
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy Install Command
            </>
          )}
        </button>
      </div>
    </div>
  )
}
