import { Button, Input, TextArea } from '@coco-ui/core'
import { CustomerApi } from 'api/CustomerApi'
import { STRINGS } from 'constants/strings'
import { useToast } from 'providers/ToastProvider'
import { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Customer from '../../../models/Customer'

const defaultCustomer = {
  address: '',
  name: '',
  city: '',
  phoneNumber: '',
  contact: '',
  email: '',
  postalCode: '',
} as Partial<Customer>

type CustomerFormProps = {
  customer?: Customer
  onSubmitSuccess?: (data: Customer) => Promise<void> | void
}

const CustomerForm = ({ customer, onSubmitSuccess }: CustomerFormProps): JSX.Element => {
  const toast = useToast()
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
    reset,
  } = useForm({
    mode: 'all',
    defaultValues: defaultCustomer,
  })

  const onSubmit = useCallback(async (data: Customer) => {
    try {
      const res = await CustomerApi.createOrUpdate(data)
      onSubmitSuccess?.(res)
      toast.show({ message: STRINGS.SAVE_SUCCESS, variant: 'success' })
    } catch {
      toast.show({ message: STRINGS.SAVE_ERROR, variant: 'error' })
    }
  }, [])

  const tryDelete = useCallback(() => {
    // eslint-disable-next-line no-alert
    const deleteCustomer = window.confirm('Êtes-vous sur de vouloir supprimer ce client')
    if (deleteCustomer && customer?.id) {
      const asyncDelete = async () => {
        try {
          await CustomerApi.delete(customer.id)
          toast.show({ message: STRINGS.DELETE_SUCCESS, variant: 'success' })
          onSubmitSuccess?.({ ...customer, deleted: true })
        } catch {
          toast.show({ message: STRINGS.DELETE_ERROR, variant: 'error' })
        }
      }
      asyncDelete()
    }
  }, [])

  useEffect(() => {
    if (customer) {
      reset(customer)
    }
  }, [reset, customer])

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center border-b-2 border-gray-400 pb-3 w-full">
        <h1 className="ml-4 text-xl flex-grow">
          {!customer?.id ? 'Nouveau client' : `Modifier un client #${customer.id}`}
        </h1>
        {customer?.id ? (
          <Button variant="error" icon="trash" onClick={tryDelete}>
            Supprimer
          </Button>
        ) : null}
      </div>
      <form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          rules={{ maxLength: 100, required: true }}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              label="Nom"
              variant="outside"
              placeholder="Nom du client"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
              disabled={isSubmitting}
            />
          )}
        />
        <Controller
          name="address"
          control={control}
          rules={{ maxLength: 255, required: true }}
          render={({ field, fieldState: { invalid } }) => (
            <TextArea
              rows={4}
              className="mt-3"
              label="Adresse"
              variant="outside"
              placeholder="Adresse du client"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
              disabled={isSubmitting}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{ maxLength: 100 }}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              className="mt-3"
              label="Email"
              variant="outside"
              placeholder="Adresse email"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
              disabled={isSubmitting}
            />
          )}
        />
        <Controller
          name="phoneNumber"
          control={control}
          rules={{ maxLength: 10 }}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              className="mt-3"
              label="Téléphone"
              variant="outside"
              placeholder="Téléphone"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
              disabled={isSubmitting}
            />
          )}
        />
        <Controller
          name="city"
          control={control}
          rules={{ maxLength: 100, required: true }}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              className="mt-3"
              label="Ville"
              variant="outside"
              placeholder="Ville"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
              disabled={isSubmitting}
            />
          )}
        />
        <Controller
          name="postalCode"
          control={control}
          rules={{ maxLength: 10, required: true }}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              className="mt-3"
              label="Code Postal"
              variant="outside"
              placeholder="Code Postal"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
              disabled={isSubmitting}
            />
          )}
        />
        <Controller
          name="contact"
          control={control}
          rules={{ maxLength: 100 }}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              className="mt-3"
              label="Contact"
              variant="outside"
              placeholder="Nom complet"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={invalid}
              disabled={isSubmitting}
            />
          )}
        />
        <div className="mt-3 flex flex-row-reverse">
          <Button size="md" disabled={!isValid || isSubmitting} type="submit">
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CustomerForm
