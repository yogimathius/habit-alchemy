import { TrendingUp, Award, Zap } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { cn } from '../../utils/cn'

export function CharacterSheet() {
  const { character, characterService } = useGameStore()
  
  if (!character) return null
  
  const powerLevel = characterService.getCharacterPower(character)
  const suggestions = characterService.suggestDevelopmentPath(character)
  const equipmentBonuses = characterService.getEquipmentBonuses(character)
  const achievements = characterService.checkAchievements(character)

  const statColors = {
    health: 'from-red-500 to-red-600',
    focus: 'from-blue-500 to-blue-600',
    creativity: 'from-purple-500 to-purple-600',
    social: 'from-green-500 to-green-600',
    discipline: 'from-orange-500 to-orange-600',
    wisdom: 'from-yellow-500 to-yellow-600'
  }

  return (
    <div className="space-y-6">
      {/* Character Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Power Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">{powerLevel}</div>
            <p className="text-white/70 text-sm">Total combat effectiveness</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">{achievements.length}</div>
            <p className="text-white/70 text-sm">Unlocked milestones</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Next Level</span>
                <span className="text-white">{character.nextLevelXp - character.xp} XP</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-violet-400 to-purple-600 transition-all duration-500"
                  style={{ width: `${(character.xp / character.nextLevelXp) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Stats Display */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Character Attributes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(character.stats).map(([stat, baseValue]) => {
              const bonus = equipmentBonuses[stat as keyof typeof equipmentBonuses] || 0
              const totalValue = baseValue + bonus
              const maxStat = 30 // Reasonable max for visual representation

              return (
                <div key={stat} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white capitalize font-medium">{stat}</span>
                    <div className="text-white text-sm">
                      {totalValue}
                      {bonus > 0 && (
                        <span className="text-green-400 ml-1">(+{bonus})</span>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div 
                        className={cn(
                          'h-3 rounded-full bg-gradient-to-r transition-all duration-700',
                          statColors[stat as keyof typeof statColors]
                        )}
                        style={{ width: `${Math.min((totalValue / maxStat) * 100, 100)}%` }}
                      />
                    </div>
                    {bonus > 0 && (
                      <div className="absolute top-0 right-0 transform -translate-y-1">
                        <div className="text-xs text-green-400 bg-green-400/20 px-1 rounded">
                          +{bonus}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Development Path */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Development Focus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-white font-semibold mb-2">Primary Focus</h4>
              <p className="text-white/80 text-sm">{suggestions.primaryFocus}</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Recommended Habits</h4>
              <div className="space-y-2">
                {suggestions.recommendedHabits.map((habit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                    <span className="text-white/80 text-sm capitalize">{habit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Skills to Improve</h4>
              <div className="flex flex-wrap gap-2">
                {suggestions.skillsToImprove.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-xs bg-violet-500/20 text-violet-200 capitalize"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment & Achievements */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            {character.equipment.length > 0 ? (
              <div className="space-y-2">
                {character.equipment.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-white/80 capitalize">{item.replace('_', ' ')}</span>
                    <span className="text-violet-400 text-sm">Equipped</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-sm">No equipment yet. Complete quests to earn gear!</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            {achievements.length > 0 ? (
              <div className="space-y-2">
                {achievements.slice(0, 5).map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-yellow-500/10 rounded-lg">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span className="text-white/80 text-sm capitalize">
                      {achievement.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-sm">No achievements yet. Keep building habits to unlock them!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}