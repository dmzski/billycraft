import { InvitationApi } from '@/api/InvitationApi'
import { FormErrorAlert } from '@/components/FormErrorAlert'
import { Submit } from '@/components/form/Submit'
import { ROLES } from '@/constants/roles'
import { useI18n } from '@/i18n'
import { RoleName } from '@/models/dtos/Role'
import { sendErrorToSentry } from '@/utils/errors'
import { Input, Modal, Select, useToast } from '@coco-ui/core'
import { ComponentProps, useMemo } from 'react'
import { FormProvider, useController, useForm } from 'react-hook-form'

type InviteUserModalProps = {
  disclosure: ComponentProps<typeof Modal>['disclosure']
  onSubmitSuccess: () => Promise<void>
}

type InviteUserFormProps = Omit<InviteUserModalProps, 'disclosure'>

type InviteUserFormValues = {
  email: string
  role: RoleName
}

const initValues: InviteUserFormValues = {
  email: '',
  role: 'VIEWER',
}

const InviteUserForm = ({ onSubmitSuccess }: InviteUserFormProps) => {
  const { scopedT, t } = useI18n()
  const toast = useToast()

  const pageT = scopedT('settings.users.invitations.modals.invite')
  const methods = useForm({
    mode: 'onChange',
    defaultValues: initValues,
  })

  const roleOptions: ComponentProps<typeof Select>['options'] = useMemo(
    () =>
      ROLES.filter(aRole => aRole !== 'OWNER').map(aRole => ({
        value: aRole,
        label: t(`roles.${aRole}`),
      })),
    [t],
  )

  const { field: emailField, fieldState: emailFieldState } = useController({
    control: methods.control,
    name: 'email',
    rules: {
      required: true,
    },
  })
  const { field: roleField, fieldState: roleFieldState } = useController({
    control: methods.control,
    name: 'role',
    rules: {
      required: true,
    },
  })

  const onSubmit = async ({ email, role }: InviteUserFormValues) => {
    try {
      await InvitationApi.create({
        role,
        email,
      })
      toast.show(pageT('submit.success'))
      await onSubmitSuccess()
    } catch (err) {
      sendErrorToSentry(err)
      methods.setError('root', { message: t('genericFormError') })
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <h2 className="text-3xl">{pageT('title')}</h2>
        <p>{pageT('description')}</p>
        <Input
          label={pageT('fields.email.label')}
          placeholder={pageT('fields.email.placeholder')}
          value={emailField.value}
          onChange={emailField.onChange}
          onBlur={emailField.onBlur}
          required
          type="email"
          error={emailFieldState.invalid}
        />
        <Select
          options={roleOptions}
          error={roleFieldState.invalid}
          value={roleField.value}
          onChange={roleField.onChange}
          required
          label={pageT('fields.role.label')}
        />
        <FormErrorAlert />
        <Submit>{pageT('submit')}</Submit>
      </form>
    </FormProvider>
  )
}

export const InviteUserModal = ({ disclosure, onSubmitSuccess }: InviteUserModalProps) => (
  <Modal disclosure={disclosure}>
    {({ close }) => (
      <InviteUserForm
        onSubmitSuccess={async () => {
          await onSubmitSuccess()
          close()
        }}
      />
    )}
  </Modal>
)
