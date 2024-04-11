import { ThHTMLAttributes } from 'react'
import ChevronUpIcon from '@heroicons/react/24/solid/ChevronUpIcon'
import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon'
import ChevronUpDownIcon from '@heroicons/react/24/solid/ChevronUpDownIcon'
import clsx from 'clsx'

type TableHeadCellProps<T extends object> = ThHTMLAttributes<HTMLTableCellElement> & {
  sortable?: keyof T
  onSort?: (field: keyof T, order: 'asc' | 'desc') => void
  sort?: { field: keyof T; order: 'asc' | 'desc' }
}

const TableHeadCell = <T extends object>({
  children,
  className,
  sortable,
  sort,
  onSort,
  onClick,
  ...props
}: TableHeadCellProps<T>) => {
  const isCurrentSort = sort?.field === sortable
  return (
    <th
      className={clsx(sortable ? 'cursor-pointer relative' : '', className)}
      onClick={event => {
        if (sortable) {
          onSort?.(
            sortable,
            isCurrentSort && (!sort?.order || sort?.order === 'asc') ? 'desc' : 'asc',
          )
        }
        onClick?.(event)
      }}
      {...props}
    >
      {sortable ? (
        <div className="flex items-center gap-4 hover:text-primary group">
          <span>{children}</span>
          {isCurrentSort ? (
            <>
              {sort?.order === 'asc' ? (
                <ChevronUpIcon className="w-4" />
              ) : (
                <ChevronDownIcon className="w-4" />
              )}
            </>
          ) : (
            <ChevronUpDownIcon className="w-4 opacity-0 group-hover:opacity-100" />
          )}
        </div>
      ) : (
        children
      )}
    </th>
  )
}

export default TableHeadCell
