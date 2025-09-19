import { ReactNode, useState } from 'react'
import { User, Sword, Trophy, Plus } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { CreateQuestModal } from './CreateQuestModal'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { character, selectedTab, setSelectedTab } = useGameStore()
  const [showCreateModal, setShowCreateModal] = useState(false)

  if (!character) return null

  const tabs = [
    { id: 'quests' as const, label: 'Quests', icon: Sword },
    { id: 'character' as const, label: 'Character', icon: User },
    { id: 'achievements' as const, label: 'Achievements', icon: Trophy },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">Habit Alchemy</h1>
              <div className="text-white/70 text-sm">
                <span className="font-semibold">{character.name}</span> • 
                <span className="ml-1 capitalize">{character.class}</span> • 
                <span className="ml-1">Level {character.level}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* XP Progress */}
              <div className="text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <span>XP: {character.xp}/{character.nextLevelXp}</span>
                  <div className="w-24 bg-white/20 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-300"
                      style={{ width: `${(character.xp / character.nextLevelXp) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Quest
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-black/10 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = selectedTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-4 text-sm font-medium transition-colors relative',
                    isActive
                      ? 'text-white'
                      : 'text-white/60 hover:text-white/80'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-400 to-purple-400" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Create Quest Modal */}
      <CreateQuestModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  )
}