'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { skills } from '@/src/data/skills'
import { Nav, Footer, CategoryShape } from '@/src/components'
import { categoryConfig } from '@/src/config/categories'

function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      className="rounded-lg p-4 text-sm overflow-x-auto"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid var(--glass-border)',
      }}
    >
      <code className="text-[13px] leading-relaxed" style={{ color: 'var(--color-grey-200)' }}>
        {code}
      </code>
    </pre>
  )
}

function OutputRenderer({ output }: { output: string }) {
  const parts = output.split(/(```[\s\S]*?```)/g)

  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const match = part.match(/```(\w+)?\n?([\s\S]*?)```/)
          if (match) {
            const code = match[2].trim()
            return <CodeBlock key={index} code={code} />
          }
        }

        if (part.trim()) {
          const lines = part.split('\n').filter(line => line.trim())
          return (
            <div key={index} className="space-y-2">
              {lines.map((line, lineIndex) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return (
                    <p
                      key={lineIndex}
                      className="font-semibold text-white"
                    >
                      {line.replace(/\*\*/g, '')}
                    </p>
                  )
                }
                if (line.match(/^\*\*.*:\*\*$/)) {
                  return (
                    <p
                      key={lineIndex}
                      className="font-semibold text-white mt-4"
                    >
                      {line.replace(/\*\*/g, '')}
                    </p>
                  )
                }
                return (
                  <p
                    key={lineIndex}
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--color-grey-300)' }}
                  >
                    {line}
                  </p>
                )
              })}
            </div>
          )
        }
        return null
      })}
    </div>
  )
}

export function PlaygroundClient() {
  const skillsWithPrompts = useMemo(
    () => skills.filter(s => s.samplePrompts && s.samplePrompts.length > 0),
    []
  )

  const [selectedSkillId, setSelectedSkillId] = useState<string>(
    skillsWithPrompts[0]?.id || ''
  )
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0)

  const selectedSkill = skillsWithPrompts.find(s => s.id === selectedSkillId)
  const selectedPrompt = selectedSkill?.samplePrompts?.[selectedPromptIndex]
  const config = selectedSkill ? categoryConfig[selectedSkill.category] : null

  return (
    <div className="min-h-screen relative content-loaded">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      <Nav />

      <main className="max-w-6xl mx-auto px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4 tracking-tight">
              Skill Playground
            </h1>
            <p
              className="text-lg md:text-xl max-w-2xl"
              style={{ color: 'var(--color-grey-300)' }}
            >
              See what each skill actually does. Example prompts, real outputs.
            </p>
          </div>

          <div className="grid lg:grid-cols-[300px_1fr] gap-6 lg:gap-8">
            <div className="space-y-2">
              <h2
                className="text-sm font-medium uppercase tracking-wider mb-4"
                style={{ color: 'var(--color-grey-400)' }}
              >
                Select a Skill
              </h2>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {skillsWithPrompts.map(skill => {
                  const skillConfig = categoryConfig[skill.category]
                  const isSelected = skill.id === selectedSkillId
                  return (
                    <button
                      key={skill.id}
                      onClick={() => {
                        setSelectedSkillId(skill.id)
                        setSelectedPromptIndex(0)
                      }}
                      className="w-full text-left p-4 rounded-xl transition-all duration-200"
                      style={{
                        backgroundColor: isSelected
                          ? 'var(--glass-bg)'
                          : 'transparent',
                        border: isSelected
                          ? `1px solid ${skillConfig?.color || 'var(--glass-border)'}`
                          : '1px solid transparent',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <CategoryShape category={skill.category} size={16} />
                        <span
                          className="font-medium"
                          style={{
                            color: isSelected ? 'white' : 'var(--color-grey-300)',
                          }}
                        >
                          {skill.name}
                        </span>
                      </div>
                      <p
                        className="text-xs mt-2 line-clamp-2"
                        style={{ color: 'var(--color-grey-500)' }}
                      >
                        {skill.samplePrompts?.length} example{skill.samplePrompts?.length !== 1 ? 's' : ''}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-6">
              {selectedSkill && selectedPrompt && (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <CategoryShape category={selectedSkill.category} size={24} />
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          {selectedSkill.name}
                        </h2>
                        <p
                          className="text-sm"
                          style={{ color: 'var(--color-grey-400)' }}
                        >
                          {selectedSkill.category.charAt(0).toUpperCase() + selectedSkill.category.slice(1)}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/skill/${selectedSkill.id}`}
                      className="text-sm font-medium px-4 py-2 rounded-full transition-opacity hover:opacity-80"
                      style={{
                        color: '#000',
                        backgroundColor: config?.color || 'var(--color-white)',
                      }}
                    >
                      View Skill Details
                    </Link>
                  </div>

                  {selectedSkill.samplePrompts && selectedSkill.samplePrompts.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedSkill.samplePrompts.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedPromptIndex(index)}
                          className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                          style={{
                            backgroundColor:
                              selectedPromptIndex === index
                                ? config?.color || 'var(--glass-bg)'
                                : 'var(--glass-bg)',
                            color:
                              selectedPromptIndex === index
                                ? 'white'
                                : 'var(--color-grey-400)',
                            border: `1px solid ${
                              selectedPromptIndex === index
                                ? config?.color || 'var(--glass-border)'
                                : 'var(--glass-border)'
                            }`,
                          }}
                        >
                          Example {index + 1}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="glass-card p-6 md:p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: 'var(--glass-bg)',
                          border: '1px solid var(--glass-border)',
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--color-grey-400)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p
                          className="text-xs font-medium uppercase tracking-wider mb-2"
                          style={{ color: 'var(--color-grey-500)' }}
                        >
                          Your Prompt
                        </p>
                        <p className="text-white font-medium">
                          {selectedPrompt.prompt}
                        </p>
                      </div>
                    </div>

                    <div
                      className="h-px w-full my-6"
                      style={{ backgroundColor: 'var(--glass-border)' }}
                    />

                    <div className="flex items-start gap-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: config?.color || 'var(--glass-bg)',
                        }}
                      >
                        <span style={{ color: '#000' }}>
                          {selectedSkill.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-medium uppercase tracking-wider mb-3"
                          style={{ color: 'var(--color-grey-500)' }}
                        >
                          AI Response
                        </p>
                        <OutputRenderer output={selectedPrompt.output} />
                      </div>
                    </div>
                  </div>

                  <div
                    className="p-4 rounded-xl text-center"
                    style={{
                      backgroundColor: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                    }}
                  >
                    <Link
                      href={`/skill/${selectedSkill.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-opacity hover:opacity-90"
                      style={{
                        backgroundColor: config?.color || 'white',
                        color: 'black',
                      }}
                    >
                      Install {selectedSkill.name}
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
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </>
              )}

              {!selectedSkill && (
                <div
                  className="glass-card p-12 text-center"
                  style={{ color: 'var(--color-grey-400)' }}
                >
                  <p>Select a skill from the list to see example prompts and outputs.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
