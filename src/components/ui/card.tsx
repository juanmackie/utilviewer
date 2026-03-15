import * as React from 'react'

type CardProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm ${className}`}
      {...props}
    />
  )
}

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>

export function CardHeader({ className = '', ...props }: CardHeaderProps) {
  return (
    <div
      className={`flex flex-col gap-1.5 px-6 py-4 ${className}`}
      {...props}
    />
  )
}

type CardTitleProps = React.HTMLAttributes<HTMLDivElement>

export function CardTitle({ className = '', ...props }: CardTitleProps) {
  return (
    <div
      className={`font-semibold leading-none ${className}`}
      {...props}
    />
  )
}

type CardContentProps = React.HTMLAttributes<HTMLDivElement>

export function CardContent({ className = '', ...props }: CardContentProps) {
  return (
    <div
      className={`px-6 py-4 ${className}`}
      {...props}
    />
  )
}
