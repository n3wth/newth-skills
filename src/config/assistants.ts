// AI Assistant configuration for multi-platform support
export type AssistantId = 'gemini' | 'claude' | 'cursor' | 'windsurf' | 'cody' | 'copilot'

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
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    icon: 'gemini',
    skillsDir: '~/.gemini/skills',
    installCommand: (skillId: string, skillFileUrl?: string) => 
      skillFileUrl 
        ? `curl -fsSL ${skillFileUrl} -o ~/.gemini/skills/${skillId}.md`
        : `curl -fsSL https://skills.newth.ai/install.sh | bash -s -- gemini ${skillId}`,
    description: "Google's AI coding assistant",
  },
  claude: {
    id: 'claude',
    name: 'Claude Code',
    shortName: 'Claude',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: 'rgba(249, 115, 22, 0.3)',
    icon: 'claude',
    skillsDir: '~/.claude/skills',
    installCommand: (skillId: string, skillFileUrl?: string) => 
      skillFileUrl 
        ? `curl -fsSL ${skillFileUrl} -o ~/.claude/skills/${skillId}.md`
        : `curl -fsSL https://skills.newth.ai/install.sh | bash -s -- claude ${skillId}`,
    description: "Anthropic's AI coding assistant",
  },
  cursor: {
    id: 'cursor',
    name: 'Cursor',
    shortName: 'Cursor',
    color: '#00d4aa',
    bgColor: 'rgba(0, 212, 170, 0.15)',
    borderColor: 'rgba(0, 212, 170, 0.3)',
    icon: 'cursor',
    skillsDir: '~/.cursor/skills',
    installCommand: (skillId: string, skillFileUrl?: string) => 
      skillFileUrl 
        ? `curl -fsSL ${skillFileUrl} -o ~/.cursor/skills/${skillId}.md`
        : `curl -fsSL https://skills.newth.ai/install.sh | bash -s -- cursor ${skillId}`,
    description: 'AI-first code editor',
  },
  windsurf: {
    id: 'windsurf',
    name: 'Windsurf',
    shortName: 'Windsurf',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    icon: 'windsurf',
    skillsDir: '~/.windsurf/skills',
    installCommand: (skillId: string, skillFileUrl?: string) => 
      skillFileUrl 
        ? `curl -fsSL ${skillFileUrl} -o ~/.windsurf/skills/${skillId}.md`
        : `curl -fsSL https://skills.newth.ai/install.sh | bash -s -- windsurf ${skillId}`,
    description: 'Codeium AI-powered IDE',
  },
  cody: {
    id: 'cody',
    name: 'Sourcegraph Cody',
    shortName: 'Cody',
    color: '#ff5543',
    bgColor: 'rgba(255, 85, 67, 0.15)',
    borderColor: 'rgba(255, 85, 67, 0.3)',
    icon: 'cody',
    skillsDir: '~/.cody/skills',
    installCommand: (skillId: string, skillFileUrl?: string) => 
      skillFileUrl 
        ? `curl -fsSL ${skillFileUrl} -o ~/.cody/skills/${skillId}.md`
        : `curl -fsSL https://skills.newth.ai/install.sh | bash -s -- cody ${skillId}`,
    description: 'Sourcegraph AI coding assistant',
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
