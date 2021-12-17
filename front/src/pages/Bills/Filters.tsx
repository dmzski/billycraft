import { DatePicker, Input } from '@coco-ui/core'
import { formatISO9075 } from 'date-fns'
import { Dispatch, SetStateAction } from 'react'

type BillFilterContainerProps = {
  filters: Record<string, string>
  setFilters: Dispatch<SetStateAction<Record<string, string>>>
}
const BillFilterContainer = ({ filters, setFilters }: BillFilterContainerProps): JSX.Element => (
  <div className="flex items-center justify-around my-2">
    <Input
      label="Titre"
      variant="outside"
      value={filters.title}
      onChange={e => setFilters({ ...filters, title: e.target.value })}
    />
    <Input
      label="Client"
      variant="outside"
      value={filters.customer}
      onChange={e => setFilters({ ...filters, customer: e.target.value })}
    />
    <DatePicker
      label="Date de création"
      variant="outside"
      value={filters.createdAt ? new Date(filters.createdAt) : undefined}
      onChange={date =>
        setFilters({
          ...filters,
          createdAt: formatISO9075(date, { representation: 'date' }),
        })
      }
    />
    <DatePicker
      label="Date d'envoi"
      variant="outside"
      value={filters.sentAt ? new Date(filters.sentAt) : undefined}
      onChange={date =>
        setFilters({ ...filters, sentAt: formatISO9075(date, { representation: 'date' }) })
      }
    />
  </div>
)

export default BillFilterContainer
