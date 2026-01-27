// Install commands configuration
export const installCommands = [
  {
    name: 'Gemini CLI',
    command: 'curl -fsSL https://skills.newth.ai/install.sh | bash -s -- gemini',
    primary: true,
  },
  {
    name: 'Claude Code',
    command: 'curl -fsSL https://skills.newth.ai/install.sh | bash -s -- claude',
    primary: false,
  },
  {
    name: 'Everything',
    command: 'curl -fsSL https://skills.newth.ai/install.sh | bash',
    primary: false,
  },
]
