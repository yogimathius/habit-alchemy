import { useState } from 'react'
import { User, ArrowRight } from 'lucide-react'
import type { Character } from '../../types/narrative'
import { CharacterService } from '../../services/characterService'
import { ClassSelector } from './ClassSelector'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

interface CharacterCreationProps {
  onCharacterCreated: (character: Character) => void
}

const characterService = new CharacterService()

export function CharacterCreation({ onCharacterCreated }: CharacterCreationProps) {
  const [step, setStep] = useState<'name' | 'class' | 'confirm'>('name')
  const [name, setName] = useState('')
  const [selectedClass, setSelectedClass] = useState<Character['class']>()
  const [errors, setErrors] = useState<{ name?: string; class?: string }>({})

  const validateName = (value: string): boolean => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, name: 'Hero name is required' }))
      return false
    }
    if (value.trim().length < 2) {
      setErrors(prev => ({ ...prev, name: 'Hero name must be at least 2 characters' }))
      return false
    }
    if (value.trim().length > 20) {
      setErrors(prev => ({ ...prev, name: 'Hero name must be 20 characters or less' }))
      return false
    }
    setErrors(prev => ({ ...prev, name: undefined }))
    return true
  }

  const validateClass = (): boolean => {
    if (!selectedClass) {
      setErrors(prev => ({ ...prev, class: 'Please select a class to continue' }))
      return false
    }
    setErrors(prev => ({ ...prev, class: undefined }))
    return true
  }

  const handleNextFromName = () => {
    if (validateName(name)) {
      setStep('class')
    }
  }

  const handleNextFromClass = () => {
    if (validateClass()) {
      setStep('confirm')
    }
  }

  const handleCreateCharacter = () => {
    if (validateName(name) && validateClass() && selectedClass) {
      const character = characterService.createCharacter(name.trim(), selectedClass)
      onCharacterCreated(character)
    }
  }

  const handleClassSelect = (classType: Character['class']) => {
    setSelectedClass(classType)
    setErrors(prev => ({ ...prev, class: undefined }))
  }

  if (step === 'name') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Welcome to Habit Alchemy</CardTitle>
            <p className="text-gray-600 mt-2">Begin your journey of transformation</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label htmlFor="heroName" className="block text-sm font-medium text-gray-700 mb-2">
                Choose your hero name
              </label>
              <input
                id="heroName"
                type="text"
                value={name}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 20) // Enforce max length
                  setName(value)
                  if (errors.name) validateName(value)
                }}
                onBlur={() => validateName(name)}
                className={cn(
                  'w-full px-4 py-3 rounded-lg border transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
                  errors.name 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                )}
                placeholder="Enter your hero's name..."
                maxLength={20}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">{name.length}/20 characters</p>
            </div>

            <Button 
              onClick={handleNextFromName}
              className="w-full"
              size="lg"
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'class') {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <ClassSelector selectedClass={selectedClass} onSelect={handleClassSelect} />
          
          {errors.class && (
            <div className="mt-4 text-center">
              <p className="text-red-300 bg-red-900/20 px-4 py-2 rounded-lg inline-block">
                {errors.class}
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4 mt-8">
            <Button 
              variant="outline" 
              onClick={() => setStep('name')}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Back
            </Button>
            <Button 
              onClick={handleNextFromClass}
              disabled={!selectedClass}
              size="lg"
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'confirm' && selectedClass) {
    const preview = characterService.createCharacter(name.trim(), selectedClass)
    const suggestions = characterService.suggestDevelopmentPath(preview)

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Your Hero Awaits</CardTitle>
            <p className="text-gray-600">Review your character before beginning the adventure</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">{preview.name}</h2>
              <p className="text-lg text-violet-600 font-semibold">Level {preview.level} {preview.class}</p>
              <p className="text-gray-600">{suggestions.primaryFocus}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Starting Stats</h3>
                <div className="space-y-2">
                  {Object.entries(preview.stats).map(([stat, value]) => (
                    <div key={stat} className="flex justify-between items-center">
                      <span className="capitalize text-gray-700">{stat}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 transition-all"
                            style={{ width: `${(value / 20) * 100}%` }}
                          />
                        </div>
                        <span className="font-semibold text-gray-800 w-8 text-right">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Recommended Habits</h3>
                <div className="space-y-2">
                  {suggestions.recommendedHabits.slice(0, 3).map((habit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-violet-500" />
                      <span className="text-gray-700 capitalize">{habit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setStep('class')}
              >
                Back
              </Button>
              <Button 
                onClick={handleCreateCharacter}
                size="lg"
                className="px-8"
              >
                Begin Adventure
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}