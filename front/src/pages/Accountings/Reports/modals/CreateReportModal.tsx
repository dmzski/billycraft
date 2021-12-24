import { Button, Input, Modal, useToast } from '@coco-ui/core'
import { STRINGS } from 'constants/strings'
import { ReportDTO } from 'models/dtos/Report'
import React, { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

type CreateReportModalProps = {
  isOpen?: boolean
  onClose: () => void
  onSubmitSuccess?: (res: ReportDTO) => void | Promise<void>
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
    async values => {
      try {
        console.log(values)
        toast.success(STRINGS.REPORT_CREATED)
        onClose()
        onSubmitSuccess?.({} as ReportDTO)
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
    <Modal onClose={onClose} open={isOpen} size="xs">
      <div className="w-full p-2">
        <h3 className="mb-4 text-lg border-b pb-2">Création d&apos;un rapport</h3>
        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="startDate"
            rules={{ required: true }}
            render={({ field, fieldState: { invalid } }) => (
              <Input
                label="Mois de début"
                variant="outside"
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
                variant="outside"
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
