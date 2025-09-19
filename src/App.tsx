import type { Character } from './types/narrative'
import { CharacterCreation } from './components/character/CharacterCreation'
import { DashboardLayout } from './components/dashboard/DashboardLayout'
import { QuestsPanel } from './components/dashboard/QuestsPanel'
import { CharacterSheet } from './components/dashboard/CharacterSheet'
import { AchievementsPanel } from './components/dashboard/AchievementsPanel'
import { useGameStore } from './store/gameStore'

function App() {
  const { character, selectedTab, setCharacter } = useGameStore()

  const handleCharacterCreated = (newCharacter: Character) => {
    setCharacter(newCharacter)
    console.log('Character created:', newCharacter)
  }

  if (!character) {
    return <CharacterCreation onCharacterCreated={handleCharacterCreated} />
  }

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'character':
        return <CharacterSheet />
      case 'achievements':
        return <AchievementsPanel />
      case 'quests':
      default:
        return <QuestsPanel />
    }
  }

  return (
    <DashboardLayout>
      {renderTabContent()}
    </DashboardLayout>
  )
}

export default App