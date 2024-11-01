import { useI18n } from '@/i18n'
import { Button, Collapsible, Input } from '@coco-ui/core'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import { ChangeEventHandler, Dispatch, SetStateAction, useReducer } from 'react'

type QuoteFilterContainerProps = {
  filters: Record<string, string>
  setFilters: Dispatch<SetStateAction<Record<string, string>>>
}

const QuoteFilterContainer = ({
  filters,
  setFilters,
}: QuoteFilterContainerProps) => {
  const { t } = useI18n()
	const [open, toggleOpen] = useReducer((state) => !state, false);

  const handleChange =
    (field: keyof typeof filters): ChangeEventHandler<HTMLInputElement> =>
    e => {
      setFilters({ ...filters, [field]: e.target.value })
    }

  return (
		<Collapsible
			open={open}
			disclosure={
				<Button onClick={toggleOpen} variant="ghost">
					{open ? (
						<EyeSlashIcon />
					) : (
						<EyeIcon />
					)}
					{open ? t("hideFilters") : t("displayFilters")}
				</Button>
			}
		>
			<div className="grid md:grid-cols-4 gap-4 border rounded-md p-4">
      <Input
        label={t('quotes.list.filters.fields.reference.label')}
        value={filters.name}
        onChange={handleChange('name')}
      />
      <Input
        label={t('quotes.list.filters.fields.title.label')}
        value={filters.title}
        onChange={handleChange('title')}
      />
      <Input
        label={t('quotes.list.filters.fields.customer.label')}
        value={filters.customer}
        onChange={handleChange('customer')}
      />
      <Input
        label={t('quotes.list.filters.fields.createdAt.label')}
        value={filters.createdAt}
        onChange={handleChange('createdAt')}
      />
    </div>
    </Collapsible>
  )
}

export default QuoteFilterContainer
