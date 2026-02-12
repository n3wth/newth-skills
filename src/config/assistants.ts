// AI Assistant configuration for multi-platform support
export type AssistantId = 'gemini' | 'claude' | 'cursor' | 'windsurf' | 'copilot'

export interface AIAssistant {
  id: AssistantId
  name: string
  shortName: string
  color: string
  bgColor: string
  borderColor: string
  icon: string
  skillsDir: string
  installCommand: (skillId: string, skillFileUrl?: string) => string
  description: string
}

export const assistants: Record<AssistantId, AIAssistant> = {
  gemini: {
    id: 'gemini',
    name: 'Gemini CLI',
    shortName: 'Gemini',
    color: '#4285F4',
    bgColor: 'rgba(66, 133, 244, 0.15)',
    borderColor: 'rgba(66, 133, 244, 0.3)',
    icon: 'gemini',
    skillsDir: '~/.gemini/skills',
    installCommand: (skillId: string, skillFileUrl?: string) => 
      skillFileUrl 
        ? `curl -fsSL ${skillFileUrl} -o ~/.gemini/skills/${skillId}.md`
        : `curl -fsSL https://skills.newth.ai/install.sh | bash -s -- gemini ${skillId}`,
    description: 'Google AI coding assistant',
  },
  claude: {
    id: 'claude',
    name: 'Claude Code',
    shortName: 'Claude',
    color: '#D97706',
    bgColor: 'rgba(217, 119, 6, 0.15)',
    borderColor: 'rgba(217, 119, 6, 0.3)',
    icon: 'claude',
    skillsDir: '~/.claude/skills',
    installCommand: (skillId: string, skillFileUrl?: string) => 
      skillFileUrl 
        ? `curl -fsSL ${skillFileUrl} -o ~/.claude/skills/${skillId}.md`
        : `curl -fsSL https://skills.newth.ai/install.sh | bash -s -- claude ${skillId}`,
    description: 'Anthropic AI coding assistant',
  },
  cursor: {
    id: 'cursor',
    name: 'Cursor',
    shortName: 'Cursor',
    color: '#19C37D',
    bgColor: 'rgba(25, 195, 125, 0.15)',
    borderColor: 'rgba(25, 195, 125, 0.3)',
    icon: 'cursor',
    skillsDir: '~/.cursor/skills',
    installCommand: (skillId: string, skillFileUrl?: string) => 
      skillFileUrl 
        ? `curl -fsSL ${skillFileUrl} -o ~/.cursor/skills/${skillId}.md`
        : `curl -fsSL https://skills.newth.ai/install.sh | bash -s -- cursor ${skillId}`,
    description: 'AI-native code editor',
  },
  windsurf: {
    id: 'windsurf',
    name: 'Windsurf',
    shortName: 'Windsurf',
    color: '#09B6A2',
    bgColor: 'rgba(9, 182, 162, 0.15)',
    borderColor: 'rgba(9, 182, 162, 0.3)',
    icon: 'windsurf',
    skillsDir: '~/.windsurf/skills',
    installCommand: (skillId: string, skillFileUrl?: string) => 
      skillFileUrl 
        ? `curl -fsSL ${skillFileUrl} -o ~/.windsurf/skills/${skillId}.md`
        : `curl -fsSL https://skills.newth.ai/install.sh | bash -s -- windsurf ${skillId}`,
    description: 'Codeium AI code editor',
  },
  copilot: {
    id: 'copilot',
    name: 'GitHub Copilot',
    shortName: 'Copilot',
    color: '#6e40c9',
    bgColor: 'rgba(110, 64, 201, 0.15)',
    borderColor: 'rgba(110, 64, 201, 0.3)',
    icon: 'copilot',
    skillsDir: '~/.copilot/skills',
    installCommand: (skillId: string, skillFileUrl?: string) => 
      skillFileUrl 
        ? `curl -fsSL ${skillFileUrl} -o ~/.copilot/skills/${skillId}.md`
        : `curl -fsSL https://skills.newth.ai/install.sh | bash -s -- copilot ${skillId}`,
    description: 'GitHub AI pair programmer',
  },
}

// Helper to get all assistant IDs
export const assistantIds = Object.keys(assistants) as AssistantId[]

// Helper to get assistants as array
export const assistantList = Object.values(assistants)

// Default compatibility for skills that don't specify
export const defaultCompatibility: AssistantId[] = ['gemini', 'claude']
