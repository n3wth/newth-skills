import { unlinkSync, existsSync } from 'fs'
import { join } from 'path'
import { getSkillById } from '../utils/skills.js'
import {
  formatSkillName,
  colors,
  divider,
} from '../utils/colors.js'
import {
  removeInstalledSkill,
  isSkillInstalled,
  getGeminiSkillsDir,
  getClaudeSkillsDir,
} from '../utils/config.js'
import { createSpinner } from '../utils/spinner.js'

export async function uninstallCommand(skillId: string): Promise<void> {
  if (!skillId || skillId.trim().length === 0) {
    console.log(colors.error('Please provide a skill ID.'))
    console.log(colors.muted('Usage: newth-skills uninstall <skill-id>'))
    return
  }

  const skill = getSkillById(skillId)
  const installed = isSkillInstalled(skillId)

  if (!installed) {
    console.log(colors.warning(`Skill "${skillId}" is not installed.`))
    console.log(colors.muted('Use `newth-skills list --installed` to see installed skills.'))
    return
  }

  const skillName = skill?.name || skillId

  console.log()
  console.log(`  Uninstalling ${formatSkillName(skillName)}`)
  console.log(divider())
  console.log()

  const platforms: ('gemini' | 'claude')[] = ['gemini', 'claude']

  for (const platform of platforms) {
    await uninstallFromPlatform(skillId, platform)
  }

  const removed = removeInstalledSkill(skillId)

  if (removed) {
    console.log()
    console.log(colors.success(`  Successfully uninstalled ${skillName}!`))
    console.log()
  } else {
    console.log()
    console.log(colors.warning(`  Could not find ${skillName} in installed skills.`))
    console.log()
  }
}

async function uninstallFromPlatform(skillId: string, platform: 'gemini' | 'claude'): Promise<void> {
  const platformName = platform === 'gemini' ? 'Gemini CLI' : 'Claude Code'
  const skillsDir = platform === 'gemini' ? getGeminiSkillsDir() : getClaudeSkillsDir()
  const skillPath = join(skillsDir, `${skillId}.md`)

  const spinner = createSpinner(`Removing from ${platformName}...`)
  spinner.start()

  try {
    if (existsSync(skillPath)) {
      unlinkSync(skillPath)
      spinner.succeed(`Removed from ${platformName}`)
    } else {
      spinner.info(`Not found in ${platformName}`)
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    spinner.fail(`Failed to remove from ${platformName}: ${errorMessage}`)
  }
}
