'use client'
import { useState, useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import confetti from 'canvas-confetti'
import { trackCopyEvent } from '../lib/analytics'
import type { AssistantId } from '../config/assistants'
import { assistants } from '../config/assistants'

interface CommandBoxProps {
  name: string
  command: string
  primary: boolean
  skillId?: string
  assistantId?: AssistantId | 'all'
}

function getVerificationCommand(assistantId: AssistantId | 'all' | undefined): string {
  if (!assistantId || assistantId === 'all') {
    return 'ls ~/.gemini/skills/ ~/.claude/skills/ 2>/dev/null && echo "Skills installed"'
  }
  
  const skillsDir = assistants[assistantId]?.skillsDir || `~/.${assistantId}/skills`
  return `ls ${skillsDir}/ && echo "Skills installed"`
}

function triggerConfetti() {
  const duration = 2000
  const end = Date.now() + duration

  const colors = ['#30d158', '#64d2ff', '#ffd60a', '#ff6961']

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: colors,
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: colors,
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }

  frame()
}

export function CommandBox({ name, command, primary, skillId, assistantId }: CommandBoxProps) {
  const [copied, setCopied] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [verified, setVerified] = useState(false)
  const copyButtonRef = useRef<HTMLSpanElement>(null)
  const checkmarkRef = useRef<SVGSVGElement>(null)
  const announcementRef = useRef<HTMLDivElement | null>(null)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setShowVerification(true)
    
    // Announce to screen readers
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.className = 'sr-only'
    announcement.textContent = 'Copied command to clipboard'
    document.body.appendChild(announcement)
    announcementRef.current = announcement
    
    setTimeout(() => setCopied(false), 2000)
    
    const trackingId = skillId || name.toLowerCase().replace(/\s+/g, '-')
    trackCopyEvent(trackingId)
  }

  // Clean up announcement on unmount or when it's no longer needed
  useEffect(() => {
    return () => {
      if (announcementRef.current && document.body.contains(announcementRef.current)) {
        document.body.removeChild(announcementRef.current)
        announcementRef.current = null
      }
    }
  }, [])

  // Remove announcement after delay
  useEffect(() => {
    if (announcementRef.current) {
      const announcementElement = announcementRef.current
      const timer = setTimeout(() => {
        if (announcementElement && document.body.contains(announcementElement)) {
          document.body.removeChild(announcementElement)
          announcementRef.current = null
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  // Animate copy feedback with GSAP
  useGSAP(() => {
    if (copied && copyButtonRef.current && checkmarkRef.current) {
      const timeline = gsap.timeline()
      
      // Animate button scale and background
      timeline.fromTo(
        copyButtonRef.current,
        { scale: 1 },
        { 
          scale: 1.1, 
          duration: 0.2, 
          ease: 'back.out(2)',
        }
      )
      
      timeline.to(
        copyButtonRef.current,
        {
          scale: 1,
          duration: 0.15,
          ease: 'power2.out'
        },
        '-=0.05'
      )
      
      // Animate checkmark entrance
      timeline.fromTo(
        checkmarkRef.current,
        { scale: 0, opacity: 0, rotate: -45 },
        { 
          scale: 1, 
          opacity: 1, 
          rotate: 0,
          duration: 0.3, 
          ease: 'back.out(1.7)' 
        },
        '-=0.15'
      )
    }
  }, [copied])

  const handleVerificationCopy = async () => {
    const verifyCommand = getVerificationCommand(assistantId)
    await navigator.clipboard.writeText(verifyCommand)
  }

  const handleItWorked = () => {
    setVerified(true)
    triggerConfetti()
  }

  return (
    <div className="space-y-2">
      <div
        onClick={handleCopy}
        className={`command-box flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 cursor-pointer ${primary ? 'primary' : ''}`}
      >
        <span
          className="label shrink-0 whitespace-nowrap"
          style={{ color: primary ? 'var(--color-accent)' : 'var(--color-grey-400)' }}
        >
          {name}
        </span>
        <code
          className="flex-1 text-xs sm:text-sm overflow-x-auto whitespace-nowrap font-mono"
          style={{ color: 'var(--color-grey-200)' }}
        >
          {command}
        </code>
        <span 
          ref={copyButtonRef}
          className={`label px-3 py-1.5 rounded-lg copy-btn flex items-center gap-1.5 ${copied ? 'copied' : ''}`}
        >
          {copied && (
            <svg
              ref={checkmarkRef}
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {copied ? 'Copied' : 'Copy'}
        </span>
      </div>

      {showVerification && !verified && (
        <div 
          className="verification-section ml-0 sm:ml-4 p-4 rounded-xl"
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
          }}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span 
                className="text-xs font-medium"
                style={{ color: 'var(--color-grey-300)' }}
              >
                Verify installation
              </span>
            </div>
            
            <p 
              className="text-xs"
              style={{ color: 'var(--color-grey-400)' }}
            >
              Run the install command in your terminal, then verify it worked:
            </p>
            
            <div 
              onClick={handleVerificationCopy}
              className="flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <code 
                className="flex-1 text-xs font-mono overflow-x-auto whitespace-nowrap"
                style={{ color: 'var(--color-grey-300)' }}
              >
                {getVerificationCommand(assistantId)}
              </code>
              <span 
                className="label text-xs px-2 py-1 rounded"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--color-grey-400)',
                }}
              >
                Copy
              </span>
            </div>

            <button
              onClick={handleItWorked}
              className="self-start px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'var(--color-sage)',
                color: 'var(--color-bg)',
              }}
            >
              It worked
            </button>
          </div>
        </div>
      )}

      {verified && (
        <div
          className="success-message ml-0 sm:ml-4 p-4 rounded-xl flex items-center gap-3"
          style={{
            background: 'rgba(48, 209, 88, 0.1)',
            border: '1px solid rgba(48, 209, 88, 0.3)',
          }}
        >
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="var(--color-sage)"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex flex-col gap-1">
            <span 
              className="text-sm font-medium"
              style={{ color: 'var(--color-sage)' }}
            >
              You're all set.
            </span>
            <span 
              className="text-xs"
              style={{ color: 'var(--color-grey-400)' }}
            >
              Your AI assistant now has new superpowers.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
