import { describe, it, expect, beforeEach } from 'vitest'
import { NarrativeEngine } from './narrativeEngine'
import type { Character, Quest } from '../types/narrative'

describe('NarrativeEngine', () => {
  let narrativeEngine: NarrativeEngine
  let mockCharacter: Character

  beforeEach(() => {
    narrativeEngine = new NarrativeEngine()
    mockCharacter = {
      id: '1',
      name: 'Test Hero',
      level: 1,
      xp: 0,
      nextLevelXp: 100,
      stats: {
        health: 10,
        focus: 8,
        creativity: 6,
        social: 7,
        discipline: 9,
        wisdom: 5
      },
      class: 'warrior',
      equipment: [],
      achievements: []
    }
  })

  describe('Quest Generation', () => {
    it('should generate a quest from a simple habit', () => {
      const habit = { name: 'drink water', frequency: 'daily', target: 8 }
      
      const quest = narrativeEngine.generateQuest(habit, mockCharacter)
      
      expect(quest).toBeDefined()
      expect(quest.title).toContain('water')
      expect(quest.difficulty).toBe('easy')
      expect(quest.status).toBe('available')
      expect(quest.maxProgress).toBe(8)
      expect(quest.narrative.introduction).toBeTruthy()
    })

    it('should adapt quest difficulty based on character level', () => {
      const habit = { name: 'meditation', frequency: 'daily', target: 20 }
      const highLevelCharacter = { ...mockCharacter, level: 10 }
      
      const quest = narrativeEngine.generateQuest(habit, highLevelCharacter)
      
      expect(quest.difficulty).not.toBe('easy')
      expect(quest.rewards.xp).toBeGreaterThan(50)
    })

    it('should create themed narratives based on character class', () => {
      const habit = { name: 'read book', frequency: 'daily', target: 1 }
      const scholarCharacter = { ...mockCharacter, class: 'scholar' as const }
      
      const quest = narrativeEngine.generateQuest(habit, scholarCharacter)
      
      expect(quest.narrative.introduction).toMatch(/knowledge|wisdom|learn|study/i)
    })
  })

  describe('Progress Tracking', () => {
    it('should update quest progress and provide narrative feedback', () => {
      const quest: Quest = {
        id: '1',
        title: 'Hydration Quest',
        description: 'Drink 8 glasses of water',
        difficulty: 'easy',
        status: 'active',
        progress: 3,
        maxProgress: 8,
        rewards: { xp: 50 },
        narrative: {
          introduction: 'Begin your hydration journey',
          progressUpdates: ['Quarter way there!', 'Halfway complete!', 'Almost finished!'],
          completion: 'Quest completed!'
        }
      }

      const result = narrativeEngine.updateQuestProgress(quest, 1)
      
      expect(result.quest.progress).toBe(4)
      expect(result.narrativeUpdate).toBeTruthy()
      expect(result.quest.status).toBe('active')
    })

    it('should complete quest when progress reaches target', () => {
      const quest: Quest = {
        id: '1',
        title: 'Test Quest',
        description: 'Test description',
        difficulty: 'easy',
        status: 'active',
        progress: 7,
        maxProgress: 8,
        rewards: { xp: 50 },
        narrative: {
          introduction: 'Start',
          progressUpdates: ['Progress'],
          completion: 'Done!'
        }
      }

      const result = narrativeEngine.updateQuestProgress(quest, 1)
      
      expect(result.quest.status).toBe('completed')
      expect(result.narrativeUpdate).toBe(quest.narrative.completion)
      expect(result.rewardsEarned).toEqual({ xp: 50 })
    })
  })

  describe('Character Development', () => {
    it('should level up character when XP threshold is reached', () => {
      const character = { ...mockCharacter, xp: 95, nextLevelXp: 100 }
      
      const result = narrativeEngine.awardXP(character, 10)
      
      expect(result.character.level).toBe(2)
      expect(result.character.xp).toBe(5)
      expect(result.character.nextLevelXp).toBe(200)
      expect(result.leveledUp).toBe(true)
    })

    it('should increase stats on level up', () => {
      const character = { ...mockCharacter, xp: 99, nextLevelXp: 100 }
      
      const result = narrativeEngine.awardXP(character, 5)
      
      expect(result.character.stats.health).toBeGreaterThan(mockCharacter.stats.health)
      expect(result.character.stats.discipline).toBeGreaterThan(mockCharacter.stats.discipline)
    })
  })
})