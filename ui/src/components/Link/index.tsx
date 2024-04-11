import clsx from 'clsx'
import { ComponentProps, ComponentType, ElementType, ReactNode, useMemo } from 'react'

const classes = {
  base: 'link',
  hover: 'link-hover',
  variants: {
    primary: 'link-primary',
    neutral: 'link-neutral',
    secondary: 'link-secondary',
    accent: 'link-accent',
    success: 'link-success',
    info: 'link-info',
    warning: 'link-warning',
    error: 'link-error',
  },
} as const

type Variant = keyof typeof classes.variants

export type LinkProps<T extends ComponentType | ElementType> = {
  as?: T
  className: string
  children: ReactNode
  href: string
  variant: Variant
  linkType?: 'hover' | 'normal'
} & ComponentProps<T>

const Link = <T extends ComponentType | ElementType = 'a'>({
  className,
  children,
  variant = 'primary',
  linkType = 'normal',
  as,
  ...props
}: LinkProps<T>) => {
  const Component = as ?? 'a'
  const computedClasses = useMemo(() => {
    const variantClasses = variant ? classes.variants[variant as Variant] : ''

    return clsx(classes.base, variantClasses, linkType === 'hover' && classes.hover, className)
  }, [linkType, variant, className])

  return (
    <Component className={computedClasses} {...props}>
      {children}
    </Component>
  )
}

export default Link
