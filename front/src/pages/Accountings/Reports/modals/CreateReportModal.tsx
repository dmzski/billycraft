import { Button, Input, Modal, useToast } from '@coco-ui/core'
import { ReportApi } from 'api/ReportApi'
import { STRINGS } from 'constants/strings'
import { endOfMonth, formatRFC3339 } from 'date-fns'
import { ReportRequest, ReportResponse } from 'models/Report'
import { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

type CreateReportModalProps = {
  isOpen?: boolean
  onClose: () => void
  onSubmitSuccess?: (res: ReportResponse) => void | Promise<void>
}
const CreateReportModal = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}: CreateReportModalProps): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
    reset,
  } = useForm({
    mode: 'onBlur',
  })
  const toast = useToast()

  const onSubmit = useCallback(
    async ({ startDate, endDate, name }) => {
      try {
        const data = {
          name,
          startDate: formatRFC3339(Date.parse(startDate)),
          endDate: formatRFC3339(endOfMonth(Date.parse(endDate))),
        } as ReportRequest
        const res = await ReportApi.create(data)
        onClose()
        toast.success(STRINGS.REPORT_CREATED)
        onSubmitSuccess?.(res)
        reset()
      } catch {
        toast.error(STRINGS.CREATION_ERROR)
      }
    },
    [reset, onClose, onSubmitSuccess, toast],
  )

  useEffect(() => {
    if (reset) reset()
  }, [isOpen, reset])

  return (
    <Modal onClose={onClose} open={isOpen}>
      <div className="w-full p-2">
        <h3 className="mb-4 text-lg border-b pb-2">Création d&apos;un rapport</h3>
        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="name"
            rules={{ required: true, minLength: 3 }}
            render={({ field, fieldState: { invalid } }) => (
              <Input
                label="Nom du rapport"
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
                label="Mois de début"
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
                label="Mois de fin"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={invalid}
                type="month"
              />
            )}
          />
          <Button type="submit" disabled={!isValid || isSubmitting}>
            Créer le rapport
          </Button>
        </form>
      </div>
    </Modal>
  )
}

export default CreateReportModal
