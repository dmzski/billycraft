import { UserApi } from '@/api/UserApi'
import { FormErrorAlert } from '@/components/FormErrorAlert'
import { useI18n } from '@/i18n'
import { sendErrorToSentry } from '@/utils/errors'
import { Alert, Button, Input, Modal, useToast } from '@coco-ui/core'
import { ComponentProps } from 'react'
import { FormProvider, useController, useForm } from 'react-hook-form'

type RemoveUserModalProps = {
  disclosure: ComponentProps<typeof Modal>['disclosure']
  onSubmitSuccess: () => Promise<void>
  email: string
}

type RemoveUserFormProps = Omit<RemoveUserModalProps, 'disclosure'>

const RemoveUserForm = ({ email, onSubmitSuccess }: RemoveUserFormProps) => {
  const { scopedT, t } = useI18n()
  const toast = useToast()
  const confirmationString = t('forms.confirmation.delete.pattern')

  const pageT = scopedT('settings.users.users.modals.remove')
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      confirm: '',
    },
  })

  const { field: nameField, fieldState: nameFieldState } = useController({
    control: methods.control,
    name: 'confirm',
    rules: { required: true, pattern: new RegExp(confirmationString, 'i') },
  })

  const onSubmit = async () => {
    try {
      await UserApi.removeUser({ email })
      toast.show(pageT('submit.success'))
      await onSubmitSuccess()
    } catch (err) {
      sendErrorToSentry(err)
      methods.setError('root', { message: t('genericFormError') })
    }
  }

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-10" onSubmit={methods.handleSubmit(onSubmit)}>
        <h2 className="text-3xl">{pageT('title')}</h2>
        <Alert variant="destructive">{pageT('warning')}</Alert>
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
        <FormErrorAlert />
        <Button
          variant="destructive"
          type="submit"
          disabled={!methods.formState.isValid || methods.formState.isSubmitting}
        >
          {pageT('submit')}
        </Button>
      </form>
    </FormProvider>
  )
}

export const RemoveUserModal = ({ email, onSubmitSuccess, disclosure }: RemoveUserModalProps) => (
  <Modal disclosure={disclosure}>
    {({ close }) => (
      <RemoveUserForm
        onSubmitSuccess={async () => {
          await onSubmitSuccess()
          close()
        }}
        email={email}
      />
    )}
  </Modal>
)
