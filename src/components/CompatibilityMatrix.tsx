import { assistantList, type AssistantId } from '../config/assistants'
import { AssistantIcon } from './AssistantIcon'

interface CompatibilityMatrixProps {
  compatibility?: AssistantId[]
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function CompatibilityMatrix({ 
  compatibility = [], 
  showLabels = false,
  size = 'md' 
}: CompatibilityMatrixProps) {
  const sizeConfig = {
    sm: { icon: 12, padding: 'px-2 py-1', text: 'text-[10px]', gap: 'gap-1' },
    md: { icon: 14, padding: 'px-3 py-1.5', text: 'text-xs', gap: 'gap-1.5' },
    lg: { icon: 16, padding: 'px-3 py-2', text: 'text-sm', gap: 'gap-2' },
  }

  const config = sizeConfig[size]

  return (
    <div className={`flex flex-wrap items-center ${config.gap}`}>
      {assistantList.map(assistant => {
        const isCompatible = compatibility.includes(assistant.id)
        
        return (
          <span
            key={assistant.id}
            className={`${config.text} font-medium ${config.padding} rounded-full flex items-center ${config.gap} transition-opacity`}
            style={{
              color: isCompatible ? assistant.color : 'var(--color-grey-600)',
              backgroundColor: isCompatible ? assistant.bgColor : 'transparent',
              border: `1px solid ${isCompatible ? assistant.borderColor : 'var(--glass-border)'}`,
              opacity: isCompatible ? 1 : 0.4,
            }}
            title={`${assistant.name}${isCompatible ? '' : ' (not compatible)'}`}
          >
            <AssistantIcon assistant={assistant.id} size={config.icon} />
            {showLabels && <span>{assistant.shortName}</span>}
          </span>
        )
      })}
    </div>
  )
}
