import { useState } from 'react'
import { installCommands } from '../config/commands'
import { assistantList } from '../config/assistants'
import { CommandBox } from './CommandBox'
import { AssistantIcon } from './AssistantIcon'

export function InstallSection() {
  const [showAll, setShowAll] = useState(false)
  
  const primaryCommands = installCommands.filter(cmd => 
    cmd.assistantId === 'gemini' || cmd.assistantId === 'claude' || cmd.assistantId === 'all'
  )
  const additionalCommands = installCommands.filter(cmd => 
    cmd.assistantId !== 'gemini' && cmd.assistantId !== 'claude' && cmd.assistantId !== 'all'
  )

  return (
    <div className="mb-16 md:mb-24">
      <h2 className="text-xl md:text-2xl font-medium mb-2 text-white">
        Get Started
      </h2>
      <p className="label mb-4">
        Pick your AI assistant and run one command to install all skills.
      </p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {assistantList.map(assistant => (
          <span
            key={assistant.id}
            className="text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5"
            style={{
              color: assistant.color,
              backgroundColor: assistant.bgColor,
              border: `1px solid ${assistant.borderColor}`,
            }}
            title={assistant.description}
          >
            <AssistantIcon assistant={assistant.id} size={12} />
            {assistant.shortName}
          </span>
        ))}
      </div>

      <div className="space-y-3">
        {primaryCommands.map((cmd) => (
          <CommandBox
            key={cmd.name}
            name={cmd.name}
            command={cmd.command}
            primary={cmd.primary}
          />
        ))}
        
        {!showAll && additionalCommands.length > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full py-3 text-sm font-medium rounded-xl transition-colors"
            style={{
              color: 'var(--color-grey-400)',
              backgroundColor: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
            }}
          >
            Show {additionalCommands.length} more assistants (Cursor, Windsurf, Cody, Copilot)
          </button>
        )}
        
        {showAll && additionalCommands.map((cmd) => (
          <CommandBox
            key={cmd.name}
            name={cmd.name}
            command={cmd.command}
            primary={cmd.primary}
          />
        ))}
      </div>
    </div>
  )
}
