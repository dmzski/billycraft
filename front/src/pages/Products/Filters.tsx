import { LINE_TYPE } from '@/constants/line'
import { useI18n } from '@/i18n'
import { useAllSuppliersQuery } from '@/queries/useAllSuppliersQuery'
import { ProductFilters } from '@/utils/products'
import { Input, Select } from '@coco-ui/core'
import { ChangeEvent, ComponentProps, useMemo } from 'react'

type FiltersProps = {
  filters: ProductFilters
  onChangeFilters: (newFilters: ProductFilters) => void
}

export const Filters = ({ filters, onChangeFilters }: FiltersProps) => {
  const { scopedT, t } = useI18n()
  const { data: suppliers } = useAllSuppliersQuery()
  const pageT = scopedT('products.list.filters')

  const handleInputChange = (field: keyof ProductFilters, event: ChangeEvent<HTMLInputElement>) => {
    onChangeFilters({
      ...filters,
      [field]: event.target.value ?? '',
    })
  }

  const handleSelectChange = (field: keyof ProductFilters, newValue: string) => {
    onChangeFilters({
      ...filters,
      [field]: newValue ?? '',
    })
  }

  const typeOptions: ComponentProps<typeof Select>['options'] = useMemo(
    () => [
      { value: '', label: t('select') },
      ...Object.values(LINE_TYPE).map(type => ({
        value: type.enum,
        label: type.name,
      })),
    ],
    [t],
  )

  const supplierOptions: ComponentProps<typeof Select>['options'] = useMemo(
    () => [
      { value: '', label: t('select') },
      ...(suppliers?.map(({ id, name }) => ({
        value: id,
        label: name,
      })) ?? []),
    ],
    [suppliers, t],
  )

  return (
    <div className="grid md:grid-cols-12 gap-5">
      <Select
        options={supplierOptions}
        className="md:col-span-2"
        label={pageT('fields.supplier.label')}
        value={filters.supplierId}
        name="filters.supplier"
        placeholder={t('select')}
        onChange={e => {
          if (typeof e === 'string') {
            handleSelectChange('supplierId', e)
          }
        }}
        isSearchable
      />
      <Select
        options={typeOptions}
        className="md:col-span-2"
        placeholder={t('select')}
        label={pageT('fields.type.label')}
        value={filters.type}
        name="filters.type"
        onChange={e => {
          if (typeof e === 'string') {
            handleSelectChange('type', e)
          }
        }}
      />
      <Input
        className="md:col-span-8"
        label={pageT('fields.name.label')}
        value={filters.name}
        name="filters.name"
        onChange={e => handleInputChange('name', e)}
      />
    </div>
  )
}
