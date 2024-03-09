import { Button, Icon, Input, TextArea, useToast } from '@coco-ui/core'
import { CustomerApi } from '@/api/CustomerApi'
import { STRINGS } from '@/constants/strings'
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

const CustomerForm = ({ customer, onSubmitSuccess }: CustomerFormProps) => {
  const toast = useToast()
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
    reset,
  } = useForm<Partial<Customer>>({
    mode: 'all',
    defaultValues: defaultCustomer,
  })

  const onSubmit = useCallback(
    async (data: Partial<Customer>) => {
      try {
        const res = await CustomerApi.createOrUpdate(data as Customer)
        onSubmitSuccess?.(res)
        toast.success(STRINGS.SAVE_SUCCESS)
      } catch {
        toast.error(STRINGS.SAVE_ERROR)
      }
    },
    [onSubmitSuccess, toast],
  )

  const tryDelete = useCallback(() => {
    const deleteCustomer = window.confirm('Êtes-vous sur de vouloir supprimer ce client')
    if (deleteCustomer && customer?.id) {
      const asyncDelete = async () => {
        try {
          await CustomerApi.delete(customer.id)
          toast.success(STRINGS.DELETE_SUCCESS)
          onSubmitSuccess?.({ ...customer, deleted: true })
        } catch {
          toast.error(STRINGS.DELETE_ERROR)
        }
      }
      asyncDelete()
    }
  }, [customer, toast, onSubmitSuccess])

  useEffect(() => {
    if (customer) {
      reset(customer)
    }
  }, [reset, customer])

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between border-b-2 border-base-200 pr-6 pb-2 w-full">
        <h1 className="ml-4 text-xl">{!customer?.id ? 'Nouveau client' : `Modifier un client`}</h1>
        {customer?.id ? (
          <Button variant="error" onClick={tryDelete}>
            <Icon name="trash" />
            &nbsp; Supprimer
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
        <Button
          variant="primary"
          block
          className="mt-3"
          size="md"
          disabled={!isValid || isSubmitting}
          type="submit"
        >
          Enregistrer
        </Button>
      </form>
    </div>
  )
}

export default CustomerForm
