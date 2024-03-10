import { ForwardedRef, HTMLAttributes, ReactNode, forwardRef } from 'react'
import TableBody from './TableBody'
import TableHead from './TableHead'
import TableHeadCell from './TableHeadCell'
import TableRow from './TableRow'

export type TableProps = {
  children: ReactNode
  className?: string
}
const Table = ({ children, className, ...props }: TableProps) => (
  <table className={['table-container', className].join(' ')} {...props}>
    {children}
  </table>
)

Table.Head = TableHead
Table.HeadCell = TableHeadCell
Table.Body = TableBody
Table.Row = TableRow

type TableCellProps = HTMLAttributes<HTMLTableCellElement> & {
  children: ReactNode
}
const TableCell = (
  { children, className, ...props }: TableCellProps,
  ref: ForwardedRef<HTMLTableCellElement>
) => (
  <td ref={ref} className={[className].join(' ')} {...props}>
    {children}
  </td>
)

Table.Cell = forwardRef(TableCell)

export default Table
