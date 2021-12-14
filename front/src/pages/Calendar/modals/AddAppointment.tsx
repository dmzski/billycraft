import { Button, Input, Modal, Select, TextArea } from '@coco-ui/core'
import { AppointmentApi } from 'api/AppointmentApi'
import { formatRFC3339 } from 'date-fns'
import Appointment, { AppointmentRequest } from 'models/Appointment'
import { useCallback, useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'

type AddAppointmentProps = {
  appointment: Partial<Appointment>
  isOpen?: boolean
  onClose: () => void
}
const AddAppointment = ({ appointment, isOpen, onClose }: AddAppointmentProps): JSX.Element => {
  const { control, handleSubmit, reset } = useForm({
    mode: 'onBlur',
    defaultValues: appointment,
  })
  const startDate = useWatch({ name: 'startDate', control })
  const endDate = useWatch({ name: 'endDate', control })

  const onSubmit = useCallback(async (values: AppointmentRequest) => {
    // TODO: Remove console.log after testing
    // eslint-disable-next-line no-console
    const data: AppointmentRequest = {
      ...values,
      startDate: formatRFC3339(new Date(values.startDate)),
      endDate: formatRFC3339(new Date(values.endDate)),
    }
    console.log(data)
    AppointmentApi.create(data)
  }, [])

  useEffect(() => {
    if (reset && appointment) {
      reset(appointment)
    }
  }, [reset, appointment])

  return (
    <Modal onClose={onClose} open={isOpen}>
      <div className="py-2 flex flex-col w-full">
        <h2 className="pl-2 pb-2 text-xl mb-4 border-b-2 w-full">
          {appointment?.id ? `Modifier un rendez-vous` : `Ajouter un rendez-vous`}
        </h2>
        <form className="px-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            rules={{ required: true, minLength: 3 }}
            render={({ field, fieldState: { invalid } }) => (
              <Input
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
            rules={{ required: true }}
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
            rules={{ required: true }}
            render={({ field, fieldState: { invalid } }) => (
              <Input
                className="mt-4"
                label="Début du rendez-vous"
                variant="outside"
                name={field.name}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                value={field.value}
                type="datetime-local"
                error={invalid}
                max={endDate}
                step={60 * 30}
              />
            )}
          />
          <Controller
            name="endDate"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { invalid } }) => (
              <Input
                className="mt-4"
                label="Fin du rendez-vous"
                variant="outside"
                name={field.name}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                value={field.value}
                type="datetime-local"
                error={invalid}
                min={startDate}
                step={60 * 30}
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

          <Button className="mt-8" type="submit">
            Enregistrer le rendez-vous
          </Button>
        </form>
      </div>
    </Modal>
  )
}

export default AddAppointment
