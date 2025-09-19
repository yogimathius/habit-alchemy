import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

interface XPGainAnimationProps {
  xp: number
  trigger: boolean
  onComplete?: () => void
}

export function XPGainAnimation({ xp, trigger, onComplete }: XPGainAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    if (trigger && xp > 0) {
      setIsVisible(true)
      
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [trigger, xp, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="animate-bounce">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
          <Star className="w-5 h-5" />
          <span className="font-bold text-lg">+{xp} XP</span>
        </div>
      </div>
    </div>
  )
}