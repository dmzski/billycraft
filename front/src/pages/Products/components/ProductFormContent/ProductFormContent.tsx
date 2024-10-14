import { useController, useFormContext, useWatch } from 'react-hook-form'
import { ProductFormValues } from './types'
import { Button, Input, Modal, TextArea, useToast } from '@coco-ui/core'
import { ComponentProps, useMemo } from 'react'
import { LINE_TYPE } from '@/constants/line'
import { useI18n } from '@/i18n'
import { ProductTypeLabel } from '@/components/labels/ProductTypeLabel'
import { calculatePriceETFromIT, calculatePriceTTC } from '@/utils/price'
import Supplier from '@/models/Supplier'
import { LineTypeEnum } from '@/models/LineTypeEnum'
import { QrCodeIcon } from '@heroicons/react/24/solid'
import { sendErrorToSentry } from '@/utils/errors'
import { Scanner } from '@yudiel/react-qr-scanner'
import { SCANNER_COMPONENTS, SCANNER_FORMATS } from '../../constants'
import { InputField } from '@/components/form/InputField'
import { SelectField } from '@/components/form/SelectField'
import { useAllProductGroupsQuery } from '@/queries/useAllProductGroupsQuery'

type ProductFormContentProps = {
  suppliers: Supplier[]
}

export const ProductFormContent = ({ suppliers }: ProductFormContentProps) => {
  const toast = useToast()
  const { scopedT } = useI18n()
  const pageT = scopedT('products.components.formContent')
  const { control } = useFormContext<ProductFormValues>()
  const { data: productGroups } = useAllProductGroupsQuery()

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
  const { field: stockField, fieldState: stockFieldState } = useController({
    control,
    name: 'stock',
    shouldUnregister: true,
  })
  const { field: codeField, fieldState: codeFieldState } = useController({
    control,
    name: 'code',
    rules: {
      minLength: 3,
    },
    shouldUnregister: true,
  })

  const [supplierId, selectedType] = useWatch({
    control,
    name: ['supplierId', 'type'],
  })

  const typeOptions: ComponentProps<typeof SelectField>['options'] = useMemo(
    () =>
      Object.values(LINE_TYPE).map(type => ({
        value: type.enum,
        label: <ProductTypeLabel type={type.enum} />,
      })),
    [],
  )

  const supplierOptions: ComponentProps<typeof SelectField>['options'] = useMemo(
    () =>
      suppliers.map(({ id, name }) => ({
        value: id,
        label: name,
      })) ?? [],
    [suppliers],
  )

  const productGroupOptions = useMemo(
    (): ComponentProps<typeof SelectField>['options'] =>
      productGroups?.map(({ id, name }) => ({
        value: id,
        label: name,
      })) ?? [],
    [productGroups],
  )

  const selectedSupplier = supplierId ? suppliers.find(({ id }) => id === supplierId) : undefined

  return (
    <div className="flex flex-col gap-4">
      <SelectField
        options={supplierOptions}
        control={control}
        name="supplierId"
        label={pageT('fields.supplierId.label')}
        isSearchable
      />
      <SelectField
        options={productGroupOptions}
        control={control}
        name="groupId"
        label={pageT('fields.groupId.label')}
        isSearchable
      />
      <SelectField
        control={control}
        options={typeOptions}
        name="type"
        label={pageT('fields.type.label')}
      />
      {selectedType === 'ARTICLE' ? (
        <div className="flex flex-col gap-4">
          <Input
            name={stockField.name}
            onChange={stockField.onChange}
            onBlur={event => {
              const newStock = Number(event.target.value) || 0
              stockField.onChange(newStock)
            }}
            ref={stockField.ref}
            label={pageT('fields.stock.label')}
            error={stockFieldState.invalid}
            autoComplete="off"
            value={stockField.value ?? ''}
            type="number"
            step={0.01}
          />
          <div className="flex flex-row gap-2 items-end">
            <Input
              className="flex-grow"
              name={codeField.name}
              onChange={codeField.onChange}
              onBlur={codeField.onBlur}
              ref={codeField.ref}
              label={pageT('fields.code.label')}
              error={codeFieldState.invalid}
              autoComplete="off"
              value={codeField.value ?? ''}
            />
            <Modal
              disclosure={
                <Button type="button" variant="ghost" square>
                  <QrCodeIcon className="w-5" />
                </Button>
              }
              hideOnClickOutside
            >
              {({ close }) => (
                <div className="pt-8">
                  <Scanner
                    onScan={result => {
                      if (result[0]) {
                        codeField.onChange(result[0].rawValue)
                      } else {
                        toast.error(pageT('fields.code.errors.scan'))
                      }
                      close()
                    }}
                    classNames={{
                      container: 'scanner',
                    }}
                    formats={SCANNER_FORMATS}
                    components={SCANNER_COMPONENTS}
                    scanDelay={500}
                    allowMultiple
                    onError={err => {
                      sendErrorToSentry(err)
                    }}
                  />
                </div>
              )}
            </Modal>
          </div>
        </div>
      ) : null}
      <div className="flex flex-col gap-2">
        <InputField
          control={control}
          name="name"
          required
          minLength={3}
          label={pageT('fields.name.label')}
          autoComplete="off"
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
      {selectedType !== LineTypeEnum.TEXT ? (
        <div className="grid md:grid-cols-2 gap-4">
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
