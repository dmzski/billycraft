import { ForwardedRef, HTMLAttributes, ReactNode, forwardRef } from 'react'

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement> & {
  children: ReactNode
}

const TableBody = (
  { children, ...props }: TableBodyProps,
  ref: ForwardedRef<HTMLTableSectionElement>,
) => (
  <tbody ref={ref} {...props}>
    {children}
  </tbody>
)

export default forwardRef(TableBody)
