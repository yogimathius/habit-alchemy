import type { Character } from '../types/narrative'

export interface DevelopmentSuggestion {
  primaryFocus: string
  recommendedHabits: string[]
  skillsToImprove: string[]
}

export interface EquipmentBonuses {
  health: number
  focus: number
  creativity: number
  social: number
  discipline: number
  wisdom: number
}

export class CharacterService {
  createCharacter(name: string, characterClass: Character['class']): Character {
    const baseStats = this.getClassBaseStats(characterClass)
    
    return {
      id: this.generateId(),
      name,
      level: 1,
      xp: 0,
      nextLevelXp: 100,
      stats: baseStats,
      class: characterClass,
      equipment: [],
      achievements: []
    }
  }

  getXPToNextLevel(character: Character): number {
    return character.nextLevelXp - character.xp
  }

  getCharacterPower(character: Character): number {
    const statTotal = Object.values(character.stats).reduce((sum, stat) => sum + stat, 0)
    const levelMultiplier = character.level * 1.5
    return Math.floor(statTotal * levelMultiplier)
  }

  suggestDevelopmentPath(character: Character): DevelopmentSuggestion {
    const classGuidance = {
      warrior: {
        primaryFocus: 'Physical strength and discipline',
        recommendedHabits: ['exercise', 'meditation', 'healthy eating'],
        skillsToImprove: ['health', 'discipline']
      },
      scholar: {
        primaryFocus: 'Knowledge acquisition and mental clarity',
        recommendedHabits: ['reading', 'journaling', 'learning new skills'],
        skillsToImprove: ['wisdom', 'focus']
      },
      artist: {
        primaryFocus: 'Creative expression and inspiration',
        recommendedHabits: ['creative practice', 'inspiration seeking', 'skill development'],
        skillsToImprove: ['creativity', 'wisdom']
      },
      explorer: {
        primaryFocus: 'Adventure and social connection',
        recommendedHabits: ['networking', 'travel', 'new experiences'],
        skillsToImprove: ['social', 'focus']
      },
      sage: {
        primaryFocus: 'Balance and inner wisdom',
        recommendedHabits: ['meditation', 'reflection', 'teaching others'],
        skillsToImprove: ['wisdom', 'discipline']
      }
    }

    return classGuidance[character.class] || classGuidance.warrior
  }

  awardEquipment(_character: Character, achievementType: string): string {
    const equipmentMap: Record<string, string> = {
      strength_mastery: 'warrior_sword',
      wisdom_seeker: 'scholar_tome',
      creative_soul: 'artist_brush',
      social_butterfly: 'explorer_compass',
      inner_peace: 'sage_staff'
    }

    return equipmentMap[achievementType] || 'basic_equipment'
  }

  checkAchievements(character: Character): string[] {
    const achievements: string[] = []

    if (character.level >= 5) achievements.push('level_5_master')
    if (character.stats.health >= 20) achievements.push('health_champion')
    if (character.stats.wisdom >= 20) achievements.push('wisdom_seeker')
    if (character.stats.creativity >= 20) achievements.push('creative_soul')
    if (character.stats.social >= 20) achievements.push('social_butterfly')
    if (character.stats.discipline >= 20) achievements.push('discipline_master')
    if (character.stats.focus >= 20) achievements.push('focus_expert')

    return achievements
  }

  getEquipmentBonuses(character: Character): EquipmentBonuses {
    const bonuses: EquipmentBonuses = {
      health: 0,
      focus: 0,
      creativity: 0,
      social: 0,
      discipline: 0,
      wisdom: 0
    }

    const equipmentBonuses: Record<string, Partial<EquipmentBonuses>> = {
      warrior_sword: { health: 5, discipline: 3 },
      leather_armor: { health: 3, discipline: 2 },
      scholar_tome: { wisdom: 5, focus: 3 },
      artist_brush: { creativity: 5, wisdom: 2 },
      explorer_compass: { social: 4, focus: 2 },
      sage_staff: { wisdom: 4, discipline: 3 }
    }

    character.equipment.forEach(item => {
      const itemBonuses = equipmentBonuses[item]
      if (itemBonuses) {
        Object.entries(itemBonuses).forEach(([stat, bonus]) => {
          bonuses[stat as keyof EquipmentBonuses] += bonus as number
        })
      }
    })

    return bonuses
  }

  private getClassBaseStats(characterClass: Character['class']) {
    const classStats = {
      warrior: { health: 15, focus: 8, creativity: 6, social: 7, discipline: 12, wisdom: 7 },
      scholar: { health: 8, focus: 15, creativity: 10, social: 7, discipline: 10, wisdom: 15 },
      artist: { health: 10, focus: 12, creativity: 18, social: 12, discipline: 8, wisdom: 12 },
      explorer: { health: 12, focus: 10, creativity: 12, social: 16, discipline: 10, wisdom: 10 },
      sage: { health: 10, focus: 14, creativity: 11, social: 9, discipline: 14, wisdom: 17 }
    }

    return classStats[characterClass] || classStats.warrior
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15)
  }
}