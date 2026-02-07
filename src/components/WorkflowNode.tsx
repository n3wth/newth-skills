'use client'
import { useCallback, useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import type { Skill } from '../data/skills'
import { type WorkflowNode, getSkillIOSchema, type SkillIO } from '../data/workflows'
import { categoryConfig } from '../config/categories'
import type { NodeExecutionState } from '../lib/workflowExecutor'

interface WorkflowNodeComponentProps {
  node: WorkflowNode
  skill: Skill
  isSelected: boolean
  isConnecting: boolean
  connectingFromThis: boolean
  onSelect: () => void
  onUpdatePosition: (position: { x: number; y: number }) => void
  onStartConnection: (outputId: string) => void
  onCompleteConnection: (inputId: string) => void
  onRemove: () => void
  isNew?: boolean
  executionState?: NodeExecutionState
}

export function WorkflowNodeComponent({
  node,
  skill,
  isSelected,
  isConnecting,
  connectingFromThis,
  onSelect,
  onUpdatePosition,
  onStartConnection,
  onCompleteConnection,
  onRemove,
  isNew = false,
  executionState
}: WorkflowNodeComponentProps) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  const schema = getSkillIOSchema(skill.id)
  const config = categoryConfig[skill.category]

  // Entrance animation
  useGSAP(() => {
    if (isNew && nodeRef.current) {
      gsap.fromTo(nodeRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(1.7)' }
      )
    }
  }, [isNew])

  // Selection animation
  useGSAP(() => {
    if (nodeRef.current) {
      gsap.to(nodeRef.current, {
        scale: isSelected ? 1.02 : 1,
        duration: 0.15,
        ease: 'power2.out'
      })
    }
  }, [isSelected])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.port-button')) return

    e.preventDefault()
    e.stopPropagation()

    const rect = nodeRef.current?.getBoundingClientRect()
    if (rect) {
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }
    isDraggingRef.current = true
    onSelect()

    // Add grabbing cursor
    document.body.style.cursor = 'grabbing'
    if (nodeRef.current) {
      nodeRef.current.style.zIndex = '50'
    }
  }, [onSelect])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !nodeRef.current) return

      const parent = nodeRef.current.parentElement
      if (!parent) return

      const parentRect = parent.getBoundingClientRect()
      const newX = e.clientX - parentRect.left + parent.scrollLeft - dragOffsetRef.current.x
      const newY = e.clientY - parentRect.top + parent.scrollTop - dragOffsetRef.current.y

      // Update position directly so connections follow
      onUpdatePosition({
        x: Math.max(0, newX),
        y: Math.max(0, newY)
      })
    }

    const handleMouseUp = () => {
      if (!isDraggingRef.current || !nodeRef.current) return

      isDraggingRef.current = false
      document.body.style.cursor = ''
      if (nodeRef.current) {
        nodeRef.current.style.zIndex = ''
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [onUpdatePosition])

  const renderPort = (port: SkillIO, isOutput: boolean) => {
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (isOutput) {
        onStartConnection(port.id)
      } else if (isConnecting && !connectingFromThis) {
        onCompleteConnection(port.id)
      }
    }

    const typeColors: Record<string, string> = {
      text: 'var(--color-grey-300)',
      code: 'var(--color-sage)',
      document: 'var(--color-mint)',
      data: 'var(--color-gold)',
      image: 'var(--color-coral)',
      presentation: 'var(--color-gold)',
      analysis: 'var(--color-mint)',
      any: 'var(--color-grey-400)'
    }

    const portColor = typeColors[port.type] || 'var(--color-grey-400)'
    const canConnect = isConnecting && !connectingFromThis && !isOutput

    return (
      <div
        key={port.id}
        className={`flex items-center gap-1.5 py-1 px-2 text-[11px] ${isOutput ? 'flex-row-reverse text-right' : ''}`}
      >
        <button
          onClick={handleClick}
          className={`port-button w-2.5 h-2.5 rounded-full border-2 transition-all shrink-0 ${
            canConnect
              ? 'scale-125 border-[var(--color-sage)] bg-[var(--color-sage)]/20'
              : 'border-current hover:scale-110'
          }`}
          style={{
            borderColor: canConnect ? undefined : portColor,
            backgroundColor: canConnect ? undefined : 'var(--color-bg)'
          }}
          title={`${port.name} (${port.type})`}
          aria-label={`${isOutput ? 'Output' : 'Input'} port: ${port.name} (${port.type})`}
        />
        <span className="text-[var(--color-grey-400)] shrink-0" title={port.description}>
          {port.name}
        </span>
        <span
          className="text-[9px] px-1 py-0.5 rounded shrink-0"
          style={{
            backgroundColor: `color-mix(in oklch, ${portColor} 20%, transparent)`,
            color: portColor
          }}
        >
          {port.type}
        </span>
      </div>
    )
  }

  // Execution state styling
  const executionBorderColor = executionState === 'running'
    ? 'var(--color-sage)'
    : executionState === 'completed'
      ? 'var(--color-sage)'
      : executionState === 'error'
        ? 'var(--color-coral)'
        : undefined

  const executionBgOverlay = executionState === 'completed'
    ? 'rgba(136, 211, 170, 0.05)'
    : executionState === 'error'
      ? 'rgba(255, 105, 97, 0.05)'
      : undefined

  return (
    <div
      ref={nodeRef}
      className={`absolute w-[280px] rounded-xl border transition-colors ${
        executionState === 'running' ? 'animate-pulse' : ''
      } ${
        isSelected
          ? 'border-[var(--color-white)]'
          : executionBorderColor
            ? ''
            : 'border-[var(--glass-border)] hover:border-[var(--glass-highlight)]'
      } cursor-grab active:cursor-grabbing`}
      style={{
        left: node.position.x,
        top: node.position.y,
        backgroundColor: executionBgOverlay || 'var(--color-bg-secondary)',
        borderColor: executionBorderColor || undefined
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="flex items-center gap-3 p-4 border-b border-[var(--glass-border)] rounded-t-xl"
        style={{
          backgroundColor: `color-mix(in oklch, ${config?.color || skill.color} 10%, transparent)`
        }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
          style={{
            backgroundColor: `color-mix(in oklch, ${config?.color || skill.color} 20%, transparent)`,
            color: config?.color || skill.color
          }}
        >
          {skill.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-[var(--color-white)] truncate">{skill.name}</h4>
          <p className="text-xs text-[var(--color-grey-600)] truncate">{skill.category}</p>
        </div>
        {executionState && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium ${
              executionState === 'running' ? 'bg-[var(--color-sage)]/20 text-[var(--color-sage)]' :
              executionState === 'completed' ? 'bg-[var(--color-sage)]/20 text-[var(--color-sage)]' :
              executionState === 'error' ? 'bg-[var(--color-coral)]/20 text-[var(--color-coral)]' :
              'bg-[var(--glass-bg)] text-[var(--color-grey-400)]'
            }`}
          >
            {executionState === 'running' && (
              <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {executionState === 'completed' && (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {executionState === 'error' && (
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {executionState === 'pending' && '...'}
            {executionState === 'running' && 'Running'}
            {executionState === 'completed' && 'Done'}
            {executionState === 'error' && 'Error'}
          </div>
        )}
        {!executionState && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="port-button w-6 h-6 rounded-md flex items-center justify-center text-[var(--color-grey-600)] hover:text-[var(--color-coral)] hover:bg-[var(--color-coral)]/10 transition-colors"
            aria-label={`Remove ${skill.name} from workflow`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {schema && (
        <div className="flex">
          <div className="flex-1 py-2 border-r border-[var(--glass-border)]">
            <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-[var(--color-grey-600)]">
              Inputs
            </div>
            {schema.inputs.length > 0 ? (
              schema.inputs.map(input => renderPort(input, false))
            ) : (
              <div className="px-3 py-1.5 text-xs text-[var(--color-grey-600)] italic">
                No inputs
              </div>
            )}
          </div>

          <div className="flex-1 py-2">
            <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-[var(--color-grey-600)] text-right">
              Outputs
            </div>
            {schema.outputs.length > 0 ? (
              schema.outputs.map(output => renderPort(output, true))
            ) : (
              <div className="px-3 py-1.5 text-xs text-[var(--color-grey-600)] italic text-right">
                No outputs
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
