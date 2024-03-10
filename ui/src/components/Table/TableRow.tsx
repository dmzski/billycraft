import { ForwardedRef, HTMLAttributes, ReactNode, forwardRef } from "react"

export type TableRowProps = HTMLAttributes<HTMLTableRowElement> & {
  hoverable?: boolean
  children?: ReactNode
}

const TableRow = (
  { children, hoverable, className, ...props }: TableRowProps,
  ref: ForwardedRef<HTMLTableRowElement>
) => (
  <tr
    ref={ref}
    className={[
      'table-body-row',
      hoverable ? 'hoverable' : undefined,
      className,
    ].join(' ')}
    {...props}
  >
    {children}
  </tr>
)

export default forwardRef(TableRow)
