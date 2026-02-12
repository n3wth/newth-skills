'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { skills } from '@/src/data/skills'
import { Nav, Footer, CategoryShape } from '@/src/components'
import { categoryConfig } from '@/src/config/categories'

const STORAGE_KEY_RUNS = 'newth-playground-runs'
const STORAGE_KEY_API = 'newth-playground-api-key'
const STORAGE_KEY_FP = 'newth-playground-fingerprint'
const FREE_RUN_LIMIT = 3

function getStoredRuns(): number {
  if (typeof window === 'undefined') return 0
  const v = localStorage.getItem(STORAGE_KEY_RUNS)
  return v ? parseInt(v, 10) : 0
}

function incrementStoredRuns(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY_RUNS, String(getStoredRuns() + 1))
}

function getStoredApiKey(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(STORAGE_KEY_API) || ''
}

function setStoredApiKey(key: string): void {
  if (typeof window === 'undefined') return
  if (key) localStorage.setItem(STORAGE_KEY_API, key)
  else localStorage.removeItem(STORAGE_KEY_API)
}

function getFingerprint(): string {
  if (typeof window === 'undefined') return 'ssr'
  const stored = localStorage.getItem(STORAGE_KEY_FP)
  if (stored) return stored
  const fp = `pg-${crypto.randomUUID()}`
  localStorage.setItem(STORAGE_KEY_FP, fp)
  return fp
}

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
                    <p key={lineIndex} className="font-semibold text-white">
                      {line.replace(/\*\*/g, '')}
                    </p>
                  )
                }
                if (line.match(/^\*\*.*:\*\*$/)) {
                  return (
                    <p key={lineIndex} className="font-semibold text-white mt-4">
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

interface Message {
  role: 'user' | 'ai'
  content: string
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
  const [mode, setMode] = useState<'examples' | 'try'>('examples')

  // AI state
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Free tier state
  const [runsUsed, setRunsUsed] = useState(0)
  const [apiKey, setApiKey] = useState('')
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setRunsUsed(getStoredRuns())
    setApiKey(getStoredApiKey())
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const selectedSkill = skillsWithPrompts.find(s => s.id === selectedSkillId)
  const selectedSamplePrompt = selectedSkill?.samplePrompts?.[selectedPromptIndex]
  const config = selectedSkill ? categoryConfig[selectedSkill.category] : null

  const remaining = apiKey ? null : Math.max(0, FREE_RUN_LIMIT - runsUsed)
  const canRun = apiKey || (remaining !== null && remaining > 0)

  const handleRun = useCallback(async () => {
    if (!prompt.trim() || !selectedSkill || loading) return
    if (!canRun) {
      setShowApiKeyInput(true)
      return
    }

    const userMessage = prompt.trim()
    setPrompt('')
    setError(null)
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('/api/playground', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          skillContext: {
            name: selectedSkill.name,
            description: selectedSkill.description,
            features: selectedSkill.features,
            useCases: selectedSkill.useCases,
          },
          userApiKey: apiKey || undefined,
          fingerprint: getFingerprint(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()

        if (response.status === 402) {
          setRunsUsed(FREE_RUN_LIMIT)
          localStorage.setItem(STORAGE_KEY_RUNS, String(FREE_RUN_LIMIT))
          setShowApiKeyInput(true)
          setError('Free runs exhausted. Add your API key to continue.')
          setLoading(false)
          return
        }

        if (response.status === 401) {
          setError('Invalid API key. Check your key and try again.')
          setLoading(false)
          return
        }

        throw new Error(data.error || 'Request failed')
      }

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'ai', content: data.result }])

      if (data.remaining !== undefined) {
        const newCount = FREE_RUN_LIMIT - data.remaining
        setRunsUsed(newCount)
        localStorage.setItem(STORAGE_KEY_RUNS, String(newCount))
      } else if (!apiKey) {
        incrementStoredRuns()
        setRunsUsed(prev => prev + 1)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [prompt, selectedSkill, loading, canRun, apiKey])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleRun()
    }
  }

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      setStoredApiKey(apiKey.trim())
      setShowApiKeyInput(false)
      setError(null)
    }
  }

  const handleClearApiKey = () => {
    setApiKey('')
    setStoredApiKey('')
  }

  const handleSkillChange = (skillId: string) => {
    setSelectedSkillId(skillId)
    setSelectedPromptIndex(0)
    setMessages([])
    setError(null)
    setPrompt('')
  }

  const handleTrySamplePrompt = (samplePrompt: string) => {
    setMode('try')
    setPrompt(samplePrompt)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

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
              Test skills with live AI responses.{' '}
              {remaining !== null && remaining > 0 && (
                <span style={{ color: 'var(--color-grey-400)' }}>
                  {remaining} free run{remaining !== 1 ? 's' : ''} remaining.
                </span>
              )}
              {apiKey && (
                <span style={{ color: 'var(--color-sage, #6bcf7f)' }}>
                  Using your API key.
                </span>
              )}
            </p>
          </div>

          <div className="grid lg:grid-cols-[300px_1fr] gap-6 lg:gap-8">
            {/* Skill selector sidebar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-sm font-medium uppercase tracking-wider"
                  style={{ color: 'var(--color-grey-400)' }}
                >
                  Select a skill
                </h2>
                <button
                  onClick={() => setShowApiKeyInput(true)}
                  className="text-xs px-2 py-1 rounded transition-colors"
                  style={{
                    color: apiKey ? 'var(--color-sage, #6bcf7f)' : 'var(--color-grey-500)',
                    border: '1px solid var(--glass-border)',
                  }}
                  title={apiKey ? 'API key active' : 'Add API key'}
                >
                  {apiKey ? 'Key active' : 'API key'}
                </button>
              </div>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {skillsWithPrompts.map(skill => {
                  const skillConfig = categoryConfig[skill.category]
                  const isSelected = skill.id === selectedSkillId
                  return (
                    <button
                      key={skill.id}
                      onClick={() => handleSkillChange(skill.id)}
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

            {/* Main content */}
            <div className="space-y-6">
              {selectedSkill && (
                <>
                  {/* Skill header + mode tabs */}
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setMode('examples')}
                        className="text-sm font-medium px-4 py-2 rounded-full transition-all"
                        style={{
                          backgroundColor: mode === 'examples' ? 'var(--glass-bg)' : 'transparent',
                          color: mode === 'examples' ? 'var(--color-white)' : 'var(--color-grey-500)',
                          border: mode === 'examples' ? '1px solid var(--glass-border)' : '1px solid transparent',
                        }}
                      >
                        Examples
                      </button>
                      <button
                        onClick={() => {
                          setMode('try')
                          setTimeout(() => inputRef.current?.focus(), 100)
                        }}
                        className="text-sm font-medium px-4 py-2 rounded-full transition-all"
                        style={{
                          backgroundColor: mode === 'try' ? (config?.color || 'var(--glass-bg)') : 'transparent',
                          color: mode === 'try' ? '#000' : 'var(--color-grey-500)',
                          border: mode === 'try' ? `1px solid ${config?.color || 'var(--glass-border)'}` : '1px solid transparent',
                        }}
                      >
                        Try it
                      </button>
                      <Link
                        href={`/skill/${selectedSkill.id}`}
                        className="text-sm font-medium px-4 py-2 rounded-full transition-opacity hover:opacity-80"
                        style={{
                          color: 'var(--color-grey-400)',
                          border: '1px solid var(--glass-border)',
                        }}
                      >
                        Details
                      </Link>
                    </div>
                  </div>

                  {/* Examples mode */}
                  {mode === 'examples' && selectedSamplePrompt && (
                    <>
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
                              width="16" height="16" viewBox="0 0 24 24" fill="none"
                              stroke="var(--color-grey-400)" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round"
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
                              Your prompt
                            </p>
                            <p className="text-white font-medium">
                              {selectedSamplePrompt.prompt}
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
                            style={{ backgroundColor: config?.color || 'var(--glass-bg)' }}
                          >
                            <span style={{ color: '#000' }}>{selectedSkill.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs font-medium uppercase tracking-wider mb-3"
                              style={{ color: 'var(--color-grey-500)' }}
                            >
                              AI response
                            </p>
                            <OutputRenderer output={selectedSamplePrompt.output} />
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
                        <button
                          onClick={() => handleTrySamplePrompt(selectedSamplePrompt.prompt)}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-opacity hover:opacity-90"
                          style={{
                            backgroundColor: config?.color || 'white',
                            color: 'black',
                          }}
                        >
                          Try this prompt live
                          <svg
                            width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round"
                          >
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}

                  {/* Try It mode */}
                  {mode === 'try' && (
                    <>
                      {messages.length > 0 && (
                        <div className="glass-card p-6 md:p-8 space-y-6 max-h-[50vh] overflow-y-auto">
                          {messages.map((msg, i) => (
                            <div key={i}>
                              {i > 0 && (
                                <div
                                  className="h-px w-full my-6"
                                  style={{ backgroundColor: 'var(--glass-border)' }}
                                />
                              )}
                              <div className="flex items-start gap-4">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                  style={{
                                    backgroundColor: msg.role === 'user'
                                      ? 'var(--glass-bg)'
                                      : (config?.color || 'var(--glass-bg)'),
                                    border: msg.role === 'user'
                                      ? '1px solid var(--glass-border)'
                                      : 'none',
                                  }}
                                >
                                  {msg.role === 'user' ? (
                                    <svg
                                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                                      stroke="var(--color-grey-400)" strokeWidth="2"
                                      strokeLinecap="round" strokeLinejoin="round"
                                    >
                                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                      <circle cx="12" cy="7" r="4" />
                                    </svg>
                                  ) : (
                                    <span style={{ color: '#000' }}>{selectedSkill.icon}</span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className="text-xs font-medium uppercase tracking-wider mb-2"
                                    style={{ color: 'var(--color-grey-500)' }}
                                  >
                                    {msg.role === 'user' ? 'You' : selectedSkill.name}
                                  </p>
                                  {msg.role === 'user' ? (
                                    <p className="text-white font-medium">{msg.content}</p>
                                  ) : (
                                    <OutputRenderer output={msg.content} />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}

                          {loading && (
                            <>
                              <div
                                className="h-px w-full my-6"
                                style={{ backgroundColor: 'var(--glass-border)' }}
                              />
                              <div className="flex items-start gap-4">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: config?.color || 'var(--glass-bg)' }}
                                >
                                  <span style={{ color: '#000' }}>{selectedSkill.icon}</span>
                                </div>
                                <div className="flex-1">
                                  <p
                                    className="text-xs font-medium uppercase tracking-wider mb-2"
                                    style={{ color: 'var(--color-grey-500)' }}
                                  >
                                    {selectedSkill.name}
                                  </p>
                                  <div className="flex gap-1">
                                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-grey-500)', animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-grey-500)', animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-grey-500)', animationDelay: '300ms' }} />
                                  </div>
                                </div>
                              </div>
                            </>
                          )}

                          <div ref={messagesEndRef} />
                        </div>
                      )}

                      {messages.length === 0 && !loading && (
                        <div className="glass-card p-8 md:p-12 text-center">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                            style={{ backgroundColor: config?.color || 'var(--glass-bg)' }}
                          >
                            <span style={{ color: '#000', fontSize: '20px' }}>{selectedSkill.icon}</span>
                          </div>
                          <p className="text-white font-medium mb-2">
                            Try {selectedSkill.name}
                          </p>
                          <p
                            className="text-sm mb-6"
                            style={{ color: 'var(--color-grey-400)' }}
                          >
                            Enter a prompt below to test the skill with live AI.
                          </p>
                          {selectedSkill.samplePrompts && selectedSkill.samplePrompts.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2">
                              {selectedSkill.samplePrompts.slice(0, 3).map((sp, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    setPrompt(sp.prompt)
                                    setTimeout(() => inputRef.current?.focus(), 100)
                                  }}
                                  className="text-xs px-3 py-2 rounded-full transition-all hover:opacity-80"
                                  style={{
                                    backgroundColor: 'var(--glass-bg)',
                                    color: 'var(--color-grey-300)',
                                    border: '1px solid var(--glass-border)',
                                  }}
                                >
                                  {sp.prompt.length > 50 ? sp.prompt.slice(0, 50) + '...' : sp.prompt}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {error && (
                        <div
                          className="p-4 rounded-xl text-sm"
                          style={{
                            backgroundColor: 'rgba(255, 105, 97, 0.1)',
                            border: '1px solid rgba(255, 105, 97, 0.2)',
                            color: 'var(--color-coral, #ff6961)',
                          }}
                        >
                          {error}
                        </div>
                      )}

                      <div
                        className="rounded-xl p-4"
                        style={{
                          backgroundColor: 'var(--glass-bg)',
                          border: '1px solid var(--glass-border)',
                        }}
                      >
                        <div className="flex gap-3 items-end">
                          <textarea
                            ref={inputRef}
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={`Ask ${selectedSkill.name} something...`}
                            rows={2}
                            className="flex-1 bg-transparent text-white placeholder:text-[var(--color-grey-600)] resize-none focus:outline-none text-sm leading-relaxed"
                            disabled={loading}
                          />
                          <button
                            onClick={handleRun}
                            disabled={!prompt.trim() || loading}
                            className="shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{
                              backgroundColor: config?.color || 'white',
                              color: '#000',
                            }}
                          >
                            {loading ? 'Running...' : 'Run'}
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid var(--glass-border)' }}>
                          <p className="text-xs" style={{ color: 'var(--color-grey-600)' }}>
                            {apiKey ? (
                              <>
                                Using your API key.{' '}
                                <button
                                  onClick={handleClearApiKey}
                                  className="underline hover:no-underline"
                                  style={{ color: 'var(--color-grey-500)' }}
                                >
                                  Remove
                                </button>
                              </>
                            ) : remaining !== null && remaining > 0 ? (
                              <>
                                {remaining} of {FREE_RUN_LIMIT} free runs remaining.{' '}
                                <button
                                  onClick={() => setShowApiKeyInput(true)}
                                  className="underline hover:no-underline"
                                  style={{ color: 'var(--color-grey-500)' }}
                                >
                                  Add API key for unlimited
                                </button>
                              </>
                            ) : (
                              <>
                                Free runs used.{' '}
                                <button
                                  onClick={() => setShowApiKeyInput(true)}
                                  className="underline hover:no-underline"
                                  style={{ color: 'var(--color-coral, #ff6961)' }}
                                >
                                  Add your API key to continue.
                                </button>
                              </>
                            )}
                          </p>
                          <span className="text-xs" style={{ color: 'var(--color-grey-600)' }}>
                            Shift+Enter for new line
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {!selectedSkill && (
                <div
                  className="glass-card p-12 text-center"
                  style={{ color: 'var(--color-grey-400)' }}
                >
                  <p>Select a skill from the list to see example prompts and their outputs.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showApiKeyInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className="w-full max-w-md p-6 rounded-2xl"
            style={{
              backgroundColor: 'var(--color-bg-secondary, #1a1a1a)',
              border: '1px solid var(--glass-border)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">API key</h3>
              <button
                onClick={() => setShowApiKeyInput(false)}
                className="p-1 transition-colors"
                style={{ color: 'var(--color-grey-400)' }}
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div
              className="mb-4 p-3 rounded-lg text-sm"
              style={{
                backgroundColor: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--color-grey-300)',
              }}
            >
              {apiKey ? (
                <span style={{ color: 'var(--color-sage, #6bcf7f)' }}>
                  Your API key is active. Runs are unlimited.
                </span>
              ) : remaining !== null && remaining > 0 ? (
                <>
                  <span className="font-medium text-white">{remaining} of {FREE_RUN_LIMIT}</span> free runs remaining.
                </>
              ) : (
                <>Free runs used. Add a Gemini API key to continue.</>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium" style={{ color: 'var(--color-grey-300)' }}>
                Gemini API key
              </label>
              <p className="text-xs" style={{ color: 'var(--color-grey-600)' }}>
                Get a free key from{' '}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                  style={{ color: 'var(--color-sage, #6bcf7f)' }}
                >
                  Google AI Studio
                </a>
              </p>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="AIza..."
                className="w-full px-4 py-3 rounded-lg text-sm font-mono focus:outline-none"
                style={{
                  backgroundColor: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--color-white)',
                }}
              />
              <p className="text-xs" style={{ color: 'var(--color-grey-600)' }}>
                Stored in your browser only. Never sent to our servers.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              {getStoredApiKey() && (
                <button
                  onClick={() => {
                    handleClearApiKey()
                    setShowApiKeyInput(false)
                  }}
                  className="px-4 py-3 text-sm rounded-lg transition-colors"
                  style={{
                    color: 'var(--color-coral, #ff6961)',
                    border: '1px solid rgba(255, 105, 97, 0.2)',
                  }}
                >
                  Remove
                </button>
              )}
              <button
                onClick={() => setShowApiKeyInput(false)}
                className="flex-1 px-4 py-3 text-sm rounded-lg transition-colors"
                style={{
                  color: 'var(--color-grey-400)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                disabled={!apiKey.trim()}
                className="flex-1 px-4 py-3 text-sm rounded-lg font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-sage, #6bcf7f)',
                  color: '#000',
                }}
              >
                Save key
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
