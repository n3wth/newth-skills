'use client'
import { useState, useCallback } from 'react'
import { type Skill } from '../data/skills'

interface ShareButtonsProps {
  skill: Skill
  className?: string
}

export function ShareButtons({ skill, className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/skill/${skill.id}`
    : `/skill/${skill.id}`
  
  const shareText = `Check out ${skill.name} - ${skill.description}`
  
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [shareUrl])
  
  const handleTwitterShare = useCallback(() => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400')
  }, [shareText, shareUrl])
  
  const handleLinkedInShare = useCallback(() => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400')
  }, [shareUrl])
  
  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: skill.name,
          text: skill.description,
          url: shareUrl,
        })
      } catch {
        // User cancelled or share failed
      }
    }
  }, [skill.name, skill.description, shareUrl])
  
  const supportsNativeShare = typeof navigator !== 'undefined' && 'share' in navigator
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs mr-1" style={{ color: 'var(--color-grey-400)' }}>
        Share:
      </span>
      
      <button
        onClick={handleCopyLink}
        className="p-2 rounded-lg transition-all hover:scale-105"
        style={{ 
          backgroundColor: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
        }}
        title="Copy link"
        aria-label="Copy link to clipboard"
      >
        {copied ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-grey-300)' }}>
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        )}
      </button>
      
      <button
        onClick={handleTwitterShare}
        className="p-2 rounded-lg transition-all hover:scale-105"
        style={{ 
          backgroundColor: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
        }}
        title="Share on X (Twitter)"
        aria-label="Share on X (Twitter)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--color-grey-300)' }}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
      
      <button
        onClick={handleLinkedInShare}
        className="p-2 rounded-lg transition-all hover:scale-105"
        style={{ 
          backgroundColor: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
        }}
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--color-grey-300)' }}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </button>
      
      {supportsNativeShare && (
        <button
          onClick={handleNativeShare}
          className="p-2 rounded-lg transition-all hover:scale-105"
          style={{ 
            backgroundColor: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
          }}
          title="Share"
          aria-label="Share via system share dialog"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-grey-300)' }}>
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      )}
    </div>
  )
}
