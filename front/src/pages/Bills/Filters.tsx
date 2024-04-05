import { Input, Select } from '@coco-ui/core'
import { ChangeEventHandler, Dispatch, SetStateAction, useMemo } from 'react'
import { useI18n } from '@/i18n'
import { BillStatusEnum } from '@/models/Bill'

type BillFilterContainerProps = {
  filters: Record<string, string>
  setFilters: Dispatch<SetStateAction<Record<string, string>>>
  disabledFilters?: string[]
}
const BillFilterContainer = ({
  filters,
  setFilters,
  disabledFilters,
}: BillFilterContainerProps) => {
  const { t } = useI18n()

  const handleChange =
    (field: keyof typeof filters): ChangeEventHandler<HTMLInputElement> =>
    e => {
      setFilters({ ...filters, [field]: e.target.value })
    }

  const statusOptions = useMemo(
    () => [
      { value: 'none', label: t('select') },
      ...[
        BillStatusEnum.DRAFT,
        BillStatusEnum.SENT,
        BillStatusEnum.PAYMENT_PAID,
        BillStatusEnum.TO_DECLARE,
        BillStatusEnum.REFUSED,
      ]
        .sort()
        .map(status => ({
          value: status,
          label: t(`bills.status.${status}`),
        })),
    ],
    [t],
  )

  return (
    <div className="grid gap-4 md:grid-cols-12">
      <Input
        className="md:col-span-2"
        label={t('bills.list.filters.fields.reference.label')}
        value={filters.id}
        onChange={handleChange('id')}
      />
      <Input
        className="md:col-span-3"
        label={t('bills.list.filters.fields.title.label')}
        value={filters.title}
        onChange={handleChange('title')}
      />
      <Input
        label={t('bills.list.filters.fields.customer.label')}
        className="md:col-span-3"
        value={filters.customer}
        onChange={handleChange('customer')}
      />
      <Input
        className="md:col-span-2"
        label={t('bills.list.filters.fields.createdAt.label')}
        value={filters.createdAt}
        onChange={handleChange('createdAt')}
      />
      <Select
        className="md:col-span-2"
        label={t('bills.list.filters.fields.status.label')}
        value={filters.status}
        onChange={value => {
          setFilters(current => ({
            ...current,
            status: `${value}`,
          }))
        }}
        disabled={disabledFilters?.includes('status')}
        options={statusOptions}
      />
    </div>
  )
}

export default BillFilterContainer
