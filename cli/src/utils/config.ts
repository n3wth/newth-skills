import { homedir } from 'os'
import { join } from 'path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'

export interface InstalledSkill {
  id: string
  version: string
  installedAt: string
  platform: 'gemini' | 'claude' | 'both'
}

export interface Config {
  installedSkills: InstalledSkill[]
  lastUpdated: string | null
}

const CONFIG_DIR = join(homedir(), '.newth-skills')
const CONFIG_FILE = join(CONFIG_DIR, 'config.json')

function ensureConfigDir(): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true })
  }
}

export function getConfig(): Config {
  ensureConfigDir()

  if (!existsSync(CONFIG_FILE)) {
    const defaultConfig: Config = {
      installedSkills: [],
      lastUpdated: null,
    }
    writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2))
    return defaultConfig
  }

  try {
    const content = readFileSync(CONFIG_FILE, 'utf-8')
    return JSON.parse(content) as Config
  } catch {
    return {
      installedSkills: [],
      lastUpdated: null,
    }
  }
}

export function saveConfig(config: Config): void {
  ensureConfigDir()
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
}

export function addInstalledSkill(skill: InstalledSkill): void {
  const config = getConfig()
  const existingIndex = config.installedSkills.findIndex(s => s.id === skill.id)

  if (existingIndex >= 0) {
    config.installedSkills[existingIndex] = skill
  } else {
    config.installedSkills.push(skill)
  }

  saveConfig(config)
}

export function removeInstalledSkill(skillId: string): boolean {
  const config = getConfig()
  const initialLength = config.installedSkills.length
  config.installedSkills = config.installedSkills.filter(s => s.id !== skillId)

  if (config.installedSkills.length < initialLength) {
    saveConfig(config)
    return true
  }

  return false
}

export function isSkillInstalled(skillId: string): InstalledSkill | undefined {
  const config = getConfig()
  return config.installedSkills.find(s => s.id === skillId)
}

export function getInstalledSkills(): InstalledSkill[] {
  return getConfig().installedSkills
}

export function getGeminiSkillsDir(): string {
  return join(homedir(), '.gemini', 'skills')
}

export function getClaudeSkillsDir(): string {
  return join(homedir(), '.claude', 'skills')
}

export function ensureSkillsDir(platform: 'gemini' | 'claude'): string {
  const dir = platform === 'gemini' ? getGeminiSkillsDir() : getClaudeSkillsDir()
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  return dir
}
