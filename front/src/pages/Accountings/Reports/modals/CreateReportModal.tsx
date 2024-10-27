import { Button, Input, Modal, useToast } from '@coco-ui/core'
import { ReportApi } from '@/api/ReportApi'
import { endOfMonth, formatRFC3339 } from 'date-fns'
import { ReportRequest } from '@/models/Report'
import { ComponentProps } from 'react'
import { useController, useForm } from 'react-hook-form'
import { useI18n } from '@/i18n'

type CreateReportModalProps = {
  onSubmitSuccess?: () => void | Promise<void>
  disclosure?: ComponentProps<typeof Modal>['disclosure']
}

type CreateReportFormProps = Omit<CreateReportModalProps, 'disclosure'>

type CreateReportFormValues = {
  startDate: string
  endDate: string
  name: string
}

const CreateReportForm = ({ onSubmitSuccess }: CreateReportFormProps) => {
  const { t } = useI18n()
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<CreateReportFormValues>({
    mode: 'onChange',
  })
  const toast = useToast()

  const onSubmit = async ({ startDate, endDate, name }: CreateReportFormValues) => {
    try {
      const data = {
        name,
        startDate: formatRFC3339(Date.parse(startDate)),
        endDate: formatRFC3339(endOfMonth(Date.parse(endDate))),
      } as ReportRequest
      await ReportApi.create(data)
      toast.show(t('accounting.reports.modals.create.fields.submit.success'))
      await onSubmitSuccess?.()
    } catch {
      toast.destructive(t('genericFormError'))
    }
  }

  const { field: nameField, fieldState: nameFieldState } = useController({
    control,
    name: 'name',
    rules: { required: true, minLength: 3 },
  })
  const { field: startDateField, fieldState: startDateFieldState } = useController({
    control,
    name: 'startDate',
    rules: { required: true },
  })
  const { field: endDateField, fieldState: endDateFieldState } = useController({
    control,
    name: 'endDate',
    rules: { required: true },
  })

  return (
    <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-3xl">{t('accounting.reports.modals.create.title')}</h2>
      <div className="flex flex-col gap-2">
        <Input
          label={t('accounting.reports.modals.create.fields.name')}
          value={nameField.value}
          onChange={nameField.onChange}
          onBlur={nameField.onBlur}
          ref={nameField.ref}
          error={nameFieldState.invalid}
        />
        <Input
          label={t('accounting.reports.modals.create.fields.startDate')}
          value={startDateField.value}
          onChange={startDateField.onChange}
          onBlur={startDateField.onBlur}
          ref={startDateField.ref}
          error={startDateFieldState.invalid}
          type="month"
        />
        <Input
          label={t('accounting.reports.modals.create.fields.endDate')}
          value={endDateField.value}
          onChange={endDateField.onChange}
          onBlur={endDateField.onBlur}
          ref={endDateField.ref}
          error={endDateFieldState.invalid}
          type="month"
        />
      </div>
      <Button type="submit" disabled={!isValid || isSubmitting}>
        {t('accounting.reports.modals.create.fields.submit')}
      </Button>
    </form>
  )
}
const CreateReportModal = ({ onSubmitSuccess, disclosure }: CreateReportModalProps) => (
  <Modal disclosure={disclosure}>
    {({ close }) => (
      <CreateReportForm
        onSubmitSuccess={async () => {
          await onSubmitSuccess?.()
          close()
        }}
      />
    )}
  </Modal>
)

export default CreateReportModal
