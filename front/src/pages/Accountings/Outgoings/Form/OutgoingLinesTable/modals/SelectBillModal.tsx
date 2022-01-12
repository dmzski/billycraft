import { Button, Input, Modal, Select } from '@coco-ui/core'
import { BillApi } from 'api/BillApi'
import useCustomers from 'hooks/useCustomers'
import { useCallback, useEffect, useMemo } from 'react'
import { useController, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'

type SelectBillModalProps = {
  isOpen?: boolean
  onSubmit?: (billId: string) => void | Promise<void>
  onClose: () => void
}

type SelectBillModalForm = {
  customerId?: number
  title?: string
  billId?: string
}
const SelectBillModal = ({ onSubmit, isOpen, onClose }: SelectBillModalProps): JSX.Element => {
  const { data: bills, isLoading: isLoadingBills } = useQuery(['bills'], BillApi.findAll, {
    refetchOnWindowFocus: false,
    staleTime: 6000,
    enabled: isOpen,
  })
  const customers = useCustomers()

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm<SelectBillModalForm>({
    mode: 'all',
  })
  const customerController = useController({
    name: 'customerId',
    control,
    defaultValue: undefined,
    rules: {
      onChange: () => {
        setValue('billId', undefined)
      },
      deps: ['billId'],
    },
  })
  const titleController = useController({
    name: 'title',
    defaultValue: '',
    control,
  })
  const billIdController = useController({
    name: 'billId',
    control,
    rules: {
      required: true,
    },
  })

  const customerOptions = useMemo(
    () => customers?.map(({ id, name }) => ({ value: id, label: name })) ?? [],
    [customers],
  )

  const billOptions = useMemo(
    () =>
      bills
        ?.filter(({ title, customerId }) => {
          if (titleController.field.value && customerController.field.value)
            return (
              title.toUpperCase().includes(titleController.field.value.toUpperCase()) &&
              Number(customerController.field.value) === customerId
            )

          if (titleController.field.value)
            return title.toUpperCase().includes(titleController.field.value.toUpperCase())

          if (customerController.field.value)
            return Number(customerController.field.value) === customerId

          if (!titleController.field.value && !customerController.field.value) return true

          return false
        })
        ?.map(({ id, title }) => ({ value: id, label: `${id} - ${title}` })) ?? [],
    [titleController.field.value, customerController.field.value, bills, customers],
  )

  const beforeSubmit = useCallback(
    ({ billId }) => {
      onClose()
      onSubmit?.(billId)
      return false
    },
    [onClose],
  )

  useEffect(() => {
    reset()
  }, [isOpen])

  return (
    <Modal onClose={onClose} open={isOpen}>
      <div className="w-full">
        <h2 className="text-xl border-b mb-4 pb-2">Rechercher une facture</h2>
        <div className="ml-2 mb-2 flex flex-col gap-4">
          <Select
            options={customerOptions}
            value={customerController.field.value}
            name={customerController.field.name}
            onChange={customerController.field.onChange}
            ref={customerController.field.ref}
            label="Client"
            variant="outside"
            isSearchable
          />

          <Input
            value={titleController.field.value}
            name={titleController.field.name}
            onChange={titleController.field.onChange}
            ref={titleController.field.ref}
            label="Titre"
            variant="outside"
          />

          <Select
            options={billOptions}
            value={billIdController.field.value}
            name={billIdController.field.name}
            onChange={billIdController.field.onChange}
            ref={billIdController.field.ref}
            label="Facture"
            variant="outside"
            isLoading={isLoadingBills}
            isSearchable
          />
          <Button
            type="button"
            onClick={handleSubmit(beforeSubmit)}
            disabled={!isValid || isSubmitting}
          >
            Sélectionner
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default SelectBillModal
