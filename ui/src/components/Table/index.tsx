import { ForwardedRef, HTMLAttributes, ReactNode, forwardRef } from 'react'
import TableBody from './TableBody'
import TableHead from './TableHead'
import TableHeadCell from './TableHeadCell'
import TableRow from './TableRow'
import clsx from 'clsx'

export type TableProps = {
  children: ReactNode
  className?: string
  pinRows?: boolean
  pinCols?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  zebra?: boolean
}
const Table = ({ children, className, pinRows, zebra, size, pinCols, ...props }: TableProps) => {
  const finalClassNames = clsx(
    'table',
    {
      'table-pin-rows': pinRows,
      'table-pin-cols': pinCols,
      'table-zebra': zebra,
    },
    size ? `table-${size}` : '',
    className,
  )
  return (
    <table className={finalClassNames} {...props}>
      {children}
    </table>
  )
}

Table.Head = TableHead
Table.HeadCell = TableHeadCell
Table.Body = TableBody
Table.Row = TableRow

type TableCellProps = HTMLAttributes<HTMLTableCellElement> & {
  children: ReactNode
}
const TableCell = (
  { children, ...props }: TableCellProps,
  ref: ForwardedRef<HTMLTableCellElement>,
) => (
  <td ref={ref} {...props}>
    {children}
  </td>
)

Table.Cell = forwardRef(TableCell)

export default Table
