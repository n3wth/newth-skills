'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { skills, type Skill } from '@/src/data/skills'
import { CategoryShape } from '@/src/components/CategoryShape'
import { CommandBox } from '@/src/components/CommandBox'
import { Nav } from '@/src/components/Nav'
import { Footer } from '@/src/components/Footer'
import { KeyboardShortcutsHelp } from '@/src/components/KeyboardShortcutsHelp'
import { SkillCard } from '@/src/components/SkillCard'
import { AssistantBadge } from '@/src/components/AssistantBadge'
import { ShareButtons } from '@/src/components/ShareButtons'
import { VoteButton } from '@/src/components/VoteButton'
import { CompareButton } from '@/src/components/CompareButton'
import { SkillComments } from '@/src/components/SkillComments'
import { AddToBundleButton } from '@/src/components/AddToBundleButton'
import { categoryConfig } from '@/src/config/categories'
import { assistants, type AssistantId } from '@/src/config/assistants'
import { getSkillInstallCommand } from '@/src/config/commands'
import { useKeyboardShortcuts } from '@/src/hooks'
import { trackViewEvent } from '@/src/lib/analytics'

function getRelatedSkills(currentSkill: Skill, allSkills: Skill[], limit: number = 4): Skill[] {
  const otherSkills = allSkills.filter(s => s.id !== currentSkill.id)

  const scored = otherSkills.map(skill => {
    let score = 0

    if (skill.category === currentSkill.category) {
      score += 10
    }

    const matchingTags = skill.tags.filter(tag => currentSkill.tags.includes(tag))
    score += matchingTags.length * 2

    return { skill, score }
  })

  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map(item => item.skill)
}

type Props = {
  skillId: string
}

