import { Button, Input, Modal, Select } from '@coco-ui/core'
import useCustomers from '@/hooks/useCustomers'
import { ComponentProps, useMemo } from 'react'
import { useController, useForm } from 'react-hook-form'
import { useI18n } from '@/i18n'
import { useAllBillsQuery } from '@/queries/useAllBillsQuery'

type SelectBillModalProps = {
  onSubmit: (billId: string) => void | Promise<void>
  disclosure: ComponentProps<typeof Modal>['disclosure']
}

type SelectBillFormProps = Omit<SelectBillModalProps, "disclosure"> & { close: () => void }

type SelectBillModalFormValues = {
  customerId?: string
  title?: string
  billId?: string
}
const SelectBillForm = ({ onSubmit, close }: SelectBillFormProps) => {
  const { t } = useI18n()
  const { data: bills } = useAllBillsQuery()
  const customers = useCustomers()

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting, isValid },
  } = useForm<SelectBillModalFormValues>({
    mode: 'onChange',
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
              customerController.field.value === customerId
            )

          if (titleController.field.value)
            return title.toUpperCase().includes(titleController.field.value.toUpperCase())

          if (customerController.field.value)
            return customerController.field.value === customerId

          if (!titleController.field.value && !customerController.field.value) return true

          return false
        })
        ?.map(({ id, title, name }) => ({ value: id, label: `${name} - ${title}` })) ?? [],
    [titleController.field.value, customerController.field.value, bills],
  )

  const onFormSubmit = ({ billId }: SelectBillModalFormValues) => {
    if (billId) {
      onSubmit?.(billId)
      close()
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl">
        {t('accounting.outgoings.modals.selectBill.title')}
      </h2>
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
        <Select
          options={customerOptions}
          value={customerController.field.value}
          name={customerController.field.name}
          onChange={customerController.field.onChange}
          ref={customerController.field.ref}
          label={t('customer')}
          isSearchable
        />
        <Input
          value={titleController.field.value}
          name={titleController.field.name}
          onChange={titleController.field.onChange}
          ref={titleController.field.ref}
          label={t('title')}
        />
        <Select
          options={billOptions}
          value={billIdController.field.value}
          name={billIdController.field.name}
          onChange={billIdController.field.onChange}
          ref={billIdController.field.ref}
          label={t('bill')}
          isSearchable
        />
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
        >
          {t('select')}
        </Button>
      </form>
    </div>
  )
}

const SelectBillModal = ({ onSubmit, disclosure }: SelectBillModalProps) => (
  <Modal disclosure={disclosure}>
    {({ close }) => (
      <SelectBillForm close={close} onSubmit={onSubmit} />
    )}
  </Modal>
)

export default SelectBillModal
