import { Button, Input, Select, TextArea } from '@coco-ui/core'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { LineTypeEnum } from '@/models/LineTypeEnum'
import { useMemo } from 'react'
import { Control, useController, useWatch } from 'react-hook-form'
import { LINE_TYPE } from '@/constants/line'
import { ArrowsUpDownIcon, TrashIcon } from '@heroicons/react/24/solid'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useI18n } from '@/i18n'
import { QuoteFormValues } from '../types'

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

  const typeOptions = Object.values(LINE_TYPE).map(type => ({
    value: type.enum,
    label: type.name,
  }))

  const { field: typeField, fieldState: typeFieldState } = useController({
    control,
    name: `lines.${index}.type`,
    rules: { required: true },
  })
  const { field: nameField, fieldState: nameFieldState } = useController({
    control,
    name: `lines.${index}.name`,
    rules: { required: true },
    defaultValue: '',
  })
  const { field: descriptionField } = useController({
    control,
    name: `lines.${index}.description`,
    defaultValue: '',
  })
  const { field: quantityField } = useController({
    control,
    name: `lines.${index}.quantity`,
    defaultValue: 0,
  })
  const { field: priceField } = useController({
    control,
    name: `lines.${index}.price`,
    defaultValue: 0,
  })

  return (
    <div
      className="flex items-center gap-2 border-b pb-4"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <Button variant="ghost" className='h-full' {...listeners}>
        <ArrowsUpDownIcon className="w-5" />
      </Button>
      <div className='flex flex-col flex-grow gap-4'>
        <div className='flex items-end gap-4'>
          <Select
            label="Type"
            className='flex-grow'
            disabled={disabled}
            required
            error={typeFieldState.invalid}
            value={typeField.value}
            onChange={type => {
              typeField.onChange(type as LineTypeEnum)
              if (type === LineTypeEnum.TEXT) {
                priceField.onChange(0)
                quantityField.onChange(0)
              }
            }}
            ref={typeField.ref}
            options={typeOptions}
            name={typeField.name}
            id={`${typeField.name}-select`}
          />
          {!disabled ? (
            <Button variant="error" outline onClick={deleteLine}>
              <TrashIcon className="w-5" />
            </Button>
          ) : null}
        </div>
        <div className='grid md:grid-cols-12 gap-4'>
          <div className='md:col-span-6 flex flex-col gap-2'>
            <Input
              label="Nom"
              required
              placeholder={t('quotes.form.lines.fields.name.placeholder')}
              className="md:col-span-6"
              disabled={disabled}
              value={nameField.value}
              onChange={nameField.onChange}
              onBlur={nameField.onBlur}
              name={nameField.name}
              error={nameFieldState.invalid}
              ref={nameField.ref}
            />
            <TextArea
              placeholder={t('quotes.form.lines.fields.description.placeholder')}
              className="md:col-span-6"
              rows={1}
              disabled={disabled}
              value={descriptionField.value}
              onChange={descriptionField.onChange}
              onBlur={descriptionField.onBlur}
              name={descriptionField.name}
              ref={descriptionField.ref}
            />
          </div>
          <Input
            label="Quantité"
            disabled={disabled || typeField.value === LineTypeEnum.TEXT}
            className="md:col-span-1"
            placeholder={t('quotes.form.lines.fields.quantity.placeholder')}
            type="number"
            step={0.01}
            name={quantityField.name}
            value={quantityField.value}
            onChange={quantityField.onChange}
            onBlur={event => {
              quantityField.onChange(Number((event.target as HTMLInputElement).value) || 0)
              quantityField.onBlur()
            }}
            ref={quantityField.ref}
          />
          <Input
            label="Prix HT"
            className="md:col-span-2"
            disabled={disabled || typeField.value === LineTypeEnum.TEXT}
            placeholder={t('quotes.form.lines.fields.etPrice.placeholder')}
            type="number"
            step={0.01}
            value={priceField.value}
            onChange={priceField.onChange}
            onBlur={event => {
              priceField.onChange(Number((event.target as HTMLInputElement).value) || 0)
              priceField.onBlur()
            }}
            ref={priceField.ref}
          />
          <Input
            label="Prix TTC"
            readOnly
            value={formatPrice(priceTTC)}
          />
          <Input
            className='md:col-span-2'
            label="Sous total TTC"
            readOnly
            value={formatPrice(totalTTC)}
          />
        </div>
      </div>
    </div>
  )
}

export default QuoteLineTableLine
