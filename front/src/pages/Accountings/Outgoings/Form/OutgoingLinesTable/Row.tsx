import { Button, Input, Select } from '@coco-ui/core'
import { OutgoingRequest } from '@/models/Outgoing'
import { useMemo, useState } from 'react'
import { Control, Controller, useController, useWatch } from 'react-hook-form'
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
  const [billModalOpen, setBillModalOpen] = useState(false)

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

  return (
    <div
      style={{ backgroundColor: lineColor }}
      className="px-4 py-2 grid grid-cols-1 sm:grid-cols-12 items-center gap-4 border-b"
    >
      <div className="col-span-2">
        <Controller
          control={control}
          name={`lines.${index}.supplierId`}
          rules={{
            required: true,
          }}
          render={({ field, fieldState: { invalid } }) => (
            <Select
              required
              className="w-full"
              name={field.name}
              value={field.value}
              onChange={value => {
                field.onChange(value)
                const vatFound = suppliers?.find(({ id }) => id === value)?.vat
                vatController.field.onChange(vatFound ?? 0)
              }}
              options={supplierOptions}
              ref={field.ref}
              error={invalid}
              disabled={disabled}
            />
          )}
        />
      </div>
      <div className="col-span-2">
        <Controller
          control={control}
          name={`lines.${index}.supplierBillReference`}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              className="w-full"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              ref={field.ref}
              error={invalid}
              disabled={disabled}
            />
          )}
        />
      </div>
      <div className="col-span-2 relative">
        <Controller
          control={control}
          name={`lines.${index}.billId`}
          render={({ field, fieldState: { invalid } }) => (
            <>
              <Input
                className="w-full"
                name={field.name}
                value={field.value}
                readOnly
                onClick={() => setBillModalOpen(true)}
                ref={field.ref}
                error={invalid}
                disabled={disabled}
              />
              {field.value ? (
                <XMarkIcon
                  className="absolute right-2 top-2 cursor-pointer"
                  role="button"
                  onClick={() => field.onChange('')}
                />
              ) : null}
              <SelectBillModal
                isOpen={billModalOpen}
                onClose={() => setBillModalOpen(false)}
                onSubmit={field.onChange}
              />
            </>
          )}
        />
      </div>
      <div className="col-span-2">
        <Controller
          control={control}
          name={`lines.${index}.totalHT`}
          rules={{ required: true }}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              required
              className="w-full"
              name={field.name}
              onBlur={event => {
                field.onChange(Number(event.target.value))
                field.onBlur()
              }}
              type="number"
              onChange={field.onChange}
              value={field.value}
              step={0.01}
              ref={field.ref}
              error={invalid}
              disabled={disabled}
            />
          )}
        />
      </div>
      <div className="col-span-2">
        <Input
          className="w-full"
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
      <div className="col-span-2 flex justify-between">
        <Input className="w-full mr-2" readOnly value={totalTTC} />
        <Button variant="error" onClick={onDelete} type="button">
          <TrashIcon className="w-5" />
        </Button>
      </div>
    </div>
  )
}

export default Row
