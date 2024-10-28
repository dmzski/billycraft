import { VariantProps, cva } from 'class-variance-authority'
import { tw } from 'lib/utils'
import { ComponentPropsWithoutRef, cloneElement, forwardRef, isValidElement } from 'react'

const linkVariants = cva('cursor-pointer', {
  variants: {
    variant: {
      default: 'text-foreground hover:underline font-semibold underline-offset-4',
      button:
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary h-10 px-4 py-2 hover:bg-accent hover:text-accent-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type LinkProps = ComponentPropsWithoutRef<'a'> &
  VariantProps<typeof linkVariants> & { asChild?: boolean }

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, children, variant, asChild, ...props }, ref) => {
    if (asChild && isValidElement(children)) {
      return cloneElement(children, {
        ...(children.props ?? {}),
        className: tw(linkVariants({ variant, className })),
      } as any)
    }

    return (
      <a ref={ref} className={tw(linkVariants({ variant }), className)} {...props}>
        {children}
      </a>
    )
  },
)
Link.displayName = 'Link'
