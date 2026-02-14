import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CommandBox } from './CommandBox'

vi.mock('../lib/analytics', () => ({
  trackCopyEvent: vi.fn(),
}))

describe('CommandBox', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders command name and command text', () => {
    render(
      <CommandBox
        name="Test Command"
        command="curl -fsSL https://example.com/install.sh | bash"
        primary={false}
      />
    )

    expect(screen.getByText('Test Command')).toBeInTheDocument()
    expect(screen.getByText('curl -fsSL https://example.com/install.sh | bash')).toBeInTheDocument()
  })

  it('renders Copy button', () => {
    render(
      <CommandBox
        name="Test Command"
        command="test command"
        primary={false}
      />
    )

    expect(screen.getByText('Copy')).toBeInTheDocument()
  })

  it('applies primary class when primary is true', () => {
    const { container } = render(
      <CommandBox
        name="Primary Command"
        command="test command"
        primary={true}
      />
    )

    const commandBox = container.querySelector('.command-box') as HTMLElement
    expect(commandBox).toHaveClass('primary')
  })

  it('does not apply primary class when primary is false', () => {
    const { container } = render(
      <CommandBox
        name="Secondary Command"
        command="test command"
        primary={false}
      />
    )

    const commandBox = container.querySelector('.command-box') as HTMLElement
    expect(commandBox).not.toHaveClass('primary')
  })

  it('copies command to clipboard when clicked', async () => {
    const command = 'curl -fsSL https://example.com/install.sh | bash'
    render(
      <CommandBox
        name="Test Command"
        command={command}
        primary={false}
      />
    )

    const commandBox = screen.getByText('Test Command').closest('.command-box')
    fireEvent.click(commandBox!)

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(command)
    })
  })

  it('shows "Copied" text after clicking', async () => {
    render(
      <CommandBox
        name="Test Command"
        command="test command"
        primary={false}
      />
    )

    const commandBox = screen.getByText('Test Command').closest('.command-box')
    fireEvent.click(commandBox!)

    await waitFor(() => {
      expect(screen.getByText('Copied')).toBeInTheDocument()
    })
  })

  it('tracks copy event with skillId when provided', async () => {
    const { trackCopyEvent } = await import('../lib/analytics')

    render(
      <CommandBox
        name="Test Command"
        command="test command"
        primary={false}
        skillId="my-skill"
      />
    )

    const commandBox = screen.getByText('Test Command').closest('.command-box')
    fireEvent.click(commandBox!)

    await waitFor(() => {
      expect(trackCopyEvent).toHaveBeenCalledWith('my-skill')
    })
  })

  it('tracks copy event with formatted name when skillId not provided', async () => {
    const { trackCopyEvent } = await import('../lib/analytics')

    render(
      <CommandBox
        name="Gemini CLI"
        command="test command"
        primary={false}
      />
    )

    const commandBox = screen.getByText('Gemini CLI').closest('.command-box')
    fireEvent.click(commandBox!)

    await waitFor(() => {
      expect(trackCopyEvent).toHaveBeenCalledWith('gemini-cli')
    })
  })
})
