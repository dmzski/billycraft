import { Button, Input, Select, TextArea } from '@coco-ui/core'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { LineTypeEnum } from '@/models/LineTypeEnum'
import { useMemo } from 'react'
import { Control, Controller, useWatch } from 'react-hook-form'
import { LINE_TYPE } from '@/constants/line'
import { QuoteFormValues } from '../Form'
import { ArrowsUpDownIcon, TrashIcon } from '@heroicons/react/24/solid'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useI18n } from '@/i18n'

type QuoteLineTableLineProps = {
  deleteLine: () => void
  disabled?: boolean
  index: number
  control: Control<QuoteFormValues>
  id: string
}
const QuoteLineTableLine = ({
  deleteLine,
  disabled,
  index,
  id,
  control,
}: QuoteLineTableLineProps) => {
  const { t } = useI18n()
  const tva = useWatch({ control, name: 'tva' })
  const formatPrice = useFormatCurrency()
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    data: {
      lineIndex: index,
    },
  })
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  const price = useWatch({
    control,
    name: `lines.${index}.price`,
    defaultValue: 0,
  })
  const quantity = useWatch({
    control,
    name: `lines.${index}.quantity`,
    defaultValue: 0,
  })

  const priceTTC = useMemo(() => {
    if (Number.isNaN(price) || !price) {
      return 0
    }
    const computedTva = Number(tva) || 0

    return Math.round(price * (1 + computedTva / 100) * 100) / 100
  }, [price, tva])

  const totalTTC = useMemo(() => {
    if (Number.isNaN(quantity) || !quantity) {
      return 0
    }

    return quantity * priceTTC
  }, [priceTTC, quantity])

  return (
    <div
      className="bg-base-100 grid md:grid-cols-12 mb-2 p-2 gap-2"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className="flex md:col-span-2">
        <div className="items-center flex p-2" {...listeners}>
          <ArrowsUpDownIcon className="w-5" />
        </div>
        <Controller
          name={`lines.${index}.type`}
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { invalid } }) => (
            <Select
              className="min-w-0"
              disabled={disabled}
              error={invalid}
              value={field.value}
              onChange={type => field.onChange(type as LineTypeEnum)}
              ref={field.ref}
              options={Object.values(LINE_TYPE).map(type => ({
                value: type.enum,
                label: type.name,
              }))}
              name={field.name}
              id={`${field.name}-select`}
            />
          )}
        />
      </div>
      <Controller
        name={`lines.${index}.name`}
        rules={{ required: true }}
        defaultValue=""
        control={control}
        render={({ field, fieldState: { invalid } }) => (
          <Input
            required
            placeholder={t('quotes.form.lines.fields.name.placeholder')}
            className="md:col-span-3"
            disabled={disabled}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            error={invalid}
            ref={field.ref}
          />
        )}
      />
      <Controller
        name={`lines.${index}.description`}
        control={control}
        render={({ field }) => (
          <TextArea
            placeholder={t('quotes.form.lines.fields.description.placeholder')}
            className="md:col-span-3"
            rows={1}
            disabled={disabled}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
          />
        )}
      />
      <Controller
        defaultValue={0}
        name={`lines.${index}.quantity`}
        control={control}
        render={({ field }) => (
          <Input
            disabled={disabled}
            className="md:col-span-1"
            placeholder={t('quotes.form.lines.fields.quantity.placeholder')}
            type="number"
            step={0.01}
            name={field.name}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={event => {
              field.onChange(Number((event.target as HTMLInputElement).value) || 0)
              field.onBlur()
            }}
            ref={field.ref}
          />
        )}
      />
      <Controller
        defaultValue={0}
        name={`lines.${index}.price`}
        control={control}
        render={({ field }) => (
          <Input
            className="md:col-span-1"
            disabled={disabled}
            placeholder={t('quotes.form.lines.fields.etPrice.placeholder')}
            type="number"
            step={0.01}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={event => {
              field.onChange(Number((event.target as HTMLInputElement).value) || 0)
              field.onBlur()
            }}
            ref={field.ref}
          />
        )}
      />
      <div className="flex items-center">{formatPrice(priceTTC)}</div>
      <div className="pr-2 flex items-center justify-between">
        <div className="flex-grow">{formatPrice(totalTTC)}</div>
        {!disabled ? (
          <Button variant="ghost" className="text-error" square size="sm" onClick={deleteLine}>
            <TrashIcon className="w-5" />
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export default QuoteLineTableLine
