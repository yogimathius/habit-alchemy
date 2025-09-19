import { useState } from 'react'
import { X, Wand2 } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

interface CreateQuestModalProps {
  isOpen: boolean
  onClose: () => void
}

interface HabitFormData {
  name: string
  description: string
  frequency: 'daily' | 'weekly' | 'custom'
  target: number
  category: 'health' | 'mind' | 'creativity' | 'social' | 'productivity'
}

export function CreateQuestModal({ isOpen, onClose }: CreateQuestModalProps) {
  const { character, narrativeEngine, addQuest } = useGameStore()
  const [step, setStep] = useState<'habit' | 'preview'>('habit')
  const [formData, setFormData] = useState<HabitFormData>({
    name: '',
    description: '',
    frequency: 'daily',
    target: 7,
    category: 'health'
  })
  const [errors, setErrors] = useState<Partial<HabitFormData>>({})
  
  if (!isOpen || !character) return null

  const validateForm = (): boolean => {
    const newErrors: Partial<HabitFormData> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Habit name must be at least 3 characters'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description helps create better narratives'
    }
    
    if (formData.target < 1) {
      newErrors.target = 'Target must be at least 1'
    } else if (formData.target > 100) {
      newErrors.target = 'Target cannot exceed 100'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      setStep('preview')
    }
  }

  const handleCreateQuest = () => {
    if (validateForm()) {
      const habit = {
        name: formData.name.trim(),
        frequency: formData.frequency,
        target: formData.target
      }
      
      const quest = narrativeEngine.generateQuest(habit, character)
      quest.status = 'active' // Make it active immediately
      
      addQuest(quest)
      onClose()
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        frequency: 'daily',
        target: 7,
        category: 'health'
      })
      setStep('habit')
    }
  }

  const categories = [
    { id: 'health', label: 'Health & Fitness', icon: '💪', color: 'from-red-500 to-red-600' },
    { id: 'mind', label: 'Mind & Learning', icon: '🧠', color: 'from-blue-500 to-blue-600' },
    { id: 'creativity', label: 'Creativity & Arts', icon: '🎨', color: 'from-purple-500 to-purple-600' },
    { id: 'social', label: 'Social & Relationships', icon: '👥', color: 'from-green-500 to-green-600' },
    { id: 'productivity', label: 'Work & Productivity', icon: '⚡', color: 'from-yellow-500 to-yellow-600' }
  ]

  const frequencies = [
    { id: 'daily', label: 'Daily', description: 'Every day for consistent growth' },
    { id: 'weekly', label: 'Weekly', description: 'Once per week for steady progress' },
    { id: 'custom', label: 'Custom', description: 'Set your own target number' }
  ]

  const getPreviewQuest = () => {
    if (step !== 'preview') return null
    
    const habit = {
      name: formData.name.trim(),
      frequency: formData.frequency,
      target: formData.target
    }
    
    return narrativeEngine.generateQuest(habit, character)
  }

  const previewQuest = getPreviewQuest()

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-violet-600" />
              Transform Habit into Quest
            </CardTitle>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className={cn(
              'w-8 h-1 rounded-full transition-colors',
              step === 'habit' ? 'bg-violet-600' : 'bg-gray-300'
            )} />
            <div className={cn(
              'w-8 h-1 rounded-full transition-colors',
              step === 'preview' ? 'bg-violet-600' : 'bg-gray-300'
            )} />
          </div>
        </CardHeader>

        <CardContent>
          {step === 'habit' && (
            <div className="space-y-6">
              {/* Habit Name */}
              <div>
                <label htmlFor="habitName" className="block text-sm font-medium text-gray-700 mb-2">
                  What habit do you want to build? *
                </label>
                <input
                  id="habitName"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg border transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  )}
                  placeholder="e.g., Drink 8 glasses of water, Read for 30 minutes, Exercise..."
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Why is this important to you?
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg border transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
                    errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  )}
                  placeholder="This helps create more personalized and motivating quest narratives..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quest Category
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: category.id as HabitFormData['category'] }))}
                      className={cn(
                        'p-4 rounded-lg border-2 transition-all text-left',
                        formData.category === category.id
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900">{category.label}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency & Target */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Frequency
                  </label>
                  <div className="space-y-2">
                    {frequencies.map((freq) => (
                      <button
                        key={freq.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, frequency: freq.id as HabitFormData['frequency'] }))}
                        className={cn(
                          'w-full p-3 rounded-lg border text-left transition-all',
                          formData.frequency === freq.id
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className="font-medium text-gray-900">{freq.label}</div>
                        <div className="text-sm text-gray-600">{freq.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-2">
                    Target Count
                  </label>
                  <input
                    id="target"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.target}
                    onChange={(e) => setFormData(prev => ({ ...prev, target: parseInt(e.target.value) || 1 }))}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg border transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
                      errors.target ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    )}
                  />
                  {errors.target && <p className="mt-1 text-sm text-red-600">{errors.target}</p>}
                  <p className="mt-1 text-xs text-gray-500">
                    How many times to complete this habit
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleNext}>
                  Preview Quest
                </Button>
              </div>
            </div>
          )}

          {step === 'preview' && previewQuest && (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{previewQuest.title}</h3>
                <p className="text-gray-600 mb-4">{previewQuest.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium capitalize',
                    {
                      'bg-green-100 text-green-800': previewQuest.difficulty === 'easy',
                      'bg-yellow-100 text-yellow-800': previewQuest.difficulty === 'medium',
                      'bg-orange-100 text-orange-800': previewQuest.difficulty === 'hard',
                      'bg-red-100 text-red-800': previewQuest.difficulty === 'epic'
                    }
                  )}>
                    {previewQuest.difficulty}
                  </span>
                  <span className="text-sm text-gray-600">
                    {previewQuest.rewards.xp} XP reward
                  </span>
                </div>

                <div className="bg-white/80 p-4 rounded-lg">
                  <p className="text-gray-800 italic">
                    "{previewQuest.narrative.introduction}"
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('habit')}>
                  Back to Edit
                </Button>
                <Button variant="primary" onClick={handleCreateQuest}>
                  Create Quest
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}