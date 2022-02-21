import { Button, Icon, Input, Select } from '@coco-ui/core'
import { SupplierApi } from 'api/SupplierApi'
import { OutgoingRequest } from 'models/Outgoing'
import { useMemo, useState } from 'react'
import { Control, Controller, useController, useWatch } from 'react-hook-form'
import { useQuery } from 'react-query'
import SelectBillModal from './modals/SelectBillModal'

const DEFAULT_LINE_COLOR = 'initial'

type RowProps = {
  control: Control<OutgoingRequest>
  index: number
  onDelete: () => void
  disabled?: boolean
}
const Row = ({ control, index, onDelete, disabled }: RowProps): JSX.Element => {
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

  const { data: suppliers, isLoading: isLoadingSuppliers } = useQuery(
    ['suppliers'],
    SupplierApi.findAll,
    {
      refetchOnWindowFocus: false,
      staleTime: 6000,
    },
  )
  const totalHT = useWatch({
    name: `lines.${index}.totalHT`,
    control,
    defaultValue: 0,
  })

  const supplierId = useWatch({
    name: `lines.${index}.supplierId`,
    control,
  })

  const vat = useWatch({
    name: `lines.${index}.vat`,
    control,
    defaultValue: 0,
  })

  const totalTTC = useMemo(
    () =>
      !Number.isNaN(totalHT) && !Number.isNaN(vat)
        ? new Intl.NumberFormat(undefined, {
            currency: 'EUR',
            style: 'currency',
          }).format(Number(totalHT * (1 + vat / 100)) || 0)
        : '',
    [totalHT, vat],
  )

  const supplierOptions = useMemo(() => {
    if (suppliers) return suppliers.map(({ id, name }) => ({ value: id, label: name }))

    return []
  }, [suppliers])

  const lineColor = useMemo(() => {
    if (supplierId && suppliers) {
      return suppliers.find(({ id }) => id === supplierId)?.color ?? DEFAULT_LINE_COLOR
    }

    return DEFAULT_LINE_COLOR
  }, [supplierId, suppliers])

  return (
    <div
      style={{ backgroundColor: lineColor }}
      className="p-2 grid grid-cols-1 sm:grid-cols-12 items-center gap-4 border-b"
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
              isLoading={isLoadingSuppliers}
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
          defaultValue=""
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
                <Icon
                  name="x"
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
          <Icon name="trash" />
        </Button>
      </div>
    </div>
  )
}

export default Row
