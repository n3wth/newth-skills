import chalk, { ChalkInstance } from 'chalk'

export const colors = {
  primary: chalk.hex('#00D9FF'),
  secondary: chalk.hex('#FF6B6B'),
  success: chalk.hex('#4ADE80'),
  warning: chalk.hex('#FBBF24'),
  error: chalk.hex('#EF4444'),
  info: chalk.hex('#60A5FA'),
  muted: chalk.hex('#6B7280'),
  highlight: chalk.hex('#A78BFA'),
}

export const categoryColors: Record<string, ChalkInstance> = {
  development: chalk.hex('#86EFAC'),
  documents: chalk.hex('#FCA5A5'),
  creative: chalk.hex('#93C5FD'),
  productivity: chalk.hex('#FDE047'),
  business: chalk.hex('#C4B5FD'),
}

export function formatSkillName(name: string): string {
  return colors.primary.bold(name)
}

export function formatCategory(category: string): string {
  const color = categoryColors[category] || colors.muted
  return color(`[${category}]`)
}

export function formatVersion(version: string): string {
  return colors.muted(`v${version}`)
}

export function formatTags(tags: string[]): string {
  return tags.map(tag => colors.highlight(`#${tag}`)).join(' ')
}

export function formatHeader(text: string): string {
  return chalk.bold.white(text)
}

export function formatSuccess(text: string): string {
  return colors.success(text)
}

export function formatError(text: string): string {
  return colors.error(text)
}

export function formatWarning(text: string): string {
  return colors.warning(text)
}

export function formatInfo(text: string): string {
  return colors.info(text)
}

export function box(content: string, title?: string): string {
  const lines = content.split('\n')
  // eslint-disable-next-line no-control-regex
  const maxLength = Math.max(...lines.map(l => l.replace(/\x1b\[[0-9;]*m/g, '').length), title?.length || 0)
  const width = maxLength + 4

  const top = title
    ? `${colors.muted('┌─')} ${colors.primary.bold(title)} ${colors.muted('─'.repeat(width - title.length - 4))}${colors.muted('┐')}`
    : colors.muted(`┌${'─'.repeat(width)}┐`)
  const bottom = colors.muted(`└${'─'.repeat(width)}┘`)

  const paddedLines = lines.map(line => {
    // eslint-disable-next-line no-control-regex
    const visibleLength = line.replace(/\x1b\[[0-9;]*m/g, '').length
    const padding = ' '.repeat(maxLength - visibleLength)
    return `${colors.muted('│')}  ${line}${padding}  ${colors.muted('│')}`
  })

  return [top, ...paddedLines, bottom].join('\n')
}

export function divider(char = '─', length = 50): string {
  return colors.muted(char.repeat(length))
}
