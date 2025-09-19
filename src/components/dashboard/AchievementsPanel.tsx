import { useGameStore } from '../../store/gameStore'
import { Trophy, Star, Target, Award, Medal, Zap } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: typeof Trophy
  requirement: number
  category: 'quests' | 'level' | 'streaks' | 'character'
  unlocked: boolean
  progress: number
}

export function AchievementsPanel() {
  const { character, quests } = useGameStore()

  if (!character) return null

  const completedQuests = quests.filter(quest => quest.progress >= quest.target).length
  const totalQuestProgress = quests.reduce((sum, quest) => sum + quest.progress, 0)
  const activeQuestStreak = Math.max(...quests.map(quest => quest.progress), 0)

  const achievements: Achievement[] = [
    {
      id: 'first_quest',
      title: 'First Steps',
      description: 'Complete your first quest',
      icon: Target,
      requirement: 1,
      category: 'quests',
      unlocked: completedQuests >= 1,
      progress: Math.min(completedQuests, 1)
    },
    {
      id: 'quest_master',
      title: 'Quest Master',
      description: 'Complete 5 quests',
      icon: Medal,
      requirement: 5,
      category: 'quests',
      unlocked: completedQuests >= 5,
      progress: Math.min(completedQuests, 5)
    },
    {
      id: 'legendary_hero',
      title: 'Legendary Hero',
      description: 'Complete 25 quests',
      icon: Trophy,
      requirement: 25,
      category: 'quests',
      unlocked: completedQuests >= 25,
      progress: Math.min(completedQuests, 25)
    },
    {
      id: 'level_up',
      title: 'Rising Star',
      description: 'Reach character level 5',
      icon: Star,
      requirement: 5,
      category: 'level',
      unlocked: character.level >= 5,
      progress: Math.min(character.level, 5)
    },
    {
      id: 'max_level',
      title: 'Grandmaster',
      description: 'Reach character level 20',
      icon: Award,
      requirement: 20,
      category: 'level',
      unlocked: character.level >= 20,
      progress: Math.min(character.level, 20)
    },
    {
      id: 'dedication',
      title: 'Dedicated',
      description: 'Accumulate 100 total quest progress points',
      icon: Zap,
      requirement: 100,
      category: 'character',
      unlocked: totalQuestProgress >= 100,
      progress: Math.min(totalQuestProgress, 100)
    }
  ]

  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const lockedAchievements = achievements.filter(a => !a.unlocked)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Achievements</h1>
        <p className="text-white/70">
          {unlockedAchievements.length} of {achievements.length} achievements unlocked
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white/10 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Achievement Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{completedQuests}</div>
            <div className="text-white/70 text-sm">Quests Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{character.level}</div>
            <div className="text-white/70 text-sm">Character Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{totalQuestProgress}</div>
            <div className="text-white/70 text-sm">Total Progress Points</div>
          </div>
        </div>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Unlocked</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">In Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const Icon = achievement.icon
  const progressPercentage = (achievement.progress / achievement.requirement) * 100

  return (
    <div className={`bg-white/10 rounded-lg p-4 border-2 transition-all ${
      achievement.unlocked 
        ? 'border-yellow-500/50 bg-yellow-500/10' 
        : 'border-white/20'
    }`}>
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${
          achievement.unlocked 
            ? 'bg-yellow-500/20 text-yellow-400' 
            : 'bg-white/10 text-white/50'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h3 className={`font-semibold mb-1 ${
            achievement.unlocked ? 'text-yellow-400' : 'text-white'
          }`}>
            {achievement.title}
          </h3>
          <p className="text-white/70 text-sm mb-3">{achievement.description}</p>
          
          {!achievement.unlocked && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-white/60">
                <span>Progress</span>
                <span>{achievement.progress} / {achievement.requirement}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-cyan-500 h-2 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
          
          {achievement.unlocked && (
            <div className="text-yellow-400 text-sm font-medium">
              ✓ Unlocked
            </div>
          )}
        </div>
      </div>
    </div>
  )
}