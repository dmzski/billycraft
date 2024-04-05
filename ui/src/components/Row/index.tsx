import clsx from 'clsx'
import { HTMLAttributes, ReactNode } from 'react'

export type RowProps = HTMLAttributes<HTMLDivElement> & {
  template?: string
  children?: ReactNode
}
const Row = ({
  template,
  children,
  className,
  ...props
}: RowProps) => {
  const finalClasses = clsx("grid", className)

  return (
    <div style={{ gridTemplateColumns: template }} className={finalClasses} {...props}>
      {children}
    </div>
  )
}

export default Row
