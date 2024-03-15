import { Button, Input, Modal, useToast } from '@coco-ui/core'
import { ReportApi } from '@/api/ReportApi'
import { endOfMonth, formatRFC3339 } from 'date-fns'
import { ReportRequest } from '@/models/Report'
import { ComponentProps } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useI18n } from '@/i18n'

type CreateReportModalProps = {
  onSubmitSuccess?: () => void | Promise<void>
  disclosure?: ComponentProps<typeof Modal>['disclosure']
}

type CreateReportFormProps = Omit<CreateReportModalProps, "disclosure">

const CreateReportForm = ({ onSubmitSuccess }: CreateReportFormProps) => {
  const { t } = useI18n()
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: 'onChange',
  })
  const toast = useToast()

  const onSubmit = async ({ startDate, endDate, name }) => {
    try {
      const data = {
        name,
        startDate: formatRFC3339(Date.parse(startDate)),
        endDate: formatRFC3339(endOfMonth(Date.parse(endDate))),
      } as ReportRequest
      await ReportApi.create(data)
      toast.success(t('accounting.reports.modals.create.fields.submit.success'))
      await onSubmitSuccess?.()
    } catch {
      toast.error(t('genericFormError'))
    }
  }

  return (
    <form className="grid grid-cols-1 gap-10" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-2xl border-b pb-2">{t('accounting.reports.modals.create.title')}</h3>
      <div className='flex flex-col gap-2'>
        <Controller
          control={control}
          name="name"
          rules={{ required: true, minLength: 3 }}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              label={t('accounting.reports.modals.create.fields.name')}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
            />
          )}
        />
        <Controller
          control={control}
          name="startDate"
          rules={{ required: true }}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              label={t('accounting.reports.modals.create.fields.startDate')}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
              type="month"
            />
          )}
        />
        <Controller
          control={control}
          name="endDate"
          rules={{ required: true }}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              label={t('accounting.reports.modals.create.fields.endDate')}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
              type="month"
            />
          )}
        />
      </div>
      <Button type="submit" disabled={!isValid || isSubmitting}>
        {t('accounting.reports.modals.create.fields.submit')}
      </Button>
    </form>
  )
}
const CreateReportModal = ({
  onSubmitSuccess,
  disclosure,
}: CreateReportModalProps) => (
  <Modal disclosure={disclosure}>
    {({ close }) => (
      <CreateReportForm onSubmitSuccess={async () => {
        await onSubmitSuccess()
        close()
      }} />
    )}
  </Modal>
)

export default CreateReportModal
