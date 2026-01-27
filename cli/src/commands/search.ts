import { searchSkills } from '../utils/skills.js'
import {
  formatSkillName,
  formatCategory,
  formatVersion,
  formatTags,
  formatHeader,
  colors,
  divider,
} from '../utils/colors.js'
import { isSkillInstalled } from '../utils/config.js'

export function searchCommand(query: string): void {
  if (!query || query.trim().length === 0) {
    console.log(colors.error('Please provide a search query.'))
    console.log(colors.muted('Usage: newth-skills search <query>'))
    return
  }

  const results = searchSkills(query)

  console.log()
  if (results.length === 0) {
    console.log(colors.warning(`No skills found matching "${query}"`))
    console.log(colors.muted('Try searching for:'))
    console.log(colors.muted('  - Skill names (e.g., "gsap", "pdf")'))
    console.log(colors.muted('  - Categories (e.g., "development", "creative")'))
    console.log(colors.muted('  - Tags (e.g., "animation", "testing")'))
    return
  }

  console.log(formatHeader(`  Search Results for "${query}" (${results.length} found)`))
  console.log(divider())
  console.log()

  for (const skill of results) {
    const installed = isSkillInstalled(skill.id)
    const installedBadge = installed ? colors.success(' [installed]') : ''
    const featuredBadge = skill.featured ? colors.warning(' ★') : ''

    console.log(`  ${skill.icon}  ${formatSkillName(skill.name)}${featuredBadge}${installedBadge}`)
    console.log(`     ${colors.muted(skill.id)} ${formatVersion(skill.version)} ${formatCategory(skill.category)}`)
    console.log(`     ${colors.muted(truncate(skill.description, 70))}`)
    console.log(`     ${formatTags(skill.tags.slice(0, 4))}`)
    console.log()
  }

  console.log(divider())
  console.log(colors.muted('  Use `newth-skills info <skill-id>` for more details'))
  console.log(colors.muted('  Use `newth-skills install <skill-id>` to install a skill'))
  console.log()
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}
