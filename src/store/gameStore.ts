import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Character, Quest, NarrativeState } from '../types/narrative'
import { CharacterService } from '../services/characterService'
import { NarrativeEngine } from '../services/narrativeEngine'

interface GameStore extends NarrativeState {
  // Actions
  setCharacter: (character: Character) => void
  addQuest: (quest: Quest) => void
  updateQuestProgress: (questId: string, increment: number) => void
  completeQuest: (questId: string) => void
  
  // Services
  characterService: CharacterService
  narrativeEngine: NarrativeEngine
  
  // UI State
  selectedTab: 'quests' | 'character' | 'achievements'
  setSelectedTab: (tab: 'quests' | 'character' | 'achievements') => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      character: null as Character | null, // Will be set when character is created
      activeQuests: [],
      availableQuests: [],
      completedQuests: [],
      currentStoryArc: 'The Beginning',
      
      // Services (will be recreated on load, not persisted)
      characterService: new CharacterService(),
      narrativeEngine: new NarrativeEngine(),
      
      // UI State (not persisted)
      selectedTab: 'quests',
      
      // Actions
      setCharacter: (character) => set({ character }),
      
      setSelectedTab: (tab) => set({ selectedTab: tab }),
      
      addQuest: (quest) => set((state) => ({
        activeQuests: quest.status === 'active' 
          ? [...state.activeQuests, quest]
          : state.activeQuests,
        availableQuests: quest.status === 'available'
          ? [...state.availableQuests, quest]
          : state.availableQuests
      })),
      
      updateQuestProgress: (questId, increment) => set((state) => {
        const { narrativeEngine } = get()
        const quest = state.activeQuests.find(q => q.id === questId)
        
        if (!quest) return state
        
        const result = narrativeEngine.updateQuestProgress(quest, increment)
        const updatedQuest = result.quest
        
        // Update character XP if quest completed
        let updatedCharacter = state.character
        if (result.rewardsEarned) {
          const xpResult = narrativeEngine.awardXP(state.character, result.rewardsEarned.xp)
          updatedCharacter = xpResult.character
        }
        
        return {
          ...state,
          character: updatedCharacter,
          activeQuests: updatedQuest.status === 'completed' 
            ? state.activeQuests.filter(q => q.id !== questId)
            : state.activeQuests.map(q => q.id === questId ? updatedQuest : q),
          completedQuests: updatedQuest.status === 'completed'
            ? [...state.completedQuests, updatedQuest]
            : state.completedQuests
        }
      }),
      
      completeQuest: (questId) => set((state) => {
        const quest = state.activeQuests.find(q => q.id === questId)
        if (!quest) return state
        
        return {
          activeQuests: state.activeQuests.filter(q => q.id !== questId),
          completedQuests: [...state.completedQuests, { ...quest, status: 'completed' as const }]
        }
      })
    }),
    {
      name: 'habit-alchemy-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist game data, not UI state or services
        character: state.character,
        activeQuests: state.activeQuests,
        availableQuests: state.availableQuests,
        completedQuests: state.completedQuests,
        currentStoryArc: state.currentStoryArc,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Recreate services after rehydration since they weren't persisted
          state.characterService = new CharacterService()
          state.narrativeEngine = new NarrativeEngine()
          
          // Reset UI state
          state.selectedTab = 'quests'
        }
      },
    }
  )
)