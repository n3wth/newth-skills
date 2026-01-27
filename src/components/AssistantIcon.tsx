import type { AssistantId } from '../config/assistants'

interface AssistantIconProps {
  assistant: AssistantId
  size?: number
  className?: string
}

export function AssistantIcon({ assistant, size = 16, className = '' }: AssistantIconProps) {
  const iconProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    className,
  }

  switch (assistant) {
    case 'gemini':
      // Google Gemini sparkle icon
      return (
        <svg {...iconProps}>
          <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" />
        </svg>
      )
    case 'claude':
      // Anthropic Claude icon (stylized C)
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M4.709 15.955l4.72-2.647.08-.08 2.726-4.721c.398-.65 1.63-.65 2.029 0l2.726 4.72.08.08 4.72 2.648c.65.398.65 1.63 0 2.029l-4.72 2.726-.08.08-2.726 4.72c-.399.65-1.63.65-2.03 0L9.51 20.79l-.08-.08-4.72-2.726c-.65-.399-.65-1.63 0-2.029z" />
        </svg>
      )
    case 'cursor':
      // Cursor arrow/pointer icon
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.89 0 1.33-1.08.7-1.71L6.21 2.51c-.63-.63-1.71-.18-1.71.7z" />
        </svg>
      )
    case 'windsurf':
      // Windsurf/Codeium wave icon
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M2 12c2-3 4-4.5 6-4.5s4 1.5 6 4.5c2-3 4-4.5 6-4.5s4 1.5 6 4.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17c2-3 4-4.5 6-4.5s4 1.5 6 4.5c2-3 4-4.5 6-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'cody':
      // Sourcegraph Cody icon
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L19 8l-7 3.5L5 8l7-3.5zM4 9.5l7 3.5v7l-7-3.5v-7zm16 0v7l-7 3.5v-7l7-3.5z" />
        </svg>
      )
    case 'copilot':
      // GitHub Copilot glasses/visor icon
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 2.13.67 4.1 1.8 5.72L12 22l8.2-4.28A9.96 9.96 0 0 0 22 12c0-5.52-4.48-10-10-10zm-4.5 9.5c0-1.1.9-2 2-2h5c1.1 0 2 .9 2 2v1c0 1.1-.9 2-2 2h-5c-1.1 0-2-.9-2-2v-1z" />
        </svg>
      )
    default:
      return null
  }
}
