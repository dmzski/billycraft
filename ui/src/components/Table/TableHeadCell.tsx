import { ThHTMLAttributes, useState } from "react";
import ChevronUpIcon from '@heroicons/react/24/solid/ChevronUpIcon'
import ChevronDownIcon from '@heroicons/react/24/solid/ChevronDownIcon'
import ChevronUpDownIcon from '@heroicons/react/24/solid/ChevronUpDownIcon'
import clsx from "clsx";

type TableHeadCellProps<T extends object> = ThHTMLAttributes<HTMLTableCellElement> & {
  sortable?: keyof T
  onSort?: (field: keyof T, order: 'asc' | 'desc') => void
  sort?: { field: keyof T; order: 'asc' | 'desc' }
}

const TableHeadCell = <T extends object,>({
  children,
  className,
  sortable,
  sort,
  onSort,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props
}: TableHeadCellProps<T>) => {
  const isCurrentSort = sort?.field === sortable
  const [isHover, setIsHover] = useState(false)
  return (
    <th
      onMouseEnter={(e) => {
        onMouseEnter?.(e)
        setIsHover(true)
      }}
      onMouseLeave={(e) => {
        onMouseLeave?.(e)
        setIsHover(false)
      }}
      className={[
        'table-head',
        sortable ? 'cursor-pointer relative' : '',
        className,
      ].join(' ')}
      onClick={(event) => {
        if (sortable) {
          onSort?.(
            sortable,
            isCurrentSort && (!sort?.order || sort?.order === 'asc')
              ? 'desc'
              : 'asc'
          )
        }
        onClick?.(event)
      }}
      {...props}
    >
      {sortable ? (
        <div className="table-head-cell">
          <span>{children}</span>
          {isCurrentSort ? (
            <>
              {sort?.order === "asc" ? (
                <ChevronUpIcon />
              ) : <ChevronDownIcon />}
            </>
          ) : (
            <ChevronUpDownIcon
              className={clsx(['m-1', !isHover ? 'opacity-0' : undefined])}
              name="sort-ascending"
            />
          )}
        </div>
      ) : (
        children
      )}
    </th>
  )
}

export default TableHeadCell
