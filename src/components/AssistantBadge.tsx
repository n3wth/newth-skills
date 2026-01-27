import { assistants, type AssistantId } from '../config/assistants'
import { AssistantIcon } from './AssistantIcon'

interface AssistantBadgeProps {
  assistantId: AssistantId
  showName?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function AssistantBadge({ 
  assistantId, 
  showName = true,
  size = 'md' 
}: AssistantBadgeProps) {
  const assistant = assistants[assistantId]
  
  if (!assistant) return null

  const sizeConfig = {
    sm: { icon: 12, padding: 'px-2 py-1', text: 'text-[10px]', gap: 'gap-1' },
    md: { icon: 14, padding: 'px-3 py-1.5', text: 'text-xs', gap: 'gap-1.5' },
    lg: { icon: 16, padding: 'px-4 py-2', text: 'text-sm', gap: 'gap-2' },
  }

  const config = sizeConfig[size]

  return (
    <span
      className={`${config.text} font-medium ${config.padding} rounded-full flex items-center ${config.gap}`}
      style={{
        color: assistant.color,
        backgroundColor: assistant.bgColor,
        border: `1px solid ${assistant.borderColor}`,
      }}
      title={assistant.description}
    >
      <AssistantIcon assistant={assistantId} size={config.icon} />
      {showName && <span>{assistant.shortName}</span>}
    </span>
  )
}
