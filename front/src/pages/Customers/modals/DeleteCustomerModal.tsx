import { CustomerApi } from '@/api/CustomerApi'
import { useI18n } from '@/i18n'
import Customer from '@/models/Customer'
import { sendErrorToSentry } from '@/utils/errors'
import { Alert, Button, Input, Modal, useToast } from '@coco-ui/core'
import { ComponentProps } from 'react'
import { useController, useForm } from 'react-hook-form'

type DeleteCustomerModalProps = {
  disclosure: ComponentProps<typeof Modal>['disclosure']
  customer: Customer
  onSubmitSuccess: () => Promise<void>
}

type DeleteCustomerFormProps = Omit<DeleteCustomerModalProps, 'disclosure'> & {
  close: () => void
}

const DeleteCustomerForm = ({ onSubmitSuccess, customer, close }: DeleteCustomerFormProps) => {
  const { scopedT, t } = useI18n()
  const pageT = scopedT('customers.modals.delete')
  const toast = useToast()
  const confirmationString = t('forms.confirmation.delete.pattern')

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      confirm: '',
    },
  })

  const onSubmit = async () => {
    try {
      await CustomerApi.delete(customer.id)
      toast.show(pageT('submit.success'))
      await onSubmitSuccess()
      close()
    } catch (err) {
      sendErrorToSentry(err, { data: customer.id })
      toast.destructive(t('genericFormError'))
    }
  }

  const { field: nameField, fieldState: nameFieldState } = useController({
    control: methods.control,
    name: 'confirm',
    rules: { required: true, pattern: new RegExp(confirmationString, 'i') },
  })

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <h2 className="text-2xl">{pageT('title')}</h2>
      <Alert variant="destructive">{pageT('description')}</Alert>
      <Input
        name={nameField.name}
        onChange={nameField.onChange}
        onBlur={nameField.onBlur}
        value={nameField.value}
        required
        ref={nameField.ref}
        label={t('forms.confirmation.delete.label')}
        autoComplete="off"
        error={nameFieldState.invalid}
      />
      <Button
        variant="destructive"
        type="submit"
        disabled={!methods.formState.isValid || methods.formState.isSubmitting}
      >
        {pageT('submit')}
      </Button>
    </form>
  )
}

export const DeleteCustomerModal = ({
  customer,
  disclosure,
  onSubmitSuccess,
}: DeleteCustomerModalProps) => (
  <Modal disclosure={disclosure}>
    {({ close }) => (
      <DeleteCustomerForm close={close} customer={customer} onSubmitSuccess={onSubmitSuccess} />
    )}
  </Modal>
)
