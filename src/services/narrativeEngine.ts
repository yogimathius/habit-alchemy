import type { Character, Quest } from '../types/narrative'

export interface Habit {
  name: string
  frequency: string
  target: number
}

export interface QuestProgressResult {
  quest: Quest
  narrativeUpdate: string
  rewardsEarned?: { xp: number; items?: string[] }
}

export interface XPAwardResult {
  character: Character
  leveledUp: boolean
  narrativeUpdate?: string
}

export class NarrativeEngine {
  generateQuest(habit: Habit, character: Character): Quest {
    const difficulty = this.calculateDifficulty(habit, character)
    const rewards = this.calculateRewards(difficulty, character.level)
    const narrative = this.generateNarrative(habit, character, difficulty)

    return {
      id: this.generateId(),
      title: this.generateTitle(habit, character),
      description: `Complete ${habit.target} ${habit.name} actions`,
      difficulty,
      status: 'available',
      progress: 0,
      maxProgress: habit.target,
      rewards,
      narrative
    }
  }

  updateQuestProgress(quest: Quest, increment: number): QuestProgressResult {
    const updatedQuest = { ...quest }
    updatedQuest.progress = Math.min(quest.progress + increment, quest.maxProgress)
    
    let narrativeUpdate = this.generateProgressNarrative(updatedQuest)
    let rewardsEarned = undefined

    if (updatedQuest.progress >= updatedQuest.maxProgress) {
      updatedQuest.status = 'completed'
      narrativeUpdate = updatedQuest.narrative.completion
      rewardsEarned = updatedQuest.rewards
    }

    return {
      quest: updatedQuest,
      narrativeUpdate,
      rewardsEarned
    }
  }

  awardXP(character: Character, xp: number): XPAwardResult {
    const updatedCharacter = { ...character }
    updatedCharacter.xp += xp

    let leveledUp = false
    let narrativeUpdate = undefined

    if (updatedCharacter.xp >= updatedCharacter.nextLevelXp) {
      leveledUp = true
      const excessXP = updatedCharacter.xp - updatedCharacter.nextLevelXp
      updatedCharacter.level += 1
      updatedCharacter.xp = excessXP
      updatedCharacter.nextLevelXp = this.calculateNextLevelXP(updatedCharacter.level)
      updatedCharacter.stats = this.levelUpStats(updatedCharacter.stats, updatedCharacter.class)
      narrativeUpdate = `🎉 Level up! You are now level ${updatedCharacter.level}!`
    }

    return {
      character: updatedCharacter,
      leveledUp,
      narrativeUpdate
    }
  }

  private calculateDifficulty(habit: Habit, character: Character): Quest['difficulty'] {
    if (character.level >= 10) return 'epic'
    if (character.level >= 5) return 'hard'
    if (habit.target >= 10) return 'medium'
    return 'easy'
  }

  private calculateRewards(difficulty: Quest['difficulty'], level: number): Quest['rewards'] {
    const baseXP = { easy: 25, medium: 50, hard: 100, epic: 200 }[difficulty]
    return {
      xp: baseXP + (level * 5)
    }
  }

  private generateNarrative(habit: Habit, character: Character, _difficulty: Quest['difficulty']) {
    const themes = {
      warrior: ['battle', 'strength', 'courage', 'victory'],
      scholar: ['knowledge', 'wisdom', 'study', 'learn'],
      artist: ['creativity', 'inspiration', 'beauty', 'expression'],
      explorer: ['adventure', 'discovery', 'journey', 'explore'],
      sage: ['balance', 'harmony', 'understanding', 'enlightenment']
    }

    const classThemes = themes[character.class] || themes.warrior
    const theme = classThemes[Math.floor(Math.random() * classThemes.length)]

    return {
      introduction: `Embark on a quest of ${theme} through ${habit.name}. Your journey begins now, brave ${character.class}!`,
      progressUpdates: [
        `Your ${theme} grows stronger!`,
        `Halfway through your ${theme} quest!`,
        `The path of ${theme} nears completion!`
      ],
      completion: `🎉 Quest completed! Your mastery of ${theme} through ${habit.name} has made you stronger!`
    }
  }

  private generateTitle(habit: Habit, _character: Character): string {
    const prefixes = ['The', 'Quest of', 'Journey to', 'Path of']
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const habitName = habit.name.charAt(0).toUpperCase() + habit.name.slice(1)
    return `${prefix} ${habitName}`
  }

  private generateProgressNarrative(quest: Quest): string {
    const progressPercent = quest.progress / quest.maxProgress
    const updateIndex = Math.min(
      Math.floor(progressPercent * quest.narrative.progressUpdates.length),
      quest.narrative.progressUpdates.length - 1
    )
    return quest.narrative.progressUpdates[updateIndex] || 'Progress made!'
  }

  private calculateNextLevelXP(level: number): number {
    return level * 100
  }

  private levelUpStats(stats: Character['stats'], characterClass: Character['class']) {
    const statBoosts = {
      warrior: { health: 3, discipline: 2, focus: 1 },
      scholar: { wisdom: 3, focus: 2, creativity: 1 },
      artist: { creativity: 3, wisdom: 2, social: 1 },
      explorer: { social: 2, focus: 2, health: 2 },
      sage: { wisdom: 2, discipline: 2, health: 1, focus: 1 }
    }

    const boost = statBoosts[characterClass] || statBoosts.warrior
    const newStats = { ...stats }

    Object.entries(boost).forEach(([stat, increase]) => {
      newStats[stat as keyof Character['stats']] += increase
    })

    return newStats
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15)
  }
}