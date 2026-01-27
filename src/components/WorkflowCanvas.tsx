import { forwardRef, useCallback, useState, useRef } from 'react'
import { skills } from '../data/skills'
import {
  type WorkflowNode,
  type WorkflowConnection,
  getSkillIOSchema
} from '../data/workflows'
import { WorkflowNodeComponent } from './WorkflowNode'
import type { NodeExecutionState } from '../lib/workflowExecutor'

interface WorkflowCanvasProps {
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  selectedNodeId: string | null
  connectingFrom: { nodeId: string; outputId: string } | null
  onSelectNode: (nodeId: string | null) => void
  onUpdateNodePosition: (nodeId: string, position: { x: number; y: number }) => void
  onStartConnection: (nodeId: string, outputId: string) => void
  onCompleteConnection: (targetNodeId: string, targetInputId: string) => void
  onRemoveNode: (nodeId: string) => void
  onRemoveConnection: (connectionId: string) => void
  onCancelConnection: () => void
  nodeExecutionStates?: Record<string, NodeExecutionState>
}

export const WorkflowCanvas = forwardRef<HTMLDivElement, WorkflowCanvasProps>(({
  nodes,
  connections,
  selectedNodeId,
  connectingFrom,
  onSelectNode,
  onUpdateNodePosition,
  onStartConnection,
  onCompleteConnection,
  onRemoveNode,
  onRemoveConnection,
  onCancelConnection,
  nodeExecutionStates
}, ref) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'svg') {
      onSelectNode(null)
      if (connectingFrom) {
        onCancelConnection()
      }
    }
  }, [onSelectNode, connectingFrom, onCancelConnection])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left + containerRef.current.scrollLeft,
        y: e.clientY - rect.top + containerRef.current.scrollTop
      })
    }
  }, [])

  const getNodeCenter = useCallback((nodeId: string, isOutput: boolean, portId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return { x: 0, y: 0 }
    
    const skill = skills.find(s => s.id === node.skillId)
    const schema = getSkillIOSchema(node.skillId)
    if (!skill || !schema) return { x: node.position.x, y: node.position.y }
    
    const nodeWidth = 280
    const headerHeight = 60
    const portHeight = 32
    
    const ports = isOutput ? schema.outputs : schema.inputs
    const portIndex = Math.max(0, ports.findIndex(p => p.id === portId))
    
    const x = isOutput ? node.position.x + nodeWidth : node.position.x
    const y = node.position.y + headerHeight + (portIndex * portHeight) + (portHeight / 2)
    
    return { x, y }
  }, [nodes])

  const renderConnection = useCallback((connection: WorkflowConnection) => {
    const start = getNodeCenter(connection.sourceNodeId, true, connection.sourceOutputId)
    const end = getNodeCenter(connection.targetNodeId, false, connection.targetInputId)
    
    const midX = (start.x + end.x) / 2
    const controlOffset = Math.min(Math.abs(end.x - start.x) / 2, 100)
    
    const path = `M ${start.x} ${start.y} C ${start.x + controlOffset} ${start.y}, ${end.x - controlOffset} ${end.y}, ${end.x} ${end.y}`
    
    return (
      <g key={connection.id} className="group cursor-pointer" onClick={() => onRemoveConnection(connection.id)}>
        <path
          d={path}
          fill="none"
          stroke="transparent"
          strokeWidth={20}
        />
        <path
          d={path}
          fill="none"
          stroke="var(--color-grey-600)"
          strokeWidth={2}
          className="transition-all group-hover:stroke-[var(--color-coral)]"
        />
        <circle
          cx={midX}
          cy={(start.y + end.y) / 2}
          r={8}
          fill="var(--color-bg)"
          stroke="var(--color-grey-600)"
          strokeWidth={2}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        />
        <text
          x={midX}
          y={(start.y + end.y) / 2 + 4}
          textAnchor="middle"
          fill="var(--color-coral)"
          fontSize={12}
          className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          ×
        </text>
      </g>
    )
  }, [getNodeCenter, onRemoveConnection])

  const renderPendingConnection = useCallback(() => {
    if (!connectingFrom) return null
    
    const start = getNodeCenter(connectingFrom.nodeId, true, connectingFrom.outputId)
    const controlOffset = Math.min(Math.abs(mousePosition.x - start.x) / 2, 100)
    
    const path = `M ${start.x} ${start.y} C ${start.x + controlOffset} ${start.y}, ${mousePosition.x - controlOffset} ${mousePosition.y}, ${mousePosition.x} ${mousePosition.y}`
    
    return (
      <path
        d={path}
        fill="none"
        stroke="var(--color-sage)"
        strokeWidth={2}
        strokeDasharray="8 4"
        className="pointer-events-none"
      />
    )
  }, [connectingFrom, mousePosition, getNodeCenter])

  return (
    <div 
      ref={(el) => {
        containerRef.current = el
        if (typeof ref === 'function') ref(el)
        else if (ref) ref.current = el
      }}
      className="flex-1 relative overflow-auto bg-[var(--color-bg)]"
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
    >
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-grey-400) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-grey-400) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      <svg 
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ minWidth: '100%', minHeight: '100%' }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="var(--color-grey-600)"
            />
          </marker>
        </defs>
        
        <g className="pointer-events-auto">
          {connections.map(renderConnection)}
        </g>
        
        {renderPendingConnection()}
      </svg>
      
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--color-grey-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[var(--color-grey-300)] mb-2">Start Building</h3>
            <p className="text-sm text-[var(--color-grey-600)] max-w-xs">
              Add skills from the sidebar to create your workflow. Connect outputs to inputs to chain skills together.
            </p>
          </div>
        </div>
      )}
      
      {nodes.map(node => {
        const skill = skills.find(s => s.id === node.skillId)
        if (!skill) return null
        
        return (
          <WorkflowNodeComponent
            key={node.id}
            node={node}
            skill={skill}
            isSelected={selectedNodeId === node.id}
            isConnecting={!!connectingFrom}
            connectingFromThis={connectingFrom?.nodeId === node.id}
            onSelect={() => onSelectNode(node.id)}
            onUpdatePosition={(position) => onUpdateNodePosition(node.id, position)}
            onStartConnection={(outputId) => onStartConnection(node.id, outputId)}
            onCompleteConnection={(inputId) => onCompleteConnection(node.id, inputId)}
            onRemove={() => onRemoveNode(node.id)}
            executionState={nodeExecutionStates?.[node.id]}
          />
        )
      })}
    </div>
  )
})

WorkflowCanvas.displayName = 'WorkflowCanvas'
