import { Button, Input, Modal, TextArea } from '@coco-ui/core'
import Appointment from 'models/Appointment'
import React, { useCallback, useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'

type AddAppointmentProps = {
  appointment: Appointment
  isOpen?: boolean
  onClose: () => void
}
const AddAppointment = ({ appointment, isOpen, onClose }: AddAppointmentProps): JSX.Element => {
  const { control, handleSubmit, reset } = useForm({
    mode: 'all',
    defaultValues: appointment,
  })
  const startDate = useWatch({ name: 'startDate', control })
  const endDate = useWatch({ name: 'endDate', control })

  const onSubmit = useCallback((values: Appointment) => {
    console.log(values)
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

          <Button className="mt-8" type="submit">
            Enregistrer le rendez-vous
          </Button>
        </form>
      </div>
    </Modal>
  )
}

export default AddAppointment
