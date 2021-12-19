import { DatePicker, Input } from '@coco-ui/core'
import { formatISO9075 } from 'date-fns'
import { Dispatch, SetStateAction } from 'react'

type BillFilterContainerProps = {
  filters: Record<string, string>
  setFilters: Dispatch<SetStateAction<Record<string, string>>>
}
const BillFilterContainer = ({ filters, setFilters }: BillFilterContainerProps): JSX.Element => (
  <div className="flex my-2">
    <Input
      className="w-32 mr-2"
      label="Référence"
      variant="outside"
      value={filters.id}
      onChange={e => setFilters({ ...filters, id: e.target.value })}
    />
    <Input
      className="w-96 mr-2"
      label="Titre"
      variant="outside"
      value={filters.title}
      onChange={e => setFilters({ ...filters, title: e.target.value })}
    />
    <Input
      label="Client"
      className="w-80 mr-2"
      variant="outside"
      value={filters.customer}
      onChange={e => setFilters({ ...filters, customer: e.target.value })}
    />
    <div className="mr-2">
      <DatePicker
        className="w-48"
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
    </div>
    <DatePicker
      className="w-48"
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
