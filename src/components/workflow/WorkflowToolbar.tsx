import Link from 'next/link'
import type { Workflow } from '../../data/workflows'
import type { WorkflowExecutionState } from '../../lib/workflowExecutor'

export interface WorkflowToolbarProps {
  workflow: Workflow
  validationErrors: string[]
  isSaved: boolean
  executionState: WorkflowExecutionState | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
  remainingFreeRuns: number
  hasUserApiKey: boolean
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void
  onExport: () => void
  onClear: () => void
  onRun: () => void
  onSave: () => void
  onCopyPrompt: () => void
  onOpenApiSettings: () => void
  onAutoArrange: () => void
}

export function WorkflowToolbar({
  workflow,
  validationErrors,
  isSaved,
  executionState,
  fileInputRef,
  remainingFreeRuns,
  hasUserApiKey,
  onImport,
  onExport,
  onClear,
  onRun,
  onSave,
  onCopyPrompt,
  onOpenApiSettings,
  onAutoArrange
}: WorkflowToolbarProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--glass-border)]">
      <WorkflowInfo workflow={workflow} />
      <WorkflowActions
        workflow={workflow}
        validationErrors={validationErrors}
        isSaved={isSaved}
        executionState={executionState}
        fileInputRef={fileInputRef}
        remainingFreeRuns={remainingFreeRuns}
        hasUserApiKey={hasUserApiKey}
        onImport={onImport}
        onExport={onExport}
        onClear={onClear}
        onRun={onRun}
        onSave={onSave}
        onCopyPrompt={onCopyPrompt}
        onOpenApiSettings={onOpenApiSettings}
        onAutoArrange={onAutoArrange}
      />
    </div>
  )
}

function WorkflowInfo({ workflow }: { workflow: Workflow }) {
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/workflows"
        className="text-[var(--color-grey-400)] hover:text-[var(--color-white)] transition-colors"
        aria-label="Back to workflows"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </Link>
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-white)]">
          {workflow.name || 'Untitled Workflow'}
        </h2>
        <p className="text-sm text-[var(--color-grey-400)]">
          {workflow.nodes.length} skill{workflow.nodes.length !== 1 ? 's' : ''} | {workflow.connections.length} connection{workflow.connections.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}

interface WorkflowActionsProps {
  workflow: Workflow
  validationErrors: string[]
  isSaved: boolean
  executionState: WorkflowExecutionState | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
  remainingFreeRuns: number
  hasUserApiKey: boolean
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void
  onExport: () => void
  onClear: () => void
  onRun: () => void
  onSave: () => void
  onCopyPrompt: () => void
  onOpenApiSettings: () => void
  onAutoArrange: () => void
}

function WorkflowActions({
  workflow,
  validationErrors,
  isSaved,
  executionState,
  fileInputRef,
  remainingFreeRuns,
  hasUserApiKey,
  onImport,
  onExport,
  onClear,
  onRun,
  onSave,
  onCopyPrompt,
  onOpenApiSettings,
  onAutoArrange
}: WorkflowActionsProps) {
  const isRunning = executionState?.isRunning ?? false
  const hasNodes = workflow.nodes.length > 0

  return (
    <div className="flex items-center gap-3">
      {validationErrors.length > 0 && (
        <div className="text-sm text-[var(--color-coral)] max-w-md truncate">
          {validationErrors[0]}
        </div>
      )}

      {isSaved && (
        <span className="text-sm text-[var(--color-sage)]">Saved</span>
      )}

      <UsageBadge
        remaining={remainingFreeRuns}
        hasApiKey={hasUserApiKey}
        onClick={onOpenApiSettings}
      />

      <label htmlFor="workflow-import-file" className="sr-only">Import workflow file</label>
      <input
        id="workflow-import-file"
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={onImport}
        className="hidden"
      />

      <IconButton
        onClick={() => fileInputRef.current?.click()}
        title="Import workflow"
        icon={<ImportIcon />}
      />

      <IconButton
        onClick={onExport}
        disabled={!hasNodes}
        title="Export workflow"
        icon={<ExportIcon />}
      />

      <IconButton
        onClick={onCopyPrompt}
        disabled={!hasNodes}
        title="Copy compiled prompt"
        icon={<CopyIcon />}
      />

      <IconButton
        onClick={onAutoArrange}
        disabled={!hasNodes}
        title="Auto-arrange nodes"
        icon={<ArrangeIcon />}
      />

      <button
        onClick={onClear}
        className="px-4 py-2 text-sm text-[var(--color-grey-400)] hover:text-[var(--color-white)] transition-colors"
      >
        Clear
      </button>

      <RunButton
        isRunning={isRunning}
        disabled={!hasNodes}
        onClick={onRun}
      />

      <button
        onClick={onSave}
        disabled={!hasNodes}
        className="px-4 py-2 text-sm bg-[var(--color-white)] text-[var(--color-bg)] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save
      </button>
    </div>
  )
}

interface UsageBadgeProps {
  remaining: number
  hasApiKey: boolean
  onClick: () => void
}

function UsageBadge({ remaining, hasApiKey, onClick }: UsageBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-xs hover:border-[var(--glass-highlight)] transition-colors"
      title="AI Settings"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
      {hasApiKey ? (
        <span className="text-[var(--color-sage)]">Key active</span>
      ) : (
        <span className={remaining === 0 ? 'text-[var(--color-coral)]' : 'text-[var(--color-grey-400)]'}>
          {remaining} run{remaining !== 1 ? 's' : ''} left
        </span>
      )}
    </button>
  )
}

interface IconButtonProps {
  onClick: () => void
  disabled?: boolean
  title: string
  icon: React.ReactNode
}

function IconButton({ onClick, disabled, title, icon }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-2 text-sm text-[var(--color-grey-400)] hover:text-[var(--color-white)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title={title}
      aria-label={title}
    >
      {icon}
    </button>
  )
}

interface RunButtonProps {
  isRunning: boolean
  disabled: boolean
  onClick: () => void
}

function RunButton({ isRunning, disabled, onClick }: RunButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isRunning}
      className="px-4 py-2 text-sm bg-[var(--color-sage)] text-[var(--color-bg)] rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {isRunning ? (
        <>
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Running...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Run
        </>
      )}
    </button>
  )
}

function ImportIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  )
}

function ExportIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function ArrangeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  )
}
