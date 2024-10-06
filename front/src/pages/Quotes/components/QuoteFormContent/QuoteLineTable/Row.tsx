import { Button, Input, Select, TextArea } from '@coco-ui/core'
import { LineTypeEnum } from '@/models/LineTypeEnum'
import { ComponentProps, useMemo } from 'react'
import { Control, useController, useWatch } from 'react-hook-form'
import { LINE_TYPE } from '@/constants/line'
import {
  ArrowsUpDownIcon,
  CloudArrowDownIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/solid'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useI18n } from '@/i18n'
import { QuoteFormValues } from '../types'
import clsx from 'clsx'
import { calculatePriceETFromIT, calculatePriceTTC } from '@/utils/price'
import { AddProductModal } from '@/pages/Products/modals/AddProductModal'

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

  const typeOptions: ComponentProps<typeof Select>['options'] = Object.values(LINE_TYPE).map(
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

  const { field: productIdField } = useController({
    control,
    name: `lines.${index}.productId`,
  })
  const { field: typeField, fieldState: typeFieldState } = useController({
    control,
    name: `lines.${index}.type`,
    rules: {
      required: true,
      onChange: () => {
        if (productIdField.value) {
          productIdField.onChange(null)
        }
      },
    },
  })
  const { field: nameField, fieldState: nameFieldState } = useController({
    control,
    name: `lines.${index}.name`,
    rules: {
      required: true,

      onChange: () => {
        if (productIdField.value) {
          productIdField.onChange(null)
        }
      },
    },
    defaultValue: '',
  })
  const { field: descriptionField } = useController({
    control,
    name: `lines.${index}.description`,
    defaultValue: undefined,
    rules: {
      onChange: () => {
        if (productIdField.value) {
          productIdField.onChange(null)
        }
      },
    },
  })
  const { field: quantityField, fieldState: quantityFieldState } = useController({
    control,
    name: `lines.${index}.quantity`,
    rules: {
      onChange: () => {
        if (productIdField.value) {
          productIdField.onChange(null)
        }
      },
    },
  })
  const { field: priceField, fieldState: priceFieldState } = useController({
    control,
    name: `lines.${index}.price`,
    rules: {
      onChange: () => {
        if (productIdField.value) {
          productIdField.onChange(null)
        }
      },
    },
  })
  const { field: itPriceField, fieldState: itPriceFieldState } = useController({
    control,
    name: `lines.${index}.itPrice`,
    defaultValue: calculatePriceTTC(priceField.value, tva),
    rules: {
      onChange: () => {
        if (productIdField.value) {
          productIdField.onChange(null)
        }
      },
    },
  })

  return (
    <div className="flex items-center gap-2 py-2 bg-base-100" ref={setNodeRef} style={style}>
      <Button variant="ghost" className="h-full" {...listeners}>
        <ArrowsUpDownIcon className="w-5" />
      </Button>
      <div className="flex flex-col flex-grow gap-4">
        <div className="grid md:grid-cols-[repeat(10,minmax(0,1fr))_minmax(0,auto)] gap-4">
          <div
            className={clsx(
              'md:col-span-6 flex flex-col',
              descriptionField.value !== undefined ? 'gap-2' : '',
            )}
          >
            <Input
              label={t('quotes.form.lines.fields.name.label')}
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
              suffix={
                !productIdField.value && nameField.value ? (
                  <AddProductModal
                    initialValues={{
                      type: typeField.value,
                      name: nameField.value,
                      price: priceField.value,
                      itPrice: itPriceField.value,
                      supplierId: null,
                      description: descriptionField.value,
                      code: null,
                      stock: null,
                    }}
                    disclosure={
                      <button type="button" className="btn btn-ghost">
                        <CloudArrowDownIcon className="w-5" />
                      </button>
                    }
                    onSubmitSuccess={newId => {
                      productIdField.onChange(newId)
                    }}
                  />
                ) : undefined
              }
              prefix={
                <Select
                  aria-label={t('quotes.form.lines.fields.type.label')}
                  disabled={disabled}
                  required
                  variant="ghost"
                  error={typeFieldState.invalid}
                  value={typeField.value}
                  onChange={type => {
                    typeField.onChange(type as LineTypeEnum)
                    if (type === LineTypeEnum.TEXT) {
                      priceField.onChange(0)
                      itPriceField.onChange(0)
                      quantityField.onChange(0)
                    }
                  }}
                  ref={typeField.ref}
                  options={typeOptions}
                  name={typeField.name}
                />
              }
            />
            {descriptionField.value !== null ? (
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
            ) : (
              <div className="flex">
                <button
                  className="inline-flex gap-1 items-center link-hover link-primary text-xs"
                  type="button"
                  onClick={() => {
                    descriptionField.onChange('')
                  }}
                >
                  <PlusIcon className="w-4" />
                  {t('quotes.form.lines.addDescription')}
                </button>
              </div>
            )}
          </div>
          {typeField.value !== LineTypeEnum.TEXT ? (
            <>
              <Input
                label={t('quotes.form.lines.fields.quantity.label')}
                disabled={disabled}
                placeholder={t('quotes.form.lines.fields.quantity.placeholder')}
                type="number"
                step={0.01}
                required
                name={quantityField.name}
                value={quantityField.value ?? ''}
                onChange={quantityField.onChange}
                onBlur={event => {
                  quantityField.onChange(Number((event.target as HTMLInputElement).value) || 0)
                  quantityField.onBlur()
                }}
                ref={quantityField.ref}
                error={quantityFieldState.invalid}
              />
              <Input
                label={t('quotes.form.lines.fields.etPrice.label')}
                disabled={disabled}
                required
                placeholder={t('quotes.form.lines.fields.etPrice.placeholder')}
                type="number"
                step={0.01}
                value={priceField.value ?? ''}
                onChange={priceField.onChange}
                onBlur={event => {
                  const newPrice = Number(event.target.value) || 0
                  priceField.onChange(newPrice)
                  itPriceField.onChange(calculatePriceTTC(newPrice, tva))
                  priceField.onBlur()
                }}
                ref={priceField.ref}
                suffix={<span className="px-1">€</span>}
                error={priceFieldState.invalid}
              />
              <Input
                label={t('quotes.form.lines.fields.totalItPrice.label')}
                value={itPriceField.value}
                ref={itPriceField.ref}
                name={itPriceField.name}
                onBlur={event => {
                  const newPrice = Number(event.target.value) || 0
                  const newEtPrice = calculatePriceETFromIT(newPrice, tva)
                  itPriceField.onChange(newPrice)
                  priceField.onChange(newEtPrice)
                  itPriceField.onBlur()
                }}
                onChange={itPriceField.onChange}
                error={itPriceFieldState.invalid}
                disabled={itPriceField.disabled}
                suffix={<span className="px-1">€</span>}
              />
              <Input
                label={t('quotes.form.lines.fields.subTotal.label')}
                readOnly
                value={totalTTC}
                suffix={<span className="px-1">€</span>}
              />
            </>
          ) : (
            <div className="md:col-span-4" />
          )}
          {!disabled ? (
            <div className="pt-7 flex justify-end">
              <Button variant="error" outline onClick={deleteLine}>
                <TrashIcon className="w-5" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default QuoteLineTableLine
