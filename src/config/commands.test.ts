import { describe, it, expect } from 'vitest'
import { installCommands } from './commands'

describe('installCommands', () => {
  it('should be an array with items', () => {
    expect(Array.isArray(installCommands)).toBe(true)
    expect(installCommands.length).toBeGreaterThan(0)
  })

  it('should have valid command structure', () => {
    installCommands.forEach(cmd => {
      expect(cmd.name).toBeDefined()
      expect(typeof cmd.name).toBe('string')

      expect(cmd.command).toBeDefined()
      expect(typeof cmd.command).toBe('string')

      expect(typeof cmd.primary).toBe('boolean')
    })
  })

  it('should have exactly one primary command', () => {
    const primaryCommands = installCommands.filter(cmd => cmd.primary)
    expect(primaryCommands.length).toBe(1)
  })

  it('should have commands for Gemini CLI, Claude Code, and Everything', () => {
    const names = installCommands.map(cmd => cmd.name)
    expect(names).toContain('Gemini CLI')
    expect(names).toContain('Claude Code')
    expect(names).toContain('Everything')
  })

  it('should have valid curl commands', () => {
    installCommands.forEach(cmd => {
      expect(cmd.command).toContain('curl')
      expect(cmd.command).toContain('https://skills.newth.ai/install.sh')
    })
  })
})
