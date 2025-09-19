import { Sword, BookOpen, Palette, Compass, Lightbulb } from 'lucide-react'
import type { Character } from '../../types/narrative'
import { Card, CardContent } from '../ui/Card'
import { cn } from '../../utils/cn'

interface ClassInfo {
  type: Character['class']
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  traits: string[]
  primaryStats: Array<{ name: string; value: number }>
}

const classes: ClassInfo[] = [
  {
    type: 'warrior',
    name: 'The Warrior',
    description: 'Master of discipline and physical strength. Builds habits through determination and consistency.',
    icon: Sword,
    color: 'red',
    traits: ['Disciplined', 'Strong', 'Persistent'],
    primaryStats: [
      { name: 'Health', value: 15 },
      { name: 'Discipline', value: 12 },
      { name: 'Focus', value: 8 }
    ]
  },
  {
    type: 'scholar',
    name: 'The Scholar',
    description: 'Seeker of knowledge and wisdom. Forms habits through understanding and systematic learning.',
    icon: BookOpen,
    color: 'blue',
    traits: ['Wise', 'Focused', 'Analytical'],
    primaryStats: [
      { name: 'Wisdom', value: 15 },
      { name: 'Focus', value: 15 },
      { name: 'Creativity', value: 10 }
    ]
  },
  {
    type: 'artist',
    name: 'The Artist',
    description: 'Creative soul who transforms life into art. Builds habits through inspiration and expression.',
    icon: Palette,
    color: 'purple',
    traits: ['Creative', 'Expressive', 'Intuitive'],
    primaryStats: [
      { name: 'Creativity', value: 18 },
      { name: 'Wisdom', value: 12 },
      { name: 'Social', value: 12 }
    ]
  },
  {
    type: 'explorer',
    name: 'The Explorer',
    description: 'Adventurous spirit who discovers new horizons. Forms habits through curiosity and connection.',
    icon: Compass,
    color: 'green',
    traits: ['Adventurous', 'Social', 'Curious'],
    primaryStats: [
      { name: 'Social', value: 16 },
      { name: 'Health', value: 12 },
      { name: 'Focus', value: 10 }
    ]
  },
  {
    type: 'sage',
    name: 'The Sage',
    description: 'Balanced seeker of inner harmony. Develops habits through mindful practice and reflection.',
    icon: Lightbulb,
    color: 'amber',
    traits: ['Balanced', 'Mindful', 'Patient'],
    primaryStats: [
      { name: 'Wisdom', value: 17 },
      { name: 'Discipline', value: 14 },
      { name: 'Focus', value: 14 }
    ]
  }
]

interface ClassSelectorProps {
  selectedClass?: Character['class']
  onSelect: (classType: Character['class']) => void
}

export function ClassSelector({ selectedClass, onSelect }: ClassSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Choose Your Path</h2>
        <p className="text-white/80">Select the class that resonates with your journey of transformation</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classInfo) => {
          const Icon = classInfo.icon
          const isSelected = selectedClass === classInfo.type
          const colorClasses = {
            red: 'from-red-500 to-red-600',
            blue: 'from-blue-500 to-blue-600',
            purple: 'from-purple-500 to-purple-600',
            green: 'from-green-500 to-green-600',
            amber: 'from-amber-500 to-amber-600'
          }

          return (
            <Card
              key={classInfo.type}
              className={cn(
                'cursor-pointer transition-all duration-200 hover:scale-105',
                isSelected 
                  ? 'ring-4 ring-white shadow-2xl bg-white/95' 
                  : 'hover:bg-white/95'
              )}
              onClick={() => onSelect(classInfo.type)}
            >
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className={cn(
                    'w-16 h-16 mx-auto rounded-full flex items-center justify-center',
                    'bg-gradient-to-br', colorClasses[classInfo.color as keyof typeof colorClasses]
                  )}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{classInfo.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{classInfo.description}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Core Traits</h4>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {classInfo.traits.map((trait) => (
                          <span
                            key={trait}
                            className={cn(
                              'px-2 py-1 rounded-full text-xs text-white',
                              'bg-gradient-to-r', colorClasses[classInfo.color as keyof typeof colorClasses]
                            )}
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Primary Stats</h4>
                      <div className="space-y-1">
                        {classInfo.primaryStats.map((stat) => (
                          <div key={stat.name} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">{stat.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={cn(
                                    'h-2 rounded-full bg-gradient-to-r transition-all',
                                    colorClasses[classInfo.color as keyof typeof colorClasses]
                                  )}
                                  style={{ width: `${(stat.value / 20) * 100}%` }}
                                />
                              </div>
                              <span className="font-semibold text-gray-800 w-6 text-right">{stat.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}