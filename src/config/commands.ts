// Install commands configuration
export const installCommands = [
  {
    name: 'For Gemini CLI',
    command: 'curl -fsSL https://skills.newth.ai/install.sh | bash -s -- gemini',
    primary: true,
  },
  {
    name: 'For Claude Code',
    command: 'curl -fsSL https://skills.newth.ai/install.sh | bash -s -- claude',
    primary: false,
  },
  {
    name: 'Install All Skills',
    command: 'curl -fsSL https://skills.newth.ai/install.sh | bash',
    primary: false,
  },
]
