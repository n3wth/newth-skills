import { getAllSkills, getSkillsByCategory, getCategories, Skill } from '../utils/skills.js'
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

interface ListOptions {
  category?: string
  installed?: boolean
  featured?: boolean
}

export function listCommand(options: ListOptions): void {
  let skills: Skill[]

  if (options.category) {
    skills = getSkillsByCategory(options.category)
    if (skills.length === 0) {
      console.log(colors.warning(`No skills found in category: ${options.category}`))
      console.log(colors.muted(`Available categories: ${getCategories().join(', ')}`))
      return
    }
  } else {
    skills = getAllSkills()
  }

  if (options.featured) {
    skills = skills.filter(s => s.featured)
  }

  if (options.installed) {
    skills = skills.filter(s => isSkillInstalled(s.id))
    if (skills.length === 0) {
      console.log(colors.warning('No skills installed yet.'))
      console.log(colors.muted('Use `newth-skills install <skill-id>` to install a skill.'))
      return
    }
  }

  console.log()
  console.log(formatHeader(`  Available Skills (${skills.length})`))
  console.log(divider())
  console.log()

  const grouped = groupByCategory(skills)

  for (const [category, categorySkills] of Object.entries(grouped)) {
    console.log(formatCategory(category.toUpperCase()))
    console.log()

    for (const skill of categorySkills) {
      const installed = isSkillInstalled(skill.id)
      const installedBadge = installed ? colors.success(' [installed]') : ''
      const featuredBadge = skill.featured ? colors.warning(' ★') : ''

      console.log(`  ${skill.icon}  ${formatSkillName(skill.name)}${featuredBadge}${installedBadge}`)
      console.log(`     ${colors.muted(skill.id)} ${formatVersion(skill.version)}`)
      console.log(`     ${colors.muted(truncate(skill.description, 70))}`)
      console.log(`     ${formatTags(skill.tags.slice(0, 4))}`)
      console.log()
    }
  }

  console.log(divider())
  console.log(colors.muted('  Use `newth-skills info <skill-id>` for more details'))
  console.log(colors.muted('  Use `newth-skills install <skill-id>` to install a skill'))
  console.log()
}

function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}
