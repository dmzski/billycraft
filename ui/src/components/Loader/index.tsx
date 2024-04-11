import clsx from 'clsx'
import { useMemo } from 'react'

const classes = {
  base: 'loading loading-spinner',
  variants: {
    accent: 'text-accent',
    secondary: 'text-secondary',
    neutral: 'text-neutral',
    error: ' text-error',
    info: 'text-info',
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
  },
  sizes: {
    xs: 'loading-xs',
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
  },
} as const

export type LoaderProps = {
  size?: keyof typeof classes.sizes
  variant?: keyof typeof classes.variants
  className?: string
}

const Loader = ({ size = 'md', variant = 'primary', className = '' }: LoaderProps) => {
  const computedClasses = useMemo(() => {
    const variantClasses = variant ? classes.variants[variant] : ''
    const sizeClasses = size ? classes.sizes[size] : ''

    return clsx(classes.base, variantClasses, sizeClasses, className)
  }, [variant, size, className])

  return <div className={computedClasses} />
}

export default Loader
