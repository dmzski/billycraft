import { Input, Select } from '@coco-ui/core'
import { QUOTE_STATUS } from 'constants/quote'
import { Dispatch, SetStateAction } from 'react'

type QuoteFilterContainerProps = {
  filters: Record<string, string>
  setFilters: Dispatch<SetStateAction<Record<string, string>>>
  disabledFilters?: string[]
}

const QuoteFilterContainer = ({
  filters,
  setFilters,
  disabledFilters = [],
}: QuoteFilterContainerProps): JSX.Element => (
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
    <Input
      className="w-48 mr-2"
      label="Date de création"
      variant="outside"
      value={filters.createdAt}
      onChange={event =>
        setFilters({
          ...filters,
          createdAt: event.target.value,
        })
      }
    />
    <Input
      className="w-48 mr-2"
      label="Date d'envoi"
      variant="outside"
      value={filters.sentAt}
      onChange={event => setFilters({ ...filters, sentAt: event.target.value })}
    />
    <div className="w-48">
      <Select
        label="Status"
        variant="outside"
        value={filters.status}
        onChange={value => {
          setFilters(current => ({
            ...current,
            status: `${value}`,
          }))
        }}
        disabled={disabledFilters.includes('status')}
        options={[
          { value: 'none', label: 'Sélectionner' },
          ...Object.values(QUOTE_STATUS)
            .filter(
              ({ enum: statusEnum }) =>
                ![QUOTE_STATUS.ARCHIVED.enum, QUOTE_STATUS.REFUSED.enum].includes(statusEnum),
            )
            .map(({ enum: statusEnum, text }) => ({
              value: statusEnum,
              label: text,
            })),
        ]}
      />
    </div>
  </div>
)

export default QuoteFilterContainer
