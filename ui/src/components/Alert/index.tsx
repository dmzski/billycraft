import { MouseEventHandler, ReactNode, useMemo } from 'react'
import clsx from 'clsx'

const classes = {
  base: 'alert',
  variants: {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
  },
} as const

export type AlertProps = {
  variant?: keyof typeof classes.variants
  className?: string
  children: ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
}

const Alert = ({ variant, className, children, onClick }: AlertProps) => {
  const computedClassName = useMemo(() => {
    const variantClasses = variant ? classes.variants[variant] : undefined

    return clsx(classes.base, variantClasses, className)
  }, [variant, className])

  return (
    <div onClick={onClick} className={computedClassName}>
      {children}
    </div>
  )
}

export default Alert
