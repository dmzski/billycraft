import { LINE_TYPE } from "@/constants/line"
import { useI18n } from "@/i18n"
import { ProductFilters } from "@/utils/products"
import { Input, Select } from "@coco-ui/core"
import { ChangeEvent, ComponentProps, useMemo } from "react"

type FiltersProps = {
  filters: ProductFilters
  onChangeFilters: (newFilters: ProductFilters) => void
}

export const Filters = ({ filters, onChangeFilters }: FiltersProps) => {
  const { scopedT, t } = useI18n()
  const pageT = scopedT('products.list.filters')

  const handleInputChange = (field: keyof ProductFilters, event: ChangeEvent<HTMLInputElement>) => {
    onChangeFilters({
      ...filters,
      [field]: event.target.value ?? ""
    })
  }

  const handleSelectChange = (field: keyof ProductFilters, newValue: string) => {
    onChangeFilters({
      ...filters,
      [field]: newValue ?? ""
    })
  }

  const typeOptions: ComponentProps<typeof Select>['options'] = useMemo(() => [
    { value: '', label: t('select') },
    ...Object.values(LINE_TYPE).map(type => ({
      value: type.enum,
      label: type.name,
    }))], [t])

  return (
    <div className="grid md:grid-cols-12 gap-5">
      <Select
        options={typeOptions}
        className="md:col-span-2"
        label={pageT('fields.type.label')}
        value={filters.type}
        name="filters.type"
        onChange={e => {
          if (typeof e === "string") {
            handleSelectChange('type', e)
          }
        }}
      />
      <Input
        className="md:col-span-10"
        label={pageT('fields.name.label')}
        value={filters.name}
        name="filters.name"
        onChange={e => handleInputChange('name', e)}
      />
    </div>
  )
}
