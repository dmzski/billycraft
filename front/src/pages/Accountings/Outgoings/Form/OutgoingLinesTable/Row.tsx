import { Button, Icon, Input, Select } from '@coco-ui/core'
import { BillApi } from 'api/BillApi'
import { SupplierApi } from 'api/SupplierApi'
import { OutgoingRequest } from 'models/Outgoing'
import { useMemo } from 'react'
import { Control, Controller, useWatch } from 'react-hook-form'
import { useQuery } from 'react-query'

const DEFAULT_LINE_COLOR = 'initial'

type RowProps = {
  control: Control<OutgoingRequest>
  index: number
  onDelete: () => void
  disabled?: boolean
}
const Row = ({ control, index, onDelete, disabled }: RowProps): JSX.Element => {
  const { data: bills, isLoading: isLoadingBills } = useQuery(['bills'], BillApi.findAll, {
    refetchOnWindowFocus: false,
    staleTime: 6000,
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
          }).format(totalHT * (1 - vat))
        : '',
    [totalHT, vat],
  )

  const billOptions = useMemo(() => {
    if (bills) return bills.map(({ id, title }) => ({ value: id, label: title }))

    return []
  }, [bills])

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
              onChange={field.onChange}
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
      <div className="col-span-2">
        <Controller
          control={control}
          name={`lines.${index}.billId`}
          render={({ field, fieldState: { invalid } }) => (
            <Select
              className="w-full"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              options={billOptions}
              isLoading={isLoadingBills}
              isSearchable
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
        <Controller
          control={control}
          name={`lines.${index}.vat`}
          rules={{ min: 0, max: 100 }}
          defaultValue={0}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              className="w-full"
              type="number"
              step={1}
              min={0}
              max={100}
              name={field.name}
              onChange={field.onChange}
              value={field.value}
              onBlur={event => {
                field.onChange(Number(event.target.value))
                field.onBlur()
              }}
              ref={field.ref}
              error={invalid}
              disabled={disabled}
            />
          )}
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
