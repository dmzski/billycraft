import { Button, Input, TextArea, useToast } from '@coco-ui/core'
import { CustomerApi } from '@/api/CustomerApi'
import { STRINGS } from '@/constants/strings'
import { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Customer from '@/models/Customer'
import { TrashIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { useI18n } from '@/i18n'

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
  const {t}=useI18n()
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
    <div className="flex flex-col w-full gap-5">
      <h1 className="text-xl">{!customer?.id ? 'Nouveau client' : `Modifier un client`}</h1>
      <form className='flex flex-col gap-3' onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          rules={{ maxLength: 100, required: true }}
          render={({ field, fieldState: { invalid } }) => (
            <Input
              label={t("customers.form.form.name")}
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
              label={t("customers.form.form.address")}
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
              label={t("customers.form.form.email")}
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
              label={t("customers.form.form.phoneNumber")}
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
              label={t("customers.form.form.city")}
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
              label={t("customers.form.form.postalCode")}
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
              label={t("customers.form.form.contact")}
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
        <div className={clsx('grid gap-3 mt-5', customer?.id ? "md:grid-cols-2" : "")}>
          {customer?.id ? (
            <Button type="button" variant="error" onClick={tryDelete}>
              <TrashIcon className='w-5' />
              &nbsp; Supprimer
            </Button>
          ) : null}
          <Button
            variant="primary"
            disabled={!isValid || isSubmitting}
            type="submit"
          >
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CustomerForm
