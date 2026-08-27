import { cn } from '../../lib/cn'

/** Card surface matching the reference tokens. */
export function Card({ className = '', ...props }) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className,
      )}
      {...props}
    />
  )
}

export function CardContent({ className = '', ...props }) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

export default Card
