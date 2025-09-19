import { useEffect, useState } from 'react'
import { cn } from '../../utils/cn'

interface ProgressBarProps {
  progress: number
  max: number
  className?: string
  color?: 'violet' | 'green' | 'blue' | 'red' | 'yellow' | 'orange'
  showPercent?: boolean
  animated?: boolean
}

export function ProgressBar({ 
  progress, 
  max, 
  className,
  color = 'violet',
  showPercent = false,
  animated = true
}: ProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(animated ? 0 : progress)
  
  const percentage = Math.min((progress / max) * 100, 100)
  const displayPercentage = Math.min((displayProgress / max) * 100, 100)

  useEffect(() => {
    if (!animated) {
      setDisplayProgress(progress)
      return
    }

    const timer = setTimeout(() => {
      setDisplayProgress(progress)
    }, 100)

    return () => clearTimeout(timer)
  }, [progress, animated])

  const colorClasses = {
    violet: 'from-violet-500 to-violet-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-yellow-500 to-yellow-600',
    orange: 'from-orange-500 to-orange-600'
  }

  return (
    <div className={cn('relative', className)}>
      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
        <div 
          className={cn(
            'h-2 rounded-full bg-gradient-to-r transition-all duration-700 ease-out',
            colorClasses[color]
          )}
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
      
      {showPercent && percentage > 0 && (
        <div className="absolute -top-6 right-0 text-xs text-white/70">
          {Math.round(percentage)}%
        </div>
      )}

      {/* Glow effect for completed */}
      {percentage >= 100 && (
        <div className="absolute inset-0 rounded-full animate-pulse">
          <div className={cn(
            'w-full h-2 rounded-full bg-gradient-to-r opacity-50',
            colorClasses[color]
          )} />
        </div>
      )}
    </div>
  )
}