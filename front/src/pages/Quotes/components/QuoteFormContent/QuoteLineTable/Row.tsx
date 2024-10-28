import { Button, Input } from '@coco-ui/core'
import { LineTypeEnum } from '@/models/LineTypeEnum'
import { ComponentProps, useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { LINE_TYPE } from '@/constants/line'
import {
  ArrowsUpDownIcon,
  CloudArrowDownIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/solid'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useI18n } from '@/i18n'
import { QuoteFormValues } from '../types'
import { calculatePriceETFromIT, calculatePriceTTC } from '@/utils/price'
import { AddProductModal } from '@/pages/Products/modals/AddProductModal'
import { InputField } from '@/components/form/InputField'
import { SelectField } from '@/components/form/SelectField'
import { TextAreaField } from '@/components/form/TextAreaField'

type QuoteLineTableLineProps = {
  deleteLine: () => void
  disabled?: boolean
  index: number
  id: string
}
const QuoteLineTableLine = ({ deleteLine, disabled, index, id }: QuoteLineTableLineProps) => {
  const { control, setValue } = useFormContext<QuoteFormValues>()
  const { t } = useI18n()
  const { listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: {
      lineIndex: index,
    },
  })
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  }

  const [tva, quantity = 0, itPrice = 0] = useWatch({
    control,
    name: ['tva', `lines.${index}.quantity`, `lines.${index}.itPrice`],
  })

  const totalTTC = useMemo(() => {
    if (Number.isNaN(quantity) || !quantity) {
      return 0
    }

    return quantity * itPrice
  }, [itPrice, quantity])

  const typeOptions: ComponentProps<typeof SelectField>['options'] = Object.values(LINE_TYPE).map(
    ({ name, icon: IconComponent, enum: value }) => ({
      value,
      label: (
        <span className="inline-flex gap-1 items-center">
          <IconComponent className="w-5" />
          {name}
        </span>
      ),
      render: <IconComponent className="w-5" />,
    }),
  )

  const lineValue = useWatch({ control, name: `lines.${index}` })

  return (
    <div className="flex gap-2 py-2 bg-background items-start" ref={setNodeRef} style={style}>
      <div>
        <div className="pt-4">
          <Button variant="ghost" size="icon" {...listeners}>
            <ArrowsUpDownIcon />
          </Button>
        </div>
      </div>
      <div className="flex flex-col flex-grow gap-4">
        <div className="grid md:grid-cols-[repeat(10,minmax(0,1fr))_minmax(0,auto)] gap-4">
          <div className="md:col-span-6 flex flex-col gap-2">
            <div className="flex flex-row items-end gap-2">
              <SelectField
                control={control}
                className="w-auto"
                name={`lines.${index}.type`}
                aria-label={t('quotes.form.lines.fields.type.label')}
                label={t('quotes.form.lines.fields.type.label')}
                disabled={disabled}
                required
                onChange={type => {
                  if (type === LineTypeEnum.TEXT) {
                    setValue(`lines.${index}.price`, 0)
                    setValue(`lines.${index}.itPrice`, 0)
                    setValue(`lines.${index}.quantity`, 0)
                  }
                }}
                options={typeOptions}
              />
              <InputField
                control={control}
                name={`lines.${index}.name`}
                label={t('quotes.form.lines.fields.name.label')}
                required
                placeholder={t('quotes.form.lines.fields.name.placeholder')}
                disabled={disabled}
                suffix={
                  !lineValue.productId && lineValue.name ? (
                    <AddProductModal
                      initialValues={{
                        ...lineValue,
                        supplierId: null,
                        code: null,
                        stock: null,
                        groupId: null,
                      }}
                      disclosure={
                        <Button variant="ghost" className="rounded-none rounded-r-md" size="icon">
                          <CloudArrowDownIcon />
                        </Button>
                      }
                      onSubmitSuccess={newId => {
                        setValue(`lines.${index}.productId`, newId)
                      }}
                    />
                  ) : undefined
                }
              />
            </div>
            {lineValue.description !== null ? (
              <div className="flex flex-col items-start">
                <TextAreaField
                  placeholder={t('quotes.form.lines.fields.description.placeholder')}
                  className="md:col-span-6"
                  rows={1}
                  disabled={disabled}
                  control={control}
                  name={`lines.${index}.description`}
                />
                <Button
                  variant="link"
                  onClick={() => {
                    setValue(`lines.${index}.description`, null)
                  }}
                  size="sm"
                >
                  <MinusIcon />
                  {t('quotes.form.lines.deleteDescription')}
                </Button>
              </div>
            ) : (
              <div className="flex">
                <Button
                  variant="link"
                  onClick={() => {
                    setValue(`lines.${index}.description`, '')
                  }}
                  size="sm"
                >
                  <PlusIcon />
                  {t('quotes.form.lines.addDescription')}
                </Button>
              </div>
            )}
          </div>
          {lineValue.type !== LineTypeEnum.TEXT ? (
            <>
              <div>
                <InputField
                  control={control}
                  name={`lines.${index}.quantity`}
                  asNumber
                  label={t('quotes.form.lines.fields.quantity.label')}
                  disabled={disabled}
                  placeholder={t('quotes.form.lines.fields.quantity.placeholder')}
                  type="number"
                  step={0.01}
                  required
                />
              </div>
              <div>
                <InputField
                  control={control}
                  name={`lines.${index}.price`}
                  label={t('quotes.form.lines.fields.etPrice.label')}
                  disabled={disabled}
                  required
                  placeholder={t('quotes.form.lines.fields.etPrice.placeholder')}
                  type="number"
                  step={0.01}
                  onBlur={event => {
                    const newPrice = Number(event.target.value) || 0
                    setValue(`lines.${index}.itPrice`, calculatePriceTTC(newPrice, tva))
                  }}
                  suffix={<span className="px-1">€</span>}
                />
              </div>
              <div>
                <InputField
                  control={control}
                  name={`lines.${index}.itPrice`}
                  label={t('quotes.form.lines.fields.totalItPrice.label')}
                  onBlur={event => {
                    const newPrice = Number(event.target.value) || 0
                    const newEtPrice = calculatePriceETFromIT(newPrice, tva)
                    setValue(`lines.${index}.price`, newEtPrice)
                  }}
                  suffix={<span className="px-2">€</span>}
                />
              </div>
              <div>
                <Input
                  label={t('quotes.form.lines.fields.subTotal.label')}
                  readOnly
                  value={totalTTC}
                  suffix={<span className="px-2">€</span>}
                />
              </div>
            </>
          ) : (
            <div className="md:col-span-4" />
          )}
          {!disabled ? (
            <div className="pt-4 flex justify-end">
              <Button variant="destructive" size="icon" onClick={deleteLine}>
                <TrashIcon />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default QuoteLineTableLine
