'use client'
import { useState, useCallback } from 'react'
import type { WorkflowExecutionState } from '../../lib/workflowExecutor'

export interface ExecutionPanelProps {
  executionState: WorkflowExecutionState | null
  onClose: () => void
}

export function ExecutionPanel({ executionState, onClose }: ExecutionPanelProps) {
  const [showCompiledPrompt, setShowCompiledPrompt] = useState(false)

  const copyToClipboard = useCallback(() => {
    if (executionState?.compiledPrompt) {
      navigator.clipboard.writeText(executionState.compiledPrompt)
    }
  }, [executionState])

  return (
    <div className="w-96 border-l border-[var(--glass-border)] bg-[var(--color-bg-secondary)] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <h3 className="font-medium text-[var(--color-white)]">Execution Results</h3>
        <button
          onClick={onClose}
          className="p-1 text-[var(--color-grey-400)] hover:text-[var(--color-white)] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {!executionState && (
          <EmptyState />
        )}

        {executionState?.isRunning && (
          <RunningIndicator />
        )}

        {executionState?.isComplete && (
          <CompleteIndicator />
        )}

        {executionState?.error && (
          <ErrorIndicator error={executionState.error} />
        )}

        {executionState?.results && executionState.results.length > 0 && (
          <StepsList results={executionState.results} />
        )}

        {executionState?.compiledPrompt && (
          <CompiledPromptSection
            compiledPrompt={executionState.compiledPrompt}
            showCompiledPrompt={showCompiledPrompt}
            onToggle={() => setShowCompiledPrompt(!showCompiledPrompt)}
            onCopy={copyToClipboard}
          />
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-8">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--glass-bg)] flex items-center justify-center">
        <svg className="w-6 h-6 text-[var(--color-grey-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        </svg>
      </div>
      <p className="text-sm text-[var(--color-grey-400)]">Click Run to execute the workflow</p>
    </div>
  )
}

function RunningIndicator() {
  return (
    <div className="flex items-center gap-3 p-3 bg-[var(--color-sage)]/10 border border-[var(--color-sage)]/20 rounded-lg">
      <svg className="w-5 h-5 animate-spin text-[var(--color-sage)]" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span className="text-sm text-[var(--color-sage)]">Executing workflow...</span>
    </div>
  )
}

function CompleteIndicator() {
  return (
    <div className="flex items-center gap-3 p-3 bg-[var(--color-sage)]/10 border border-[var(--color-sage)]/20 rounded-lg">
      <svg className="w-5 h-5 text-[var(--color-sage)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-sm text-[var(--color-sage)]">Workflow complete</span>
    </div>
  )
}

function ErrorIndicator({ error }: { error: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[var(--color-coral)]/10 border border-[var(--color-coral)]/20 rounded-lg">
      <svg className="w-5 h-5 text-[var(--color-coral)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      <span className="text-sm text-[var(--color-coral)]">{error}</span>
    </div>
  )
}

interface StepResult {
  nodeId: string
  skillName: string
  state: string
  inputs: Record<string, string>
  outputs: Record<string, string>
}

function StepsList({ results }: { results: StepResult[] }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-[var(--color-grey-300)]">Steps</h4>
      {results.map((result, index) => (
        <div
          key={result.nodeId}
          className="p-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-[var(--color-sage)]/20 text-[var(--color-sage)] text-xs flex items-center justify-center font-medium">
              {index + 1}
            </span>
            <span className="text-sm font-medium text-[var(--color-white)]">{result.skillName}</span>
            {result.state === 'completed' && (
              <svg className="w-4 h-4 text-[var(--color-sage)] ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>

          {Object.keys(result.inputs).length > 0 && (
            <div className="text-xs text-[var(--color-grey-400)] mb-1">
              <span className="text-[var(--color-grey-600)]">Inputs:</span>{' '}
              {Object.values(result.inputs).join(', ')}
            </div>
          )}

          {Object.keys(result.outputs).length > 0 && (
            <div className="text-xs text-[var(--color-grey-400)]">
              <span className="text-[var(--color-grey-600)]">Outputs:</span>{' '}
              {Object.values(result.outputs).join(', ')}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

interface CompiledPromptSectionProps {
  compiledPrompt: string
  showCompiledPrompt: boolean
  onToggle: () => void
  onCopy: () => void
}

function CompiledPromptSection({
  compiledPrompt,
  showCompiledPrompt,
  onToggle,
  onCopy
}: CompiledPromptSectionProps) {
  return (
    <div className="space-y-2">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-sm text-[var(--color-grey-300)] hover:text-[var(--color-white)] transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform ${showCompiledPrompt ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Compiled Prompt
      </button>

      {showCompiledPrompt && (
        <div className="relative">
          <pre className="p-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-xs text-[var(--color-grey-300)] overflow-auto max-h-64 whitespace-pre-wrap">
            {compiledPrompt}
          </pre>
          <button
            onClick={onCopy}
            className="absolute top-2 right-2 p-1.5 bg-[var(--color-bg)] border border-[var(--glass-border)] rounded text-[var(--color-grey-400)] hover:text-[var(--color-white)] transition-colors"
            title="Copy to clipboard"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
