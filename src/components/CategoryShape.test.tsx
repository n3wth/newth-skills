import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { CategoryShape, RenderShape } from './CategoryShape'

describe('CategoryShape', () => {
  it('renders a circle for development category', () => {
    const { container } = render(<CategoryShape category="development" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    const circle = container.querySelector('circle')
    expect(circle).toBeInTheDocument()
  })

  it('renders a square for documents category', () => {
    const { container } = render(<CategoryShape category="documents" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    const rect = container.querySelector('rect')
    expect(rect).toBeInTheDocument()
  })

  it('renders a triangle for creative category', () => {
    const { container } = render(<CategoryShape category="creative" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    const path = container.querySelector('path')
    expect(path).toBeInTheDocument()
    expect(path?.getAttribute('d')).toContain('L22 21H2L12 3Z')
  })

  it('renders a diamond for business category', () => {
    const { container } = render(<CategoryShape category="business" />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    const path = container.querySelector('path')
    expect(path).toBeInTheDocument()
    expect(path?.getAttribute('d')).toContain('L22 12L12 22L2 12L12 2Z')
  })

  it('applies custom size', () => {
    const { container } = render(<CategoryShape category="development" size={24} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
  })

  it('defaults to development shape for unknown category', () => {
    const { container } = render(<CategoryShape category="unknown" />)
    const circle = container.querySelector('circle')
    expect(circle).toBeInTheDocument()
  })

  it('renders without shadow effects', () => {
    const { container } = render(<CategoryShape category="development" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.filter).toBe('')
  })
})

describe('RenderShape', () => {
  it('renders circle for development category', () => {
    const { container } = render(<RenderShape category="development" size={100} />)
    const circle = container.querySelector('circle')
    expect(circle).toBeInTheDocument()
  })

  it('renders square for documents category', () => {
    const { container } = render(<RenderShape category="documents" size={100} />)
    const rect = container.querySelector('rect')
    expect(rect).toBeInTheDocument()
  })

  it('renders triangle for creative category', () => {
    const { container } = render(<RenderShape category="creative" size={100} />)
    const path = container.querySelector('path')
    expect(path).toBeInTheDocument()
  })

  it('renders diamond for business category', () => {
    const { container } = render(<RenderShape category="business" size={100} />)
    const path = container.querySelector('path')
    expect(path).toBeInTheDocument()
  })

  it('returns null for unknown category', () => {
    const { container } = render(<RenderShape category="unknown" size={100} />)
    expect(container.firstChild).toBeNull()
  })

  it('applies specified size', () => {
    const { container } = render(<RenderShape category="development" size={150} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '150')
    expect(svg).toHaveAttribute('height', '150')
  })
})
