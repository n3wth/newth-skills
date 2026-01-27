#!/usr/bin/env node

import { Command } from 'commander'
import { listCommand } from './commands/list.js'
import { searchCommand } from './commands/search.js'
import { infoCommand } from './commands/info.js'
import { installCommand } from './commands/install.js'
import { uninstallCommand } from './commands/uninstall.js'
import { updateCommand } from './commands/update.js'
import { colors } from './utils/colors.js'

const program = new Command()

const banner = `
${colors.primary('  ███╗   ██╗███████╗██╗    ██╗████████╗██╗  ██╗')}
${colors.primary('  ████╗  ██║██╔════╝██║    ██║╚══██╔══╝██║  ██║')}
${colors.primary('  ██╔██╗ ██║█████╗  ██║ █╗ ██║   ██║   ███████║')}
${colors.primary('  ██║╚██╗██║██╔══╝  ██║███╗██║   ██║   ██╔══██║')}
${colors.primary('  ██║ ╚████║███████╗╚███╔███╔╝   ██║   ██║  ██║')}
${colors.primary('  ╚═╝  ╚═══╝╚══════╝ ╚══╝╚══╝    ╚═╝   ╚═╝  ╚═╝')}
${colors.muted('           AI Coding Skills Manager')}
`

program
  .name('newth-skills')
  .description('CLI tool for managing AI coding skills for Gemini CLI and Claude Code')
  .version('1.0.0')
  .addHelpText('beforeAll', banner)

program
  .command('list')
  .description('List all available skills')
  .option('-c, --category <category>', 'Filter by category (development, documents, creative, business)')
  .option('-i, --installed', 'Show only installed skills')
  .option('-f, --featured', 'Show only featured skills')
  .action((options) => {
    listCommand(options)
  })

program
  .command('search <query>')
  .description('Search skills by name, description, or tags')
  .action((query) => {
    searchCommand(query)
  })

program
  .command('info <skill-id>')
  .description('Show detailed information about a skill')
  .action(async (skillId) => {
    await infoCommand(skillId)
  })

program
  .command('install <skill-id>')
  .description('Install a skill')
  .option('-p, --platform <platform>', 'Target platform (gemini, claude, or both)', 'both')
  .option('-f, --force', 'Force reinstall if already installed')
  .action(async (skillId, options) => {
    await installCommand(skillId, options)
  })

program
  .command('uninstall <skill-id>')
  .description('Uninstall a skill')
  .action(async (skillId) => {
    await uninstallCommand(skillId)
  })

program
  .command('update')
  .description('Update all installed skills to their latest versions')
  .action(async () => {
    await updateCommand()
  })

program.parse()
