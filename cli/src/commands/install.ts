import { writeFileSync } from 'fs'
import { join } from 'path'
import { getSkillById, fetchSkillContent } from '../utils/skills.js'
import {
  formatSkillName,
  formatCategory,
  colors,
  divider,
} from '../utils/colors.js'
import {
  addInstalledSkill,
  isSkillInstalled,
  ensureSkillsDir,
} from '../utils/config.js'
import { createSpinner } from '../utils/spinner.js'

interface InstallOptions {
  platform?: 'gemini' | 'claude' | 'both'
  force?: boolean
}

export async function installCommand(skillId: string, options: InstallOptions): Promise<void> {
  if (!skillId || skillId.trim().length === 0) {
    console.log(colors.error('Please provide a skill ID.'))
    console.log(colors.muted('Usage: newth-skills install <skill-id>'))
    console.log(colors.muted('       newth-skills install <skill-id> --platform gemini'))
    return
  }

  const skill = getSkillById(skillId)

  if (!skill) {
    console.log(colors.error(`Skill not found: ${skillId}`))
    console.log(colors.muted('Use `newth-skills list` to see all available skills.'))
    return
  }

  const existingInstall = isSkillInstalled(skill.id)
  if (existingInstall && !options.force) {
    console.log(colors.warning(`Skill "${skill.name}" is already installed.`))
    console.log(colors.muted('Use --force to reinstall.'))
    return
  }

  console.log()
  console.log(`  ${skill.icon}  Installing ${formatSkillName(skill.name)} ${formatCategory(skill.category)}`)
  console.log(divider())
  console.log()

  const platform = options.platform || determinePlatform(skill.compatibility)

  if (platform === 'both' || platform === 'gemini') {
    if (!skill.compatibility || skill.compatibility.includes('gemini')) {
      await installForPlatform(skill, 'gemini')
    } else {
      console.log(colors.warning('  Skipping Gemini CLI (not compatible)'))
    }
  }

  if (platform === 'both' || platform === 'claude') {
    if (!skill.compatibility || skill.compatibility.includes('claude')) {
      await installForPlatform(skill, 'claude')
    } else {
      console.log(colors.warning('  Skipping Claude Code (not compatible)'))
    }
  }

  addInstalledSkill({
    id: skill.id,
    version: skill.version,
    installedAt: new Date().toISOString(),
    platform: platform,
  })

  console.log()
  console.log(colors.success(`  Successfully installed ${skill.name}!`))
  console.log()
  console.log(colors.muted('  The skill is now available in your AI coding assistant.'))
  console.log(colors.muted('  Try using it by mentioning relevant keywords in your prompts.'))
  console.log()
}

function determinePlatform(compatibility?: ('gemini' | 'claude')[]): 'gemini' | 'claude' | 'both' {
  if (!compatibility || compatibility.length === 0) {
    return 'both'
  }
  if (compatibility.length === 1) {
    return compatibility[0]
  }
  return 'both'
}

async function installForPlatform(skill: ReturnType<typeof getSkillById>, platform: 'gemini' | 'claude'): Promise<void> {
  if (!skill) return

  const platformName = platform === 'gemini' ? 'Gemini CLI' : 'Claude Code'
  const spinner = createSpinner(`Installing for ${platformName}...`)
  spinner.start()

  try {
    const skillsDir = ensureSkillsDir(platform)
    const skillFileName = `${skill.id}.md`
    const skillPath = join(skillsDir, skillFileName)

    let content: string

    if (skill.skillFile) {
      const fetchedContent = await fetchSkillContent(skill)
      if (fetchedContent) {
        content = fetchedContent
      } else {
        content = generateSkillContent(skill)
      }
    } else {
      content = generateSkillContent(skill)
    }

    writeFileSync(skillPath, content, 'utf-8')
    spinner.succeed(`Installed for ${platformName} at ${colors.muted(skillPath)}`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    spinner.fail(`Failed to install for ${platformName}: ${errorMessage}`)
  }
}

function generateSkillContent(skill: ReturnType<typeof getSkillById>): string {
  if (!skill) return ''

  const lines: string[] = [
    `# ${skill.name}`,
    '',
    skill.longDescription || skill.description,
    '',
  ]

  if (skill.features && skill.features.length > 0) {
    lines.push('## Features')
    lines.push('')
    for (const feature of skill.features) {
      lines.push(`- ${feature}`)
    }
    lines.push('')
  }

  if (skill.useCases && skill.useCases.length > 0) {
    lines.push('## Use Cases')
    lines.push('')
    for (const useCase of skill.useCases) {
      lines.push(`- ${useCase}`)
    }
    lines.push('')
  }

  if (skill.samplePrompts && skill.samplePrompts.length > 0) {
    lines.push('## Example Prompts')
    lines.push('')
    for (const sample of skill.samplePrompts) {
      lines.push(`### ${sample.prompt}`)
      lines.push('')
      lines.push(sample.output)
      lines.push('')
    }
  }

  lines.push('---')
  lines.push(`Version: ${skill.version}`)
  lines.push(`Category: ${skill.category}`)
  lines.push(`Tags: ${skill.tags.join(', ')}`)

  return lines.join('\n')
}
