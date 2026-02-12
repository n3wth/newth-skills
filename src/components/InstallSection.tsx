'use client'
import { useState } from 'react'
import { installCommands } from '../config/commands'
import { assistantList } from '../config/assistants'
import { CommandBox } from './CommandBox'
import { AssistantIcon } from './AssistantIcon'
import { useScrollReveal } from '../hooks'

export function InstallSection() {
  const [showAll, setShowAll] = useState(false)
  const sectionRef = useScrollReveal({ direction: 'up', distance: 35, stagger: 0.15, duration: 0.9 })
  
  const primaryCommands = installCommands.filter(cmd => 
    cmd.assistantId === 'gemini' || cmd.assistantId === 'claude' || cmd.assistantId === 'all'
  )
  const additionalCommands = installCommands.filter(cmd => 
    cmd.assistantId !== 'gemini' && cmd.assistantId !== 'claude' && cmd.assistantId !== 'all'
  )

  return (
    <div ref={sectionRef} className="mb-16 md:mb-24">
      <div>
        <h2 className="text-xl md:text-2xl font-medium mb-2 text-white">
          Install
        </h2>
        <p className="label mb-4">
          One command. Works offline. No servers, no waiting, and no limits.
        </p>
      </div>

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
            assistantId={cmd.assistantId}
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
            Show {additionalCommands.length} more assistants (Cursor, Windsurf, Cody, and Copilot)
          </button>
        )}
        
        {showAll && additionalCommands.map((cmd) => (
          <CommandBox
            key={cmd.name}
            name={cmd.name}
            command={cmd.command}
            primary={cmd.primary}
            assistantId={cmd.assistantId}
          />
        ))}
      </div>
    </div>
  )
}
