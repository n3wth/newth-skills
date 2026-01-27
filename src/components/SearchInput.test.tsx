import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('renders with placeholder text', () => {
    const onChange = vi.fn()
    render(<SearchInput value="" onChange={onChange} />)

    expect(screen.getByPlaceholderText('Search skills...')).toBeInTheDocument()
  })

  it('renders with custom placeholder', () => {
    const onChange = vi.fn()
    render(<SearchInput value="" onChange={onChange} placeholder="Find a skill..." />)

    expect(screen.getByPlaceholderText('Find a skill...')).toBeInTheDocument()
  })

  it('displays the current value', () => {
    const onChange = vi.fn()
    render(<SearchInput value="gsap" onChange={onChange} />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('gsap')
  })

  it('calls onChange when typing', () => {
    const onChange = vi.fn()
    render(<SearchInput value="" onChange={onChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'animation' } })

    expect(onChange).toHaveBeenCalledWith('animation')
  })

  it('shows clear button when value is present', () => {
    const onChange = vi.fn()
    render(<SearchInput value="test" onChange={onChange} />)

    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  it('hides clear button when value is empty', () => {
    const onChange = vi.fn()
    render(<SearchInput value="" onChange={onChange} />)

    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
  })

  it('clears value when clear button is clicked', () => {
    const onChange = vi.fn()
    render(<SearchInput value="test" onChange={onChange} />)

    fireEvent.click(screen.getByLabelText('Clear search'))
    expect(onChange).toHaveBeenCalledWith('')
  })

  it('has accessible label', () => {
    const onChange = vi.fn()
    render(<SearchInput value="" onChange={onChange} />)

    expect(screen.getByLabelText('Search skills')).toBeInTheDocument()
  })

  it('has search icon', () => {
    const onChange = vi.fn()
    const { container } = render(<SearchInput value="" onChange={onChange} />)

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })
})
