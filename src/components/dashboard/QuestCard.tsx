import { CheckCircle, Clock, Star, Plus, Minus, Sparkles } from 'lucide-react'
import type { Quest } from '../../types/narrative'
import { useGameStore } from '../../store/gameStore'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { ProgressBar } from '../ui/ProgressBar'
import { cn } from '../../utils/cn'

interface QuestCardProps {
  quest: Quest
  variant?: 'active' | 'available' | 'completed'
}

export function QuestCard({ quest, variant = 'active' }: QuestCardProps) {
  const { updateQuestProgress } = useGameStore()
  
  // const progressPercent = (quest.progress / quest.maxProgress) * 100
  
  // const difficultyColors = {
  //   easy: 'from-green-500 to-green-600',
  //   medium: 'from-yellow-500 to-yellow-600',
  //   hard: 'from-orange-500 to-orange-600',
  //   epic: 'from-red-500 to-red-600'
  // }

  const difficultyBadgeColors = {
    easy: 'bg-green-500/20 text-green-200',
    medium: 'bg-yellow-500/20 text-yellow-200',
    hard: 'bg-orange-500/20 text-orange-200',
    epic: 'bg-red-500/20 text-red-200'
  }

  const handleProgressUpdate = (increment: number) => {
    if (quest.status === 'active') {
      updateQuestProgress(quest.id, increment)
    }
  }

  return (
    <Card className={cn(
      'transition-all duration-200 hover:scale-[1.02]',
      variant === 'completed' 
        ? 'bg-green-500/10 border-green-500/30 backdrop-blur-sm'
        : variant === 'available'
        ? 'bg-blue-500/10 border-blue-500/30 backdrop-blur-sm'
        : 'bg-white/10 border-white/20 backdrop-blur-sm'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className={cn(
              'text-lg mb-2',
              variant === 'completed' ? 'text-green-100' : 'text-white'
            )}>
              {quest.title}
            </CardTitle>
            <p className={cn(
              'text-sm',
              variant === 'completed' ? 'text-green-200/80' : 'text-white/70'
            )}>
              {quest.description}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium capitalize',
              difficultyBadgeColors[quest.difficulty]
            )}>
              {quest.difficulty}
            </span>
            {variant === 'completed' && (
              <CheckCircle className="w-5 h-5 text-green-400" />
            )}
            {variant === 'available' && (
              <Clock className="w-5 h-5 text-blue-400" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/70 flex items-center gap-2">
              Progress
              {variant === 'completed' && (
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              )}
            </span>
            <span className="text-white">
              {quest.progress} / {quest.maxProgress}
            </span>
          </div>
          <ProgressBar
            progress={quest.progress}
            max={quest.maxProgress}
            color={variant === 'completed' ? 'green' : 
              quest.difficulty === 'easy' ? 'green' :
              quest.difficulty === 'medium' ? 'yellow' :
              quest.difficulty === 'hard' ? 'orange' : 'red'
            }
            showPercent={true}
            animated={true}
          />
        </div>

        {/* Narrative */}
        <div className="p-3 bg-black/20 rounded-lg">
          <p className="text-white/80 text-sm italic">
            {quest.status === 'completed' 
              ? quest.narrative.completion
              : quest.progress === 0
              ? quest.narrative.introduction
              : quest.narrative.progressUpdates[Math.min(
                  Math.floor((quest.progress / quest.maxProgress) * quest.narrative.progressUpdates.length),
                  quest.narrative.progressUpdates.length - 1
                )] || 'Keep pushing forward, hero!'
            }
          </p>
        </div>

        {/* Rewards */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white/70 text-sm">{quest.rewards.xp} XP</span>
            </div>
            {quest.rewards.items && quest.rewards.items.length > 0 && (
              <div className="text-white/70 text-sm">
                +{quest.rewards.items.length} item{quest.rewards.items.length > 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {variant === 'active' && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleProgressUpdate(-1)}
                disabled={quest.progress <= 0}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleProgressUpdate(1)}
                disabled={quest.progress >= quest.maxProgress}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}