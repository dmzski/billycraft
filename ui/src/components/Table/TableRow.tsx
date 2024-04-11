import clsx from 'clsx'
import { ForwardedRef, HTMLAttributes, ReactNode, forwardRef } from 'react'

export type TableRowProps = HTMLAttributes<HTMLTableRowElement> & {
  hoverable?: boolean
  children?: ReactNode
}

const TableRow = (
  { children, hoverable, className, ...props }: TableRowProps,
  ref: ForwardedRef<HTMLTableRowElement>,
) => (
  <tr ref={ref} className={clsx(hoverable ? 'hover cursor-pointer' : null, className)} {...props}>
    {children}
  </tr>
)

export default forwardRef(TableRow)
