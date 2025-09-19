export interface Quest {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard' | 'epic'
  status: 'locked' | 'available' | 'active' | 'completed'
  progress: number
  maxProgress: number
  rewards: {
    xp: number
    items?: string[]
    unlocks?: string[]
  }
  narrative: {
    introduction: string
    progressUpdates: string[]
    completion: string
  }
}

export interface Character {
  id: string
  name: string
  level: number
  xp: number
  nextLevelXp: number
  stats: {
    health: number
    focus: number
    creativity: number
    social: number
    discipline: number
    wisdom: number
  }
  class: 'warrior' | 'scholar' | 'artist' | 'explorer' | 'sage'
  equipment: string[]
  achievements: string[]
}

export interface NarrativeState {
  character: Character
  activeQuests: Quest[]
  availableQuests: Quest[]
  completedQuests: Quest[]
  currentStoryArc: string
}