export function SkillDetailClient({ skillId }: Props) {
  const skill = skills.find(s => s.id === skillId)
  const { showHelp, setShowHelp } = useKeyboardShortcuts()
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Track view when skill page is visited (only for valid skills)
  useEffect(() => {
    if (skillId && skill) {
      trackViewEvent(skillId)
    }
  }, [skillId, skill])

  const copyPrompt = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }, [])

  if (!skill) {
    return (
      <div className="min-h-screen relative">
        <div className="mesh-gradient" />
        <div className="noise-overlay" />
        <Nav />
        <main className="max-w-6xl mx-auto px-6 md:px-12 pt-28 md:pt-32 pb-24">
          <div className="max-w-4xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-8 text-sm hover:opacity-70 transition-opacity"
              style={{ color: 'var(--color-grey-400)' }}
            >
              <span>&larr;</span> Back to skills
            </Link>

            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">
              Skill Not Found
            </h1>
            <p className="text-lg mb-12" style={{ color: 'var(--color-grey-300)' }}>
              The requested skill doesn't exist or may have been renamed. Browse the full collection to find what you need.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const config = categoryConfig[skill.category]

  return (
    <div className="min-h-screen relative content-loaded">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <Nav />

      <main className="max-w-6xl mx-auto px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div className="max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 text-sm hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-grey-400)' }}
          >
            <span>&larr;</span> Back to skills
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <CategoryShape category={skill.category} size={24} />
            <span
              className="text-sm font-medium capitalize"
              style={{
                color: config?.color || 'var(--color-grey-400)',
              }}
            >
              {skill.category}
            </span>
            {skill.compatibility && skill.compatibility.length > 0 && (
              <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
                {skill.compatibility.map(assistantId => (
                  <AssistantBadge key={assistantId} assistantId={assistantId} size="md" />
                ))}
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
            {skill.name}
          </h1>

          <p
            className="text-lg md:text-xl leading-relaxed mb-6"
            style={{ color: 'var(--color-grey-200)' }}
          >
            {skill.description}
          </p>

          {skill.longDescription && (
            <p
              className="text-base md:text-lg leading-relaxed mb-8"
              style={{ color: 'var(--color-grey-400)' }}
            >
              {skill.longDescription}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-8">
            {skill.tags.map(tag => (
              <span
                key={tag}
                className="text-xs uppercase tracking-wider px-3 py-1.5 rounded-full"
                style={{
                  color: 'var(--color-grey-400)',
                  backgroundColor: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8">
            <VoteButton skillId={skill.id} />
            <CompareButton skillId={skill.id} />
            <AddToBundleButton skillId={skill.id} skillName={skill.name} />
            <div className="hidden sm:block h-4 w-px mx-1" style={{ backgroundColor: 'var(--glass-border)' }} />
            <div className="w-full sm:w-auto mt-2 sm:mt-0">
              <ShareButtons skill={skill} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-12 text-xs sm:text-sm" style={{ color: 'var(--color-grey-400)' }}>
            <span className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Version {skill.version}
            </span>
            <span className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Updated {new Date(skill.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            {skill.contributor && (
              <span className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {skill.contributor.github ? (
                  <a
                    href={`https://github.com/${skill.contributor.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {skill.contributor.name}
                  </a>
                ) : skill.contributor.url ? (
                  <a
                    href={skill.contributor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {skill.contributor.name}
                  </a>
                ) : (
                  skill.contributor.name
                )}
              </span>
            )}
          </div>

          {skill.features && skill.features.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-white mb-6">
                Capabilities
              </h2>
              <div className="grid gap-3">
                {skill.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg transition-colors"
                    style={{
                      backgroundColor: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: config?.color || 'var(--color-grey-400)' }}
                    />
                    <span className="text-sm" style={{ color: 'var(--color-grey-200)' }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skill.useCases && skill.useCases.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-white mb-6">
                Use cases
              </h2>
              <div className="grid gap-3">
                {skill.useCases.map((useCase, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg transition-colors"
                    style={{
                      backgroundColor: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: config?.color || 'var(--color-grey-400)' }}
                    />
                    <span className="text-sm" style={{ color: 'var(--color-grey-200)' }}>
                      {useCase}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skill.samplePrompts && skill.samplePrompts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-white mb-2">
                Try it
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--color-grey-400)' }}>
                Example prompts to use with this skill
              </p>
              <div className="space-y-4">
                {skill.samplePrompts.map((sample, index) => (
                  <div
                    key={index}
                    className="rounded-xl p-5"
                    style={{
                      backgroundColor: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--color-grey-400)' }}>
                        Prompt
                      </span>
                      <button
                        onClick={() => copyPrompt(sample.prompt, index)}
                        className="glass-pill px-3 py-1 rounded-full text-[10px] font-medium transition-colors"
                        style={{
                          color: copiedIndex === index ? '#30d158' : 'var(--color-grey-400)',
                          border: '1px solid var(--glass-border)',
                        }}
                      >
                        {copiedIndex === index ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-sm text-white mb-4 font-mono leading-relaxed">
                      {sample.prompt}
                    </p>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-medium block mb-2" style={{ color: 'var(--color-grey-400)' }}>
                        Output
                      </span>
                      <div className="text-sm leading-relaxed" style={{ color: 'var(--color-grey-200)' }}>
                        {sample.output.split('```').map((part, i) => {
                          if (i % 2 === 1) {
                            // Code block - strip language identifier from first line
                            const lines = part.split('\n')
                            const code = lines.slice(1).join('\n').trim() || part.trim()
                            return (
                              <pre
                                key={i}
                                className="code-block-wrapper font-mono text-xs p-4 rounded-lg my-3 overflow-x-auto"
                                style={{
                                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                  border: '1px solid var(--glass-border)',
                                }}
                              >
                                <code>{code}</code>
                              </pre>
                            )
                          }
                          return <span key={i}>{part}</span>
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass-card p-6 md:p-8">
            <h2 className="text-lg font-medium text-white mb-2">Add to your AI assistant</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--color-grey-400)' }}>
              Choose your AI assistant and run the command in your terminal
            </p>
            <div className="space-y-3">
              {(skill.compatibility || ['gemini', 'claude'] as AssistantId[]).map((assistantId, index) => {
                const assistant = assistants[assistantId]
                const command = getSkillInstallCommand(assistantId, skill.id, skill.skillFile)
                return (
                  <CommandBox
                    key={assistantId}
                    name={assistant.shortName}
                    command={command}
                    primary={index === 0}
                    skillId={`${skill.id}-${assistantId}`}
                  />
                )
              })}
            </div>
          </div>

          <div className="mt-12">
            <SkillComments skillId={skillId} />
          </div>

          {(() => {
            const relatedSkills = getRelatedSkills(skill, skills, 2)
            if (relatedSkills.length === 0) return null
            return (
              <div className="mt-16">
                <h2 className="text-2xl font-semibold text-white mb-8">Related skills</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedSkills.map(relatedSkill => (
                    <SkillCard key={relatedSkill.id} skill={relatedSkill} />
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      </main>

      <Footer />

      <KeyboardShortcutsHelp
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </div>
  )
}
