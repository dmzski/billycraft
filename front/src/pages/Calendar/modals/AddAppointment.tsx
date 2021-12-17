import { Button, DateTimePicker, Input, Modal, Select, TextArea } from '@coco-ui/core'
import { AppointmentApi } from 'api/AppointmentApi'
import { STRINGS } from 'constants/strings'
import { formatRFC3339, isAfter, isBefore, roundToNearestMinutes } from 'date-fns'
import Appointment, { AppointmentRequest } from 'models/Appointment'
import { useToast } from 'providers/ToastProvider'
import { useCallback, useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'

type AddAppointmentProps = {
  appointment: Partial<Appointment>
  isOpen?: boolean
  onClose: () => void
  onSubmitSuccess?: (data: Appointment) => void | Promise<void>
}

type AppointmentFormValues = {
  name: string
  description?: string
  customerId?: number
  billId?: string
  quoteId?: string
  assignees: string[]
  doneBy?: string
  startDate?: Date
  endDate?: Date
}

const AddAppointment = ({
  appointment,
  isOpen,
  onClose,
  onSubmitSuccess,
}: AddAppointmentProps): JSX.Element => {
  const toast = useToast()
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
    watch,
  } = useForm<AppointmentFormValues>({
    mode: 'onBlur',
    defaultValues: {
      ...appointment,
      startDate: appointment.startDate ? new Date(appointment.startDate) : undefined,
      endDate: appointment.endDate ? new Date(appointment.endDate) : undefined,
    },
  })

  const startDate = watch('startDate')
  const endDate = watch('endDate')

  const handleDelete = useCallback(() => {
    const deleteFn = async () => {
      try {
        if (!appointment.id) {
          throw new Error()
        }
        await AppointmentApi.delete(appointment.id)
        toast.show({ variant: 'success', message: STRINGS.APPOINTMENT_DELETED })
        onClose()
        onSubmitSuccess?.(appointment as Appointment)
      } catch {
        toast.show({ variant: 'error', message: STRINGS.DELETE_ERROR })
      }
    }
    deleteFn()
  }, [appointment, onClose, toast, onSubmitSuccess])

  const onSubmit = useCallback(
    async (values: AppointmentFormValues) => {
      const data: AppointmentRequest = {
        ...values,
        startDate: formatRFC3339(values.startDate ?? new Date()),
        endDate: formatRFC3339(values.endDate ?? new Date()),
      }
      try {
        const res = appointment.id
          ? await AppointmentApi.update(appointment.id, data)
          : await AppointmentApi.create(data)
        toast.show({ variant: 'success', message: STRINGS.APPOINTMENT_CREATED })
        onSubmitSuccess?.(res)
        onClose()
      } catch {
        toast.show({ variant: 'error', message: STRINGS.SAVE_ERROR })
      }
    },
    [toast, onSubmitSuccess, appointment, onClose],
  )

  useEffect(() => {
    if (reset && appointment) {
      reset({
        ...appointment,
        startDate: appointment.startDate ? new Date(appointment.startDate) : undefined,
        endDate: appointment.endDate ? new Date(appointment.endDate) : undefined,
      })
    }
  }, [reset, appointment])

  return (
    <Modal onClose={onClose} open={isOpen}>
      <div className="py-2 flex flex-col w-full">
        <div className="mb-4 border-b-2 flex pl-2 pb-2 items-center">
          <h2 className="text-xl w-full">
            {appointment?.id ? `Modifier un rendez-vous` : `Ajouter un rendez-vous`}
          </h2>
          <Button
            disabled={!appointment?.id}
            type="button"
            onClick={handleDelete}
            variant="error"
            icon="trash"
          >
            Supprimer
          </Button>
        </div>
        <form className="px-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            rules={{ required: true, minLength: 3 }}
            render={({ field, fieldState: { invalid } }) => (
              <Input
                required
                label="Nom du rendez-vous"
                variant="outside"
                name={field.name}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                value={field.value}
                error={invalid}
              />
            )}
          />
          <Controller
            name="customerId"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <Select
                isMulti
                className="mt-4"
                label="Client"
                variant="outside"
                name={field.name}
                onChange={field.onChange}
                options={[]}
                value={field.value}
                error={invalid}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <TextArea
                label="Description du rendez-vous"
                variant="outside"
                rows={3}
                className="mt-4"
                name={field.name}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                value={field.value}
                error={invalid}
              />
            )}
          />
          <Controller
            name="startDate"
            control={control}
            shouldUnregister
            rules={{
              required: true,
              deps: ['endDate'],
              validate: value => (value && endDate && !isBefore(value, endDate) ? '' : undefined),
            }}
            render={({ field, fieldState: { invalid } }) => (
              <DateTimePicker
                required
                className="mt-4 w-full"
                label="Début du rendez-vous"
                variant="outside"
                name={field.name}
                onChange={field.onChange}
                onClickOutside={field.onBlur}
                ref={field.ref}
                value={field.value}
                error={invalid}
              />
            )}
          />
          <Controller
            name="endDate"
            control={control}
            shouldUnregister
            rules={{
              deps: ['startDate'],
              required: true,
              validate: value =>
                !startDate || !value || isBefore(startDate, value) ? undefined : '',
            }}
            render={({ field, fieldState: { invalid } }) => (
              <DateTimePicker
                required
                className="mt-4 w-full"
                label="Fin du rendez-vous"
                variant="outside"
                name={field.name}
                onChange={field.onChange}
                onClickOutside={field.onBlur}
                ref={field.ref}
                value={field.value}
                error={invalid}
              />
            )}
          />

          <Controller
            name="assignees"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <Select
                isMulti
                className="mt-4"
                label="Assigné à"
                variant="outside"
                name={field.name}
                onChange={field.onChange}
                options={[]}
                value={field.value}
                error={invalid}
              />
            )}
          />

          <Controller
            name="quoteId"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <Select
                isMulti
                className="mt-4"
                label="Devis associé"
                variant="outside"
                name={field.name}
                onChange={field.onChange}
                options={[]}
                value={field.value}
                error={invalid}
              />
            )}
          />

          <Controller
            name="billId"
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <Select
                isMulti
                className="mt-4"
                label="Facture associée"
                variant="outside"
                name={field.name}
                onChange={field.onChange}
                options={[]}
                value={field.value}
                error={invalid}
              />
            )}
          />

          <Button className="mt-8" type="submit" disabled={isSubmitting || !isValid}>
            Enregistrer le rendez-vous
          </Button>
        </form>
      </div>
    </Modal>
  )
}

export default AddAppointment
