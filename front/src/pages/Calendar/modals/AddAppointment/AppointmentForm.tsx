import { Button, DateTimePicker, Input, Select, TextArea } from '@coco-ui/core'
import { AppointmentApi } from 'api/AppointmentApi'
import { BillApi } from 'api/BillApi'
import { CustomerApi } from 'api/CustomerApi'
import { QuoteApi } from 'api/QuoteApi'
import { UserApi } from 'api/UserApi'
import { STRINGS } from 'constants/strings'
import { formatRFC3339, isBefore } from 'date-fns'
import Appointment, { AppointmentRequest } from 'models/Appointment'
import { useToast } from 'providers/ToastProvider'
import { useCallback, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'

type AddAppointmentFormProps = {
  appointment: Partial<Appointment>
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

const Form = ({ appointment, onClose, onSubmitSuccess }: AddAppointmentFormProps): JSX.Element => {
  const toast = useToast()
  const { isLoading: isLoadingCustomers, data: customers } = useQuery(
    ['customers', 'not-deleted'],
    CustomerApi.findAllNotDeleted,
  )
  const { isLoading: isLoadingQuotes, data: quotes } = useQuery(
    'quotes',
    QuoteApi.findAllNotArchived,
  )
  const { isLoading: isLoadingBills, data: bills } = useQuery('bills', BillApi.findAllNotArchived)
  const { isLoading: isLoadingUsers, data: users } = useQuery('users', UserApi.findAll)
  const {
    control,
    handleSubmit,
    reset,
    setValue,
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
  const customerId = watch('customerId')

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
        toast.show({
          variant: 'success',
          message: appointment.id ? STRINGS.APPOINTMENT_UPDATED : STRINGS.APPOINTMENT_CREATED,
        })
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

  const quoteOptions = useMemo(() => {
    if (customerId) {
      return (
        quotes
          ?.filter(({ customerId: quoteCustomerId }) => quoteCustomerId === customerId)
          .map(({ id, title }) => ({ value: id, label: `${id} - ${title}` })) ?? []
      )
    }
    return quotes?.map(({ id, title }) => ({ value: id, label: `${id} - ${title}` })) ?? []
  }, [customerId, quotes])

  const billOptions = useMemo(() => {
    if (customerId) {
      return (
        bills
          ?.filter(({ customerId: billCustomerId }) => billCustomerId === customerId)
          .map(({ id, title }) => ({ value: id, label: `${id} - ${title}` })) ?? []
      )
    }
    return bills?.map(({ id, title }) => ({ value: id, label: `${id} - ${title}` })) ?? []
  }, [customerId, bills])

  return (
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
          rules={{
            onChange: () => {
              setValue('billId', undefined)
              setValue('quoteId', undefined)
            },
          }}
          render={({ field, fieldState: { invalid } }) => (
            <Select
              isLoading={isLoadingCustomers}
              isSearchable
              className="mt-4"
              label="Client"
              variant="outside"
              name={field.name}
              onChange={field.onChange}
              options={customers?.map(({ id, name }) => ({ value: id, label: name })) ?? []}
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
              isSearchable
              isLoading={isLoadingUsers}
              className="mt-4"
              label="Assigné à"
              variant="outside"
              name={field.name}
              onChange={field.onChange}
              options={
                users?.map(({ email, firstName, lastName }) => ({
                  value: email,
                  label: `${firstName} ${lastName}`,
                })) ?? []
              }
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
              isSearchable
              disabled={quoteOptions.length === 0}
              isLoading={isLoadingQuotes}
              className="mt-4"
              label="Devis associé"
              variant="outside"
              name={field.name}
              onChange={field.onChange}
              options={quoteOptions}
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
              isSearchable
              disabled={billOptions.length === 0}
              isLoading={isLoadingBills}
              className="mt-4"
              label="Facture associée"
              variant="outside"
              name={field.name}
              onChange={field.onChange}
              options={billOptions}
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
  )
}

export default Form
