import { useController, useFormContext } from 'react-hook-form'
import { ProductFormValues } from './types'
import { Input, Select, TextArea } from '@coco-ui/core'
import { ComponentProps, useMemo } from 'react'
import { LINE_TYPE } from '@/constants/line'
import { useI18n } from '@/i18n'
import { ProductTypeLabel } from '@/components/labels/ProductTypeLabel'
import { calculatePriceETFromIT, calculatePriceTTC } from '@/utils/price'
import Supplier from '@/models/Supplier'
import { LineTypeEnum } from '@/models/LineTypeEnum'

type ProductFormContentProps = {
  suppliers: Supplier[]
}

export const ProductFormContent = ({ suppliers }: ProductFormContentProps) => {
  const { scopedT } = useI18n()
  const pageT = scopedT('products.components.formContent')
  const { control } = useFormContext<ProductFormValues>()

  const { field: nameField, fieldState: nameFieldState } = useController({
    control,
    name: 'name',
    rules: { required: true, minLength: 3 },
  })
  const { field: typeField, fieldState: typeFieldState } = useController({
    control,
    name: 'type',
    rules: { required: true },
  })
  const { field: descriptionField, fieldState: descriptionFieldState } = useController({
    control,
    name: 'description',
  })
  const { field: priceField, fieldState: priceFieldState } = useController({
    control,
    name: 'price',
    rules: { required: true },
    shouldUnregister: true,
  })
  const { field: itPriceField, fieldState: itPriceFieldState } = useController({
    control,
    name: 'itPrice',
    rules: { required: true },
    shouldUnregister: true,
  })
  const { field: supplierIdField, fieldState: supplierIdFieldState } = useController({
    control,
    name: 'supplierId',
  })

  const typeOptions: ComponentProps<typeof Select>['options'] = useMemo(
    () =>
      Object.values(LINE_TYPE).map(type => ({
        value: type.enum,
        label: <ProductTypeLabel type={type.enum} />,
      })),
    [],
  )

  const supplierOptions: ComponentProps<typeof Select>['options'] = useMemo(
    () =>
      suppliers.map(({ id, name }) => ({
        value: id,
        label: name,
      })) ?? [],
    [suppliers],
  )

  const selectedSupplier = supplierIdField.value
    ? suppliers.find(({ id }) => id === supplierIdField.value)
    : undefined

  return (
    <div className="flex flex-col gap-5">
      <Select
        options={supplierOptions}
        name={supplierIdField.name}
        onChange={supplierIdField.onChange}
        ref={supplierIdField.ref}
        label={pageT('fields.supplierId.label')}
        error={supplierIdFieldState.invalid}
        value={supplierIdField.value ?? ''}
        isSearchable
      />
      <Select
        options={typeOptions}
        name={typeField.name}
        onChange={typeField.onChange}
        ref={typeField.ref}
        label={pageT('fields.type.label')}
        error={typeFieldState.invalid}
        value={typeField.value}
      />
      <div className="flex flex-col gap-2">
        <Input
          name={nameField.name}
          onChange={nameField.onChange}
          onBlur={nameField.onBlur}
          ref={nameField.ref}
          required
          minLength={3}
          label={pageT('fields.name.label')}
          error={nameFieldState.invalid}
          autoComplete="off"
          value={nameField.value}
        />
        <TextArea
          name={descriptionField.name}
          onChange={descriptionField.onChange}
          onBlur={descriptionField.onBlur}
          ref={descriptionField.ref}
          placeholder={pageT('fields.description.placeholder')}
          error={descriptionFieldState.invalid}
          value={descriptionField.value ?? ''}
          rows={1}
        />
      </div>
      {typeField.value !== LineTypeEnum.TEXT ? (
        <div className="grid md:grid-cols-2 gap-5">
          <Input
            name={priceField.name}
            onChange={priceField.onChange}
            onBlur={event => {
              const newPrice = Number(event.target.value) || 0
              priceField.onChange(newPrice)
              itPriceField.onChange(calculatePriceTTC(newPrice, selectedSupplier?.vat ?? 0))
              priceField.onBlur()
            }}
            ref={priceField.ref}
            label={pageT('fields.price.label')}
            error={priceFieldState.invalid}
            autoComplete="off"
            value={priceField.value ?? ''}
            type="number"
            suffix="€"
            step={0.01}
            required
          />
          <Input
            name={itPriceField.name}
            onChange={itPriceField.onChange}
            onBlur={event => {
              const newPrice = Number(event.target.value) || 0
              const newEtPrice = calculatePriceETFromIT(newPrice, selectedSupplier?.vat ?? 0)
              itPriceField.onChange(newPrice)
              priceField.onChange(newEtPrice)
              itPriceField.onBlur()
            }}
            ref={itPriceField.ref}
            label={pageT('fields.itPrice.label')}
            error={itPriceFieldState.invalid}
            autoComplete="off"
            value={itPriceField.value ?? ''}
            type="number"
            step={0.01}
            suffix="€"
            required
          />
        </div>
      ) : null}
    </div>
  )
}
