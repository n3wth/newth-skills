import { getSkillById, fetchSkillContent } from '../utils/skills.js'
import {
  formatSkillName,
  formatVersion,
  colors,
  divider,
} from '../utils/colors.js'
import {
  getInstalledSkills,
  addInstalledSkill,
  ensureSkillsDir,
  InstalledSkill,
} from '../utils/config.js'
import { createSpinner, progressBar } from '../utils/spinner.js'
import { writeFileSync } from 'fs'
import { join } from 'path'

export async function updateCommand(): Promise<void> {
  const installedSkills = getInstalledSkills()

  if (installedSkills.length === 0) {
    console.log(colors.warning('No skills installed.'))
    console.log(colors.muted('Use `newth-skills install <skill-id>` to install a skill.'))
    return
  }

  console.log()
  console.log(`  Checking for updates...`)
  console.log(divider())
  console.log()

  const updates: { skill: InstalledSkill; newVersion: string }[] = []

  for (const installed of installedSkills) {
    const skill = getSkillById(installed.id)
    if (skill && skill.version !== installed.version) {
      updates.push({ skill: installed, newVersion: skill.version })
    }
  }

  if (updates.length === 0) {
    console.log(colors.success('  All skills are up to date!'))
    console.log()
    return
  }

  console.log(`  Found ${colors.info(updates.length.toString())} skill(s) with updates available:`)
  console.log()

  for (const update of updates) {
    const skill = getSkillById(update.skill.id)
    if (skill) {
      console.log(`  ${skill.icon}  ${formatSkillName(skill.name)}`)
      console.log(`     ${colors.muted(update.skill.version)} → ${colors.success(update.newVersion)}`)
    }
  }

  console.log()
  console.log(divider())
  console.log()

  let completed = 0
  for (const update of updates) {
    const skill = getSkillById(update.skill.id)
    if (!skill) continue

    const spinner = createSpinner(`Updating ${skill.name}...`)
    spinner.start()

    try {
      const platforms: ('gemini' | 'claude')[] =
        update.skill.platform === 'both'
          ? ['gemini', 'claude']
          : [update.skill.platform]

      for (const platform of platforms) {
        if (!skill.compatibility || skill.compatibility.includes(platform)) {
          await updateSkillForPlatform(skill, platform)
        }
      }

      addInstalledSkill({
        ...update.skill,
        version: skill.version,
        installedAt: new Date().toISOString(),
      })

      completed++
      spinner.succeed(`Updated ${skill.name} to ${formatVersion(skill.version)}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      spinner.fail(`Failed to update ${skill.name}: ${errorMessage}`)
    }

    console.log(`  ${progressBar(completed, updates.length)}`)
    console.log()
  }

  console.log(divider())
  console.log(colors.success(`  Successfully updated ${completed}/${updates.length} skill(s)!`))
  console.log()
}

async function updateSkillForPlatform(
  skill: ReturnType<typeof getSkillById>,
  platform: 'gemini' | 'claude'
): Promise<void> {
  if (!skill) return

  const skillsDir = ensureSkillsDir(platform)
  const skillPath = join(skillsDir, `${skill.id}.md`)

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

  lines.push('---')
  lines.push(`Version: ${skill.version}`)
  lines.push(`Category: ${skill.category}`)
  lines.push(`Tags: ${skill.tags.join(', ')}`)

  return lines.join('\n')
}
