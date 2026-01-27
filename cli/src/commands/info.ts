import { getSkillById, fetchSkillContent } from '../utils/skills.js'
import {
  formatCategory,
  formatVersion,
  formatTags,
  formatHeader,
  colors,
  divider,
  box,
} from '../utils/colors.js'
import { isSkillInstalled } from '../utils/config.js'
import { createSpinner } from '../utils/spinner.js'

export async function infoCommand(skillId: string): Promise<void> {
  if (!skillId || skillId.trim().length === 0) {
    console.log(colors.error('Please provide a skill ID.'))
    console.log(colors.muted('Usage: newth-skills info <skill-id>'))
    return
  }

  const skill = getSkillById(skillId)

  if (!skill) {
    console.log(colors.error(`Skill not found: ${skillId}`))
    console.log(colors.muted('Use `newth-skills list` to see all available skills.'))
    return
  }

  const installed = isSkillInstalled(skill.id)

  console.log()
  console.log(formatHeader(`  ${skill.icon}  ${skill.name}`))
  console.log(divider())
  console.log()

  console.log(`  ${colors.muted('ID:')}          ${colors.primary(skill.id)}`)
  console.log(`  ${colors.muted('Version:')}     ${formatVersion(skill.version)}`)
  console.log(`  ${colors.muted('Category:')}    ${formatCategory(skill.category)}`)
  console.log(`  ${colors.muted('Updated:')}     ${colors.info(skill.lastUpdated)}`)
  console.log(`  ${colors.muted('Status:')}      ${installed ? colors.success('Installed') : colors.muted('Not installed')}`)

  if (skill.compatibility && skill.compatibility.length > 0) {
    const platforms = skill.compatibility.map(p =>
      p === 'gemini' ? colors.info('Gemini CLI') : colors.highlight('Claude Code')
    ).join(', ')
    console.log(`  ${colors.muted('Platforms:')}   ${platforms}`)
  }

  console.log()
  console.log(`  ${colors.muted('Tags:')}        ${formatTags(skill.tags)}`)
  console.log()

  console.log(formatHeader('  Description'))
  console.log(divider('─', 40))
  console.log()
  console.log(`  ${colors.muted(skill.longDescription || skill.description)}`)
  console.log()

  if (skill.features && skill.features.length > 0) {
    console.log(formatHeader('  Features'))
    console.log(divider('─', 40))
    console.log()
    for (const feature of skill.features) {
      console.log(`  ${colors.success('•')} ${feature}`)
    }
    console.log()
  }

  if (skill.useCases && skill.useCases.length > 0) {
    console.log(formatHeader('  Use Cases'))
    console.log(divider('─', 40))
    console.log()
    for (const useCase of skill.useCases) {
      console.log(`  ${colors.info('→')} ${useCase}`)
    }
    console.log()
  }

  if (skill.samplePrompts && skill.samplePrompts.length > 0) {
    console.log(formatHeader('  Sample Prompts'))
    console.log(divider('─', 40))
    console.log()
    for (const sample of skill.samplePrompts.slice(0, 2)) {
      console.log(box(sample.prompt, 'Prompt'))
      console.log()
    }
  }

  if (skill.contributor) {
    console.log(formatHeader('  Contributor'))
    console.log(divider('─', 40))
    console.log()
    console.log(`  ${colors.muted('Name:')}   ${skill.contributor.name}`)
    if (skill.contributor.github) {
      console.log(`  ${colors.muted('GitHub:')} ${colors.info(`@${skill.contributor.github}`)}`)
    }
    console.log()
  }

  if (skill.skillFile) {
    const spinner = createSpinner('Fetching skill content...')
    spinner.start()

    const content = await fetchSkillContent(skill)
    if (content) {
      spinner.succeed('Skill file available')
      console.log()
      console.log(colors.muted(`  Skill file: ${skill.skillFile}`))
    } else {
      spinner.info('Skill file not available for preview')
    }
    console.log()
  }

  console.log(divider())
  if (installed) {
    console.log(colors.muted('  Use `newth-skills uninstall ' + skill.id + '` to remove this skill'))
  } else {
    console.log(colors.muted('  Use `newth-skills install ' + skill.id + '` to install this skill'))
  }
  console.log()
}
