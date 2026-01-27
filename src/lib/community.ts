// Community features: bundles, voting, and feature requests
const BUNDLES_STORAGE_KEY = 'newth-skills-bundles'
const VOTES_STORAGE_KEY = 'newth-skills-votes'
const REQUESTS_STORAGE_KEY = 'newth-skills-requests'

export interface SkillBundle {
  id: string
  name: string
  description: string
  skillIds: string[]
  createdAt: number
  updatedAt: number
}

export interface FeatureRequest {
  id: string
  title: string
  description: string
  category: string
  votes: number
  createdAt: number
  status: 'open' | 'planned' | 'completed'
}

export interface VoteData {
  skillVotes: Record<string, number>
  userVotedSkills: string[]
  requestVotes: Record<string, number>
  userVotedRequests: string[]
}

// Bundle functions
function getBundles(): SkillBundle[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(BUNDLES_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveBundles(bundles: SkillBundle[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(BUNDLES_STORAGE_KEY, JSON.stringify(bundles))
  } catch {
    // Storage error
  }
}

export function createBundle(name: string, description: string, skillIds: string[]): SkillBundle {
  const bundles = getBundles()
  const bundle: SkillBundle = {
    id: `bundle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    skillIds,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  bundles.push(bundle)
  saveBundles(bundles)
  return bundle
}

export function getBundle(id: string): SkillBundle | undefined {
  return getBundles().find(b => b.id === id)
}

export function getAllBundles(): SkillBundle[] {
  return getBundles()
}

export function updateBundle(id: string, updates: Partial<Pick<SkillBundle, 'name' | 'description' | 'skillIds'>>): SkillBundle | undefined {
  const bundles = getBundles()
  const index = bundles.findIndex(b => b.id === id)
  if (index === -1) return undefined
  
  bundles[index] = {
    ...bundles[index],
    ...updates,
    updatedAt: Date.now(),
  }
  saveBundles(bundles)
  return bundles[index]
}

export function deleteBundle(id: string): boolean {
  const bundles = getBundles()
  const filtered = bundles.filter(b => b.id !== id)
  if (filtered.length === bundles.length) return false
  saveBundles(filtered)
  return true
}

export function addSkillToBundle(bundleId: string, skillId: string): boolean {
  const bundles = getBundles()
  const bundle = bundles.find(b => b.id === bundleId)
  if (!bundle || bundle.skillIds.includes(skillId)) return false
  
  bundle.skillIds.push(skillId)
  bundle.updatedAt = Date.now()
  saveBundles(bundles)
  return true
}

export function removeSkillFromBundle(bundleId: string, skillId: string): boolean {
  const bundles = getBundles()
  const bundle = bundles.find(b => b.id === bundleId)
  if (!bundle) return false
  
  bundle.skillIds = bundle.skillIds.filter(id => id !== skillId)
  bundle.updatedAt = Date.now()
  saveBundles(bundles)
  return true
}

// Generate shareable URL for a bundle
export function getBundleShareUrl(bundleId: string): string {
  const bundle = getBundle(bundleId)
  if (!bundle) return ''
  
  const params = new URLSearchParams({
    name: bundle.name,
    skills: bundle.skillIds.join(','),
  })
  return `${window.location.origin}/bundles?${params.toString()}`
}

// Parse bundle from URL params
export function parseBundleFromUrl(searchParams: URLSearchParams): { name: string; skillIds: string[] } | null {
  const name = searchParams.get('name')
  const skills = searchParams.get('skills')
  
  if (!name || !skills) return null
  
  return {
    name,
    skillIds: skills.split(',').filter(Boolean),
  }
}

// Voting functions
function getVoteData(): VoteData {
  if (typeof window === 'undefined') {
    return { skillVotes: {}, userVotedSkills: [], requestVotes: {}, userVotedRequests: [] }
  }
  try {
    const stored = localStorage.getItem(VOTES_STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      return {
        skillVotes: data.skillVotes || {},
        userVotedSkills: data.userVotedSkills || [],
        requestVotes: data.requestVotes || {},
        userVotedRequests: data.userVotedRequests || [],
      }
    }
  } catch {
    // Storage error
  }
  return { skillVotes: {}, userVotedSkills: [], requestVotes: {}, userVotedRequests: [] }
}

function saveVoteData(data: VoteData): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage error
  }
}

export function voteForSkill(skillId: string): { votes: number; hasVoted: boolean } {
  const data = getVoteData()
  
  if (data.userVotedSkills.includes(skillId)) {
    // Unvote
    data.userVotedSkills = data.userVotedSkills.filter(id => id !== skillId)
    data.skillVotes[skillId] = Math.max(0, (data.skillVotes[skillId] || 1) - 1)
  } else {
    // Vote
    data.userVotedSkills.push(skillId)
    data.skillVotes[skillId] = (data.skillVotes[skillId] || 0) + 1
  }
  
  saveVoteData(data)
  return {
    votes: data.skillVotes[skillId] || 0,
    hasVoted: data.userVotedSkills.includes(skillId),
  }
}

export function getSkillVotes(skillId: string): { votes: number; hasVoted: boolean } {
  const data = getVoteData()
  return {
    votes: data.skillVotes[skillId] || 0,
    hasVoted: data.userVotedSkills.includes(skillId),
  }
}

export function getAllSkillVotes(): Record<string, number> {
  return getVoteData().skillVotes
}

export function getTopVotedSkills(limit: number = 10): Array<{ skillId: string; votes: number }> {
  const data = getVoteData()
  return Object.entries(data.skillVotes)
    .map(([skillId, votes]) => ({ skillId, votes }))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, limit)
}

// Feature request functions
function getRequests(): FeatureRequest[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(REQUESTS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveRequests(requests: FeatureRequest[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests))
  } catch {
    // Storage error
  }
}

export function createFeatureRequest(title: string, description: string, category: string): FeatureRequest {
  const requests = getRequests()
  const request: FeatureRequest = {
    id: `request-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    description,
    category,
    votes: 1,
    createdAt: Date.now(),
    status: 'open',
  }
  requests.push(request)
  saveRequests(requests)
  
  // Auto-vote for own request
  const voteData = getVoteData()
  voteData.userVotedRequests.push(request.id)
  voteData.requestVotes[request.id] = 1
  saveVoteData(voteData)
  
  return request
}

export function getAllRequests(): FeatureRequest[] {
  const requests = getRequests()
  const voteData = getVoteData()
  
  // Sync votes from vote data
  return requests.map(r => ({
    ...r,
    votes: voteData.requestVotes[r.id] || r.votes,
  }))
}

export function voteForRequest(requestId: string): { votes: number; hasVoted: boolean } {
  const data = getVoteData()
  
  if (data.userVotedRequests.includes(requestId)) {
    // Unvote
    data.userVotedRequests = data.userVotedRequests.filter(id => id !== requestId)
    data.requestVotes[requestId] = Math.max(0, (data.requestVotes[requestId] || 1) - 1)
  } else {
    // Vote
    data.userVotedRequests.push(requestId)
    data.requestVotes[requestId] = (data.requestVotes[requestId] || 0) + 1
  }
  
  saveVoteData(data)
  return {
    votes: data.requestVotes[requestId] || 0,
    hasVoted: data.userVotedRequests.includes(requestId),
  }
}

export function getRequestVotes(requestId: string): { votes: number; hasVoted: boolean } {
  const data = getVoteData()
  return {
    votes: data.requestVotes[requestId] || 0,
    hasVoted: data.userVotedRequests.includes(requestId),
  }
}

export function getTopRequests(limit: number = 10): FeatureRequest[] {
  return getAllRequests()
    .sort((a, b) => b.votes - a.votes)
    .slice(0, limit)
}

// Comparison functions
const COMPARISON_STORAGE_KEY = 'newth-skills-comparison'
const MAX_COMPARISON_SKILLS = 4

export function getComparisonSkills(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(COMPARISON_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addToComparison(skillId: string): boolean {
  const skills = getComparisonSkills()
  if (skills.includes(skillId) || skills.length >= MAX_COMPARISON_SKILLS) return false
  
  skills.push(skillId)
  if (typeof window !== 'undefined') {
    localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(skills))
  }
  return true
}

export function removeFromComparison(skillId: string): boolean {
  const skills = getComparisonSkills()
  const filtered = skills.filter(id => id !== skillId)
  if (filtered.length === skills.length) return false
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(filtered))
  }
  return true
}

export function clearComparison(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(COMPARISON_STORAGE_KEY)
  }
}

export function isInComparison(skillId: string): boolean {
  return getComparisonSkills().includes(skillId)
}
