import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-white/90 backdrop-blur-sm shadow-lg',
        className
      )}
      {...props}
    />
  )
}

type CardHeaderProps = HTMLAttributes<HTMLDivElement>

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
}

type CardTitleProps = HTMLAttributes<HTMLHeadingElement>

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
}

type CardContentProps = HTMLAttributes<HTMLDivElement>

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}