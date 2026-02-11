import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WorkflowCard } from './WorkflowCard'
import type { Workflow } from '../data/workflows'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

const mockWorkflow: Workflow = {
  id: 'test-workflow',
  name: 'Test Workflow',
  description: 'A workflow for testing.',
  nodes: [
    { id: 'n1', skillId: 'gsap-animations', position: { x: 0, y: 0 } },
    { id: 'n2', skillId: 'mcp-builder', position: { x: 200, y: 0 } },
  ],
  connections: [{ id: 'c1', sourceNodeId: 'n1', sourceOutputId: 'o1', targetNodeId: 'n2', targetInputId: 'i1' }],
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
  isPublic: true,
  tags: ['test'],
}

describe('WorkflowCard', () => {
  it('renders workflow name and description', () => {
    render(<WorkflowCard workflow={mockWorkflow} />)
    expect(screen.getByText('Test Workflow')).toBeInTheDocument()
    expect(screen.getByText('A workflow for testing.')).toBeInTheDocument()
  })

  it('renders skill names in the chain', () => {
    render(<WorkflowCard workflow={mockWorkflow} />)
    expect(screen.getByText('GSAP Animations')).toBeInTheDocument()
    expect(screen.getByText('MCP Builder')).toBeInTheDocument()
  })

  it('links to the workflow detail page', () => {
    render(<WorkflowCard workflow={mockWorkflow} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/workflows/test-workflow')
  })
})
