import { installCommands } from '../config/commands'
import { CommandBox } from './CommandBox'

export function InstallSection() {
  return (
    <div className="mb-16 md:mb-24">
      <h2 className="text-xl md:text-2xl font-medium mb-2 text-white">
        Install
      </h2>
      <p className="label mb-6 md:mb-8">One command. All skills.</p>

      <div className="space-y-3">
        {installCommands.map((cmd) => (
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
