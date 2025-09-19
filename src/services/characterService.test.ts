import { describe, it, expect, beforeEach } from 'vitest'
import { CharacterService } from './characterService'
import type { Character } from '../types/narrative'

describe('CharacterService', () => {
  let characterService: CharacterService

  beforeEach(() => {
    characterService = new CharacterService()
  })

  describe('Character Creation', () => {
    it('should create a warrior character with appropriate stats', () => {
      const character = characterService.createCharacter('Test Hero', 'warrior')
      
      expect(character.name).toBe('Test Hero')
      expect(character.class).toBe('warrior')
      expect(character.level).toBe(1)
      expect(character.xp).toBe(0)
      expect(character.stats.health).toBeGreaterThan(character.stats.creativity)
      expect(character.stats.discipline).toBeGreaterThan(character.stats.wisdom)
    })

    it('should create a scholar character with high wisdom and focus', () => {
      const character = characterService.createCharacter('Wise One', 'scholar')
      
      expect(character.class).toBe('scholar')
      expect(character.stats.wisdom).toBeGreaterThan(character.stats.health)
      expect(character.stats.focus).toBeGreaterThan(character.stats.social)
    })

    it('should assign unique IDs to characters', () => {
      const char1 = characterService.createCharacter('Hero1', 'warrior')
      const char2 = characterService.createCharacter('Hero2', 'scholar')
      
      expect(char1.id).not.toBe(char2.id)
      expect(char1.id).toBeTruthy()
      expect(char2.id).toBeTruthy()
    })
  })

  describe('Character Progression', () => {
    let character: Character

    beforeEach(() => {
      character = characterService.createCharacter('Test Hero', 'warrior')
    })

    it('should calculate correct XP needed for next level', () => {
      expect(characterService.getXPToNextLevel(character)).toBe(100)
      
      const levelTwoChar = { ...character, level: 2, nextLevelXp: 200 }
      expect(characterService.getXPToNextLevel(levelTwoChar)).toBe(200)
    })

    it('should calculate character power level based on stats', () => {
      const powerLevel = characterService.getCharacterPower(character)
      
      expect(powerLevel).toBeGreaterThan(0)
      expect(typeof powerLevel).toBe('number')
    })

    it('should suggest character development paths', () => {
      const suggestions = characterService.suggestDevelopmentPath(character)
      
      expect(suggestions).toBeDefined()
      expect(suggestions.primaryFocus).toBeTruthy()
      expect(suggestions.recommendedHabits.length).toBeGreaterThan(0)
      expect(suggestions.skillsToImprove.length).toBeGreaterThan(0)
    })
  })

  describe('Equipment and Achievements', () => {
    let character: Character

    beforeEach(() => {
      character = characterService.createCharacter('Test Hero', 'warrior')
    })

    it('should award equipment based on achievements', () => {
      const equipment = characterService.awardEquipment(character, 'strength_mastery')
      
      expect(equipment).toBeTruthy()
      expect(typeof equipment).toBe('string')
    })

    it('should unlock achievements based on character progress', () => {
      const highLevelChar = { ...character, level: 5, stats: { ...character.stats, health: 25 } }
      const achievements = characterService.checkAchievements(highLevelChar)
      
      expect(Array.isArray(achievements)).toBe(true)
    })

    it('should calculate stat bonuses from equipment', () => {
      const characterWithEquipment = { 
        ...character, 
        equipment: ['warrior_sword', 'leather_armor'] 
      }
      
      const bonuses = characterService.getEquipmentBonuses(characterWithEquipment)
      
      expect(bonuses).toBeDefined()
      expect(typeof bonuses.health).toBe('number')
      expect(typeof bonuses.discipline).toBe('number')
    })
  })
})