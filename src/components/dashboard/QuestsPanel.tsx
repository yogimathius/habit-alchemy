import { useState } from 'react'
import { Plus, Filter } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { QuestCard } from './QuestCard'
import { CreateQuestModal } from './CreateQuestModal'
import { Button } from '../ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { cn } from '../../utils/cn'

type QuestFilter = 'all' | 'active' | 'available' | 'completed'

export function QuestsPanel() {
  const { activeQuests, availableQuests, completedQuests } = useGameStore()
  const [filter, setFilter] = useState<QuestFilter>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filters = [
    { id: 'all' as const, label: 'All Quests', count: activeQuests.length + availableQuests.length + completedQuests.length },
    { id: 'active' as const, label: 'Active', count: activeQuests.length },
    { id: 'available' as const, label: 'Available', count: availableQuests.length },
    { id: 'completed' as const, label: 'Completed', count: completedQuests.length },
  ]

  const getFilteredQuests = () => {
    switch (filter) {
      case 'active':
        return { active: activeQuests, available: [], completed: [] }
      case 'available':
        return { active: [], available: availableQuests, completed: [] }
      case 'completed':
        return { active: [], available: [], completed: completedQuests }
      default:
        return { active: activeQuests, available: availableQuests, completed: completedQuests }
    }
  }

  const { active, available, completed } = getFilteredQuests()
  const hasQuests = active.length > 0 || available.length > 0 || completed.length > 0

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-white/70" />
          <div className="flex gap-2">
            {filters.map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  filter === filterOption.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                )}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
        </div>

        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Quest
        </Button>
      </div>

      {/* Empty State */}
      {!hasQuests && (
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="text-center py-12">
            <div className="text-white/60 mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Quests Yet</h3>
              <p className="text-sm">
                Transform your daily habits into epic adventures! Create your first quest to begin your journey.
              </p>
            </div>
            <Button variant="primary" size="lg" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Quest
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Quests */}
      {active.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Active Quests</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {active.map((quest) => (
              <QuestCard key={quest.id} quest={quest} variant="active" />
            ))}
          </div>
        </div>
      )}

      {/* Available Quests */}
      {available.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Available Quests</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {available.map((quest) => (
              <QuestCard key={quest.id} quest={quest} variant="available" />
            ))}
          </div>
        </div>
      )}

      {/* Completed Quests */}
      {completed.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Completed Quests</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completed.slice(0, 6).map((quest) => (
              <QuestCard key={quest.id} quest={quest} variant="completed" />
            ))}
            {completed.length > 6 && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center text-white/70">
                    <div className="text-2xl font-bold mb-2">+{completed.length - 6}</div>
                    <div className="text-sm">More completed</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {hasQuests && (
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Quest Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">{activeQuests.length}</div>
                <div className="text-white/70 text-sm">Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{availableQuests.length}</div>
                <div className="text-white/70 text-sm">Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{completedQuests.length}</div>
                <div className="text-white/70 text-sm">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Quest Modal */}
      <CreateQuestModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  )
}