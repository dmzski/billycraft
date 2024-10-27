import { cva, type VariantProps } from "class-variance-authority"

import { tw } from "lib/utils"
import { ComponentPropsWithoutRef, forwardRef } from "react"

const labelVariants = cva(
  "text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

export const Label = forwardRef<
  HTMLLabelElement,
  ComponentPropsWithoutRef<"label"> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={tw(labelVariants(), className)}
    {...props}
  />
))
