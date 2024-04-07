import { Button, Input, Select } from '@coco-ui/core'
import { OutgoingRequest } from '@/models/Outgoing'
import { useMemo } from 'react'
import { Control, useController, useWatch } from 'react-hook-form'
import SelectBillModal from './modals/SelectBillModal'
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useAllSuppliersQuery } from '@/queries/useAllSuppliersQuery'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'

const DEFAULT_LINE_COLOR = 'initial'

type RowProps = {
  control: Control<OutgoingRequest>
  index: number
  onDelete: () => void
  disabled?: boolean
}
const Row = ({ control, index, onDelete, disabled }: RowProps) => {
  const formatCurrency = useFormatCurrency()

  const vatController = useController({
    name: `lines.${index}.vat`,
    control,
    defaultValue: 0,
    rules: {
      min: 0,
      max: 100,
      required: true,
    },
  })

  const { data: suppliers } = useAllSuppliersQuery()

  const [totalHT, supplierId, vat] = useWatch({
    name: [`lines.${index}.totalHT`, `lines.${index}.supplierId`, `lines.${index}.vat`],
    control,
  })

  const totalTTC = useMemo(
    () =>
      !Number.isNaN(totalHT) && !Number.isNaN(vat)
        ? formatCurrency(Number(totalHT * (1 + vat / 100)) || 0)
        : '',
    [formatCurrency, totalHT, vat],
  )

  const supplierOptions = useMemo(
    () => (suppliers ? suppliers.map(({ id, name }) => ({ value: id, label: name })) : []),
    [suppliers],
  )

  const lineColor = useMemo(
    () =>
      supplierId && suppliers
        ? suppliers.find(({ id }) => id === supplierId)?.color ?? DEFAULT_LINE_COLOR
        : DEFAULT_LINE_COLOR,
    [supplierId, suppliers],
  )

  const { field: supplierIdField, fieldState: supplierIdFieldState } = useController({ control, name: `lines.${index}.supplierId`, rules: { required: true } })
  const { field: supplierBillReferenceField, fieldState: supplierBillReferenceFieldState } = useController({ control, name: `lines.${index}.supplierBillReference` })
  const { field: billIdField, fieldState: billIdFieldState } = useController({ control, name: `lines.${index}.billId` })
  const { field: etTotalField, fieldState: etTotalFieldState } = useController({ control, name: `lines.${index}.totalHT` })

  return (
    <div
      style={{ backgroundColor: lineColor }}
      className="px-4 py-2 grid md:grid-cols-12 items-center gap-4"
    >
      <div className="md:col-span-2">
        <Select
          required
          className="w-full"
          name={supplierIdField.name}
          value={supplierIdField.value}
          onChange={value => {
            supplierIdField.onChange(value)
            const vatFound = suppliers?.find(({ id }) => id === value)?.vat
            vatController.field.onChange(vatFound ?? 0)
          }}
          options={supplierOptions}
          ref={supplierIdField.ref}
          error={supplierIdFieldState.invalid}
          disabled={disabled}
        />
      </div>
      <div className="md:col-span-2">
        <Input
          name={supplierBillReferenceField.name}
          value={supplierBillReferenceField.value}
          onChange={supplierBillReferenceField.onChange}
          ref={supplierBillReferenceField.ref}
          error={supplierBillReferenceFieldState.invalid}
          disabled={disabled}
        />
      </div>
      <div className="md:col-span-2 relative">
        <SelectBillModal
          onSubmit={billIdField.onChange}
          disclosure={
            <Input
              name={billIdField.name}
              value={billIdField.value}
              readOnly
              ref={billIdField.ref}
              error={billIdFieldState.invalid}
              disabled={disabled}
            />
          }
        />
        {billIdField.value ? (
          <XMarkIcon
            className="absolute right-2 top-2 cursor-pointer"
            role="button"
            onClick={() => billIdField.onChange('')}
          />
        ) : null}
      </div>
      <div className="md:col-span-2">
        <Input
          required
          name={etTotalField.name}
          onBlur={event => {
            etTotalField.onChange(Number(event.target.value))
            etTotalField.onBlur()
          }}
          type="number"
          onChange={etTotalField.onChange}
          value={etTotalField.value}
          step={0.01}
          ref={etTotalField.ref}
          error={etTotalFieldState.invalid}
          disabled={disabled}
        />
      </div>
      <div className="md:col-span-2">
        <Input
          type="number"
          step={1}
          min={0}
          max={100}
          name={vatController.field.name}
          onChange={vatController.field.onChange}
          value={vatController.field.value}
          onBlur={event => {
            vatController.field.onChange(Number(event.target.value))
            vatController.field.onBlur()
          }}
          ref={vatController.field.ref}
          error={vatController.fieldState.invalid}
          disabled={disabled}
        />
      </div>
      <div className="md:col-span-2 gap-2 flex items-center">
        <p className="flex-grow">{totalTTC}</p>
        <Button variant="error" onClick={onDelete} type="button">
          <TrashIcon className="w-5" />
        </Button>
      </div>
    </div>
  )
}

export default Row
