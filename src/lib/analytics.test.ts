import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  trackCopyEvent,
  getCopyCount,
  getAllCopyCounts,
  getTotalCopyCount,
  getRecentCopyEvents,
  getMostPopularSkills,
  clearAnalytics,
  __clearAnalyticsCache,
} from './analytics'

describe('analytics', () => {
  beforeEach(() => {
    __clearAnalyticsCache()
    vi.clearAllMocks()
    vi.mocked(localStorage.getItem).mockReturnValue(null)
  })

  describe('trackCopyEvent', () => {
    it('should track a copy event and store it', () => {
      trackCopyEvent('test-skill')

      expect(localStorage.setItem).toHaveBeenCalled()
      const setItemCall = vi.mocked(localStorage.setItem).mock.calls[0]
      expect(setItemCall[0]).toBe('newth-skills-analytics')

      const storedData = JSON.parse(setItemCall[1])
      expect(storedData.copyEvents).toHaveLength(1)
      expect(storedData.copyEvents[0].skillId).toBe('test-skill')
      expect(storedData.skillCopyCounts['test-skill']).toBe(1)
    })

    it('should increment count for existing skill', () => {
      const existingData = {
        copyEvents: [{ skillId: 'test-skill', timestamp: Date.now() }],
        skillCopyCounts: { 'test-skill': 1 },
      }
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(existingData))

      trackCopyEvent('test-skill')

      const setItemCall = vi.mocked(localStorage.setItem).mock.calls[0]
      const storedData = JSON.parse(setItemCall[1])
      expect(storedData.skillCopyCounts['test-skill']).toBe(2)
    })
  })

  describe('getCopyCount', () => {
    it('should return 0 for unknown skill', () => {
      expect(getCopyCount('unknown-skill')).toBe(0)
    })

    it('should return correct count for tracked skill', () => {
      const existingData = {
        copyEvents: [],
        skillCopyCounts: { 'test-skill': 5 },
      }
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(existingData))

      expect(getCopyCount('test-skill')).toBe(5)
    })
  })

  describe('getAllCopyCounts', () => {
    it('should return empty object when no data', () => {
      expect(getAllCopyCounts()).toEqual({})
    })

    it('should return all copy counts', () => {
      const existingData = {
        copyEvents: [],
        skillCopyCounts: { 'skill-1': 3, 'skill-2': 7 },
      }
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(existingData))

      expect(getAllCopyCounts()).toEqual({ 'skill-1': 3, 'skill-2': 7 })
    })
  })

  describe('getTotalCopyCount', () => {
    it('should return 0 when no data', () => {
      expect(getTotalCopyCount()).toBe(0)
    })

    it('should return sum of all counts', () => {
      const existingData = {
        copyEvents: [],
        skillCopyCounts: { 'skill-1': 3, 'skill-2': 7, 'skill-3': 10 },
      }
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(existingData))

      expect(getTotalCopyCount()).toBe(20)
    })
  })

  describe('getRecentCopyEvents', () => {
    it('should return empty array when no events', () => {
      expect(getRecentCopyEvents()).toEqual([])
    })

    it('should return recent events in reverse order', () => {
      const existingData = {
        copyEvents: [
          { skillId: 'skill-1', timestamp: 1000 },
          { skillId: 'skill-2', timestamp: 2000 },
          { skillId: 'skill-3', timestamp: 3000 },
        ],
        skillCopyCounts: {},
      }
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(existingData))

      const events = getRecentCopyEvents(2)
      expect(events).toHaveLength(2)
      expect(events[0].skillId).toBe('skill-3')
      expect(events[1].skillId).toBe('skill-2')
    })
  })

  describe('getMostPopularSkills', () => {
    it('should return empty array when no data', () => {
      expect(getMostPopularSkills()).toEqual([])
    })

    it('should return skills sorted by count', () => {
      const existingData = {
        copyEvents: [],
        skillCopyCounts: { 'skill-1': 3, 'skill-2': 10, 'skill-3': 5 },
      }
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(existingData))

      const popular = getMostPopularSkills(2)
      expect(popular).toHaveLength(2)
      expect(popular[0]).toEqual({ skillId: 'skill-2', count: 10 })
      expect(popular[1]).toEqual({ skillId: 'skill-3', count: 5 })
    })
  })

  describe('clearAnalytics', () => {
    it('should remove analytics data from localStorage', () => {
      clearAnalytics()
      expect(localStorage.removeItem).toHaveBeenCalledWith('newth-skills-analytics')
    })
  })
})
