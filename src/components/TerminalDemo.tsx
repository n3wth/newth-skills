'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const COMMAND = 'npx skills add gsap-animations'
const OUTPUT_LINES = [
  'Downloading gsap-animations...',
  'Installed to ~/.claude/skills/gsap-animations/',
  'Done! Use /gsap-animations to get started.',
]
const CHAR_DELAY = 0.05
const PAUSE_AFTER_COMMAND = 0.5
const LINE_DELAY = 0.4

export function TerminalDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const promptRef = useRef<HTMLSpanElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const outputRefs = useRef<(HTMLDivElement | null)[]>([])
  const checkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const prompt = promptRef.current
    const cursor = cursorRef.current
    if (!container || !prompt || !cursor) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      prompt.textContent = `$ ${COMMAND}`
      cursor.style.display = 'none'
      outputRefs.current.forEach(el => {
        if (el) el.style.opacity = '1'
      })
      if (checkRef.current) checkRef.current.style.opacity = '1'
      return
    }

    // Hide elements initially
    prompt.textContent = '$ '
    outputRefs.current.forEach(el => {
      if (el) el.style.opacity = '0'
    })
    if (checkRef.current) checkRef.current.style.opacity = '0'

    const tl = gsap.timeline({ paused: true })

    // Blinking cursor before typing
    tl.fromTo(
      cursor,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, repeat: 2, yoyo: true }
    )

    // Type command character by character
    COMMAND.split('').forEach((char, i) => {
      tl.call(
        () => {
          if (prompt) prompt.textContent = `$ ${COMMAND.slice(0, i + 1)}`
        },
        [],
        `>+=${CHAR_DELAY}`
      )
    })

    // Pause after command
    tl.call(() => {}, [], `>+=${PAUSE_AFTER_COMMAND}`)

    // Hide cursor during output
    tl.set(cursor, { opacity: 0 })

    // Show output lines one by one
    outputRefs.current.forEach((el, i) => {
      if (el) {
        tl.to(el, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          delay: i === 0 ? 0 : LINE_DELAY,
        })
      }
    })

    // Show checkmark
    if (checkRef.current) {
      tl.to(checkRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.7)',
        delay: 0.2,
      })
    }

    // Trigger on scroll
    ScrollTrigger.create({
      trigger: container,
      start: 'top 85%',
      onEnter: () => tl.play(),
      once: true,
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === container) trigger.kill()
      })
    }
  }, [])

  return (
    <div ref={containerRef} className="mt-8 md:mt-10">
      <div
        className="glass-card rounded-xl overflow-hidden"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--glass-border)',
        }}
      >
        {/* Terminal header */}
        <div
          className="flex items-center gap-1.5 px-4 py-3"
          style={{ borderBottom: '1px solid var(--glass-border)' }}
        >
          <span
            className="inline-block rounded-full"
            style={{ width: 8, height: 8, background: '#ff5f57' }}
          />
          <span
            className="inline-block rounded-full"
            style={{ width: 8, height: 8, background: '#febc2e' }}
          />
          <span
            className="inline-block rounded-full"
            style={{ width: 8, height: 8, background: '#28c840' }}
          />
          <span
            className="ml-3 text-[11px] font-mono"
            style={{ color: 'var(--color-grey-400)' }}
          >
            Terminal
          </span>
        </div>

        {/* Terminal body */}
        <div className="p-4 font-mono text-sm leading-relaxed">
          {/* Prompt line */}
          <div className="flex items-center">
            <span ref={promptRef} style={{ color: 'var(--color-grey-200)' }}>
              ${' '}
            </span>
            <span
              ref={cursorRef}
              className="inline-block"
              style={{
                width: 8,
                height: 16,
                background: 'var(--color-grey-200)',
                marginLeft: 1,
              }}
            />
          </div>

          {/* Output lines */}
          <div className="mt-2 space-y-1">
            {OUTPUT_LINES.map((line, i) => (
              <div
                key={i}
                ref={el => { outputRefs.current[i] = el }}
                className="text-xs"
                style={{
                  color: i === OUTPUT_LINES.length - 1
                    ? '#30d158'
                    : 'var(--color-grey-400)',
                  opacity: 0,
                }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Green checkmark */}
          <div
            ref={checkRef}
            className="mt-3 flex items-center gap-2"
            style={{ opacity: 0, transform: 'scale(0.8)' }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#30d158"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span className="text-xs" style={{ color: '#30d158' }}>
              Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
