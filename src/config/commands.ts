import type { AssistantId } from './assistants'

// Install command configuration for each assistant
export interface InstallCommand {
  name: string
  assistantId: AssistantId | 'all'
  command: string
  primary: boolean
}

// Install commands configuration for all supported AI assistants
export const installCommands: InstallCommand[] = [
  {
    name: 'For Gemini CLI',
    assistantId: 'gemini',
    command: 'curl -fsSL https://skills.newth.ai/install.sh | bash -s -- gemini',
    primary: true,
  },
  {
    name: 'For Claude Code',
    assistantId: 'claude',
    command: 'curl -fsSL https://skills.newth.ai/install.sh | bash -s -- claude',
    primary: false,
  },
  {
    name: 'For Cursor',
    assistantId: 'cursor',
    command: 'curl -fsSL https://skills.newth.ai/install.sh | bash -s -- cursor',
    primary: false,
  },
  {
    name: 'For Windsurf',
    assistantId: 'windsurf',
    command: 'curl -fsSL https://skills.newth.ai/install.sh | bash -s -- windsurf',
    primary: false,
  },
  {
    name: 'For Cody',
    assistantId: 'cody',
    command: 'curl -fsSL https://skills.newth.ai/install.sh | bash -s -- cody',
    primary: false,
  },
  {
    name: 'For GitHub Copilot',
    assistantId: 'copilot',
    command: 'curl -fsSL https://skills.newth.ai/install.sh | bash -s -- copilot',
    primary: false,
  },
  {
    name: 'Install All Skills',
    assistantId: 'all',
    command: 'curl -fsSL https://skills.newth.ai/install.sh | bash',
    primary: false,
  },
]

// Helper to get install command for a specific assistant
export function getInstallCommand(assistantId: AssistantId): InstallCommand | undefined {
  return installCommands.find(cmd => cmd.assistantId === assistantId)
}

// Helper to get skill-specific install command for an assistant
export function getSkillInstallCommand(
  assistantId: AssistantId, 
  skillId: string, 
  skillFileUrl?: string
): string {
  const skillsDir = {
    gemini: '~/.gemini/skills',
    claude: '~/.claude/skills',
    cursor: '~/.cursor/skills',
    windsurf: '~/.windsurf/skills',
    cody: '~/.cody/skills',
    copilot: '~/.copilot/skills',
  }

  if (skillFileUrl) {
    return `curl -fsSL ${skillFileUrl} -o ${skillsDir[assistantId]}/${skillId}.md`
  }
  
  return `curl -fsSL https://skills.newth.ai/install.sh | bash -s -- ${assistantId} ${skillId}`
}
