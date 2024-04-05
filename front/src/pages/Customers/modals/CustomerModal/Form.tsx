import { Button, Input, TextArea, useToast } from '@coco-ui/core'
import { CustomerApi } from '@/api/CustomerApi'
import { useEffect } from 'react'
import { useController, useForm } from 'react-hook-form'
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
  onSubmitSuccess?: () => Promise<void> | void
}

const CustomerForm = ({ customer, onSubmitSuccess }: CustomerFormProps) => {
  const { t } = useI18n()
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

  const onSubmit = async (data: Partial<Customer>) => {
    try {
      await CustomerApi.createOrUpdate(data as Customer)
      onSubmitSuccess?.()
      toast.success(t('customers.form.submit.success'))
    } catch {
      toast.error(t('genericFormError'))
    }
  }

  const tryDelete = async () => {
    const deleteCustomer = window.confirm('Êtes-vous sur de vouloir supprimer ce client')
    if (deleteCustomer && customer?.id) {
      try {
        await CustomerApi.delete(customer.id)
        toast.success(t('customers.form.delete.submit.success'))
        await onSubmitSuccess?.()
      } catch {
        toast.error(t('genericFormError'))
      }
    }
  }

  useEffect(() => {
    if (customer) {
      reset(customer)
    }
  }, [reset, customer])

  const { field: nameField, fieldState: nameFieldState } = useController({
    control,
    name: 'name',
    rules: { required: true, maxLength: 100 },
  })
  const { field: addressField, fieldState: addressFieldState } = useController({
    control,
    name: 'address',
    rules: { required: true, maxLength: 255 },
  })
  const { field: emailField, fieldState: emailFieldState } = useController({
    control,
    name: 'email',
    rules: { maxLength: 100 },
  })
  const { field: phoneNumberField, fieldState: phoneNumberFieldState } = useController({
    control,
    name: 'phoneNumber',
    rules: { maxLength: 10 },
  })
  const { field: cityField, fieldState: cityFieldState } = useController({
    control,
    name: 'city',
    rules: { required: true, maxLength: 100 },
  })
  const { field: postalCodeField, fieldState: postalCodeFieldState } = useController({
    control,
    name: 'postalCode',
    rules: { maxLength: 10, required: true },
  })
  const { field: contactField, fieldState: contactFieldState } = useController({
    control,
    name: 'contact',
    rules: { maxLength: 100 },
  })

  return (
    <div className="flex flex-col w-full gap-5">
      <h1 className="text-xl">{!customer?.id ? 'Nouveau client' : `Modifier un client`}</h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label={t('customers.modals.form.name.label')}
          placeholder={t('customers.modals.form.name.placeholder')}
          name={nameField.name}
          value={nameField.value}
          onChange={nameField.onChange}
          onBlur={nameField.onBlur}
          ref={nameField.ref}
          error={nameFieldState.invalid}
          required
          maxLength={100}
        />
        <TextArea
          rows={4}
          label={t('customers.modals.form.address.label')}
          placeholder={t('customers.modals.form.address.placeholder')}
          name={addressField.name}
          value={addressField.value}
          onChange={addressField.onChange}
          onBlur={addressField.onBlur}
          ref={addressField.ref}
          error={addressFieldState.invalid}
          required
        />
        <Input
          label={t('customers.modals.form.email.label')}
          placeholder={t('customers.modals.form.email.placeholder')}
          name={emailField.name}
          value={emailField.value}
          onChange={emailField.onChange}
          onBlur={emailField.onBlur}
          ref={emailField.ref}
          error={emailFieldState.invalid}
          maxLength={100}
        />
        <Input
          label={t('customers.modals.form.phoneNumber.label')}
          placeholder={t('customers.modals.form.phoneNumber.placeholder')}
          name={phoneNumberField.name}
          value={phoneNumberField.value}
          onChange={phoneNumberField.onChange}
          onBlur={phoneNumberField.onBlur}
          ref={phoneNumberField.ref}
          error={phoneNumberFieldState.invalid}
          maxLength={10}
        />
        <Input
          required
          label={t('customers.modals.form.city.label')}
          placeholder={t('customers.modals.form.city.placeholder')}
          name={cityField.name}
          value={cityField.value}
          onChange={cityField.onChange}
          onBlur={cityField.onBlur}
          ref={cityField.ref}
          error={cityFieldState.invalid}
          maxLength={100}
        />
        <Input
          required
          label={t('customers.modals.form.postalCode.label')}
          placeholder={t('customers.modals.form.postalcode.placeholder')}
          name={postalCodeField.name}
          value={postalCodeField.value}
          onChange={postalCodeField.onChange}
          onBlur={postalCodeField.onBlur}
          ref={postalCodeField.ref}
          error={postalCodeFieldState.invalid}
          maxLength={10}
        />
        <Input
          label={t('customers.modals.form.contact.label')}
          placeholder={t('customers.modals.form.contact.placeholder')}
          name={contactField.name}
          value={contactField.value}
          onChange={contactField.onChange}
          onBlur={contactField.onBlur}
          ref={contactField.ref}
          error={contactFieldState.invalid}
          maxLength={100}
        />
        <div className={clsx('grid gap-3 mt-5', customer?.id ? 'md:grid-cols-2' : '')}>
          {customer?.id ? (
            <Button type="button" className="gap-1" variant="error" onClick={tryDelete}>
              <TrashIcon className="w-5" />
              <span>{t('delete')}</span>
            </Button>
          ) : null}
          <Button variant="primary" disabled={!isValid || isSubmitting} type="submit">
            {t('save')}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CustomerForm
