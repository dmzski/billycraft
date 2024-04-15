import { Button, Input, Loader, TextArea, useToast } from '@coco-ui/core'
import { CustomerApi } from '@/api/CustomerApi'
import { useController, useForm } from 'react-hook-form'
import Customer from '@/models/Customer'
import { ChevronLeftIcon, TrashIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useCustomerQuery } from '@/queries/useCustomerQuery'
import { ROUTES } from '@/routes'

const defaultCustomer = {
  address: '',
  name: '',
  city: '',
  phoneNumber: '',
  contact: '',
  email: '',
  postalCode: '',
} as Customer

const CustomerForm = () => {
  const { id } = useParams<{ id?: string }>()
  const { data: customer, isLoading } = useCustomerQuery(Number(id) ?? 0, { enabled: !!id })
  const { t } = useI18n()
  const { push } = useHistory()
  const toast = useToast()
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = useForm<Partial<Customer>>({
    mode: 'onChange',
    values: customer ?? defaultCustomer
  })

  const onSubmit = async (data: Partial<Customer>) => {
    try {
      await CustomerApi.createOrUpdate(data as Customer)
      push(ROUTES.CUSTOMERS.path())
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
        push(ROUTES.CUSTOMERS.path())
      } catch {
        toast.error(t('genericFormError'))
      }
    }
  }

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

  if (id && !customer && isLoading) {
    return <Loader />
  }

  return (
    <div className="flex flex-col w-full gap-5">
      <Link to={ROUTES.CUSTOMERS.path} className='link-primary link flex gap-2 items-center'>
      <ChevronLeftIcon className='w-5' />
      {t('customers.form.backToList')}
      </Link>
      <div className='flex flex-col md:flex-row justify-between items-center gap-2'>
        <h1 className="text-3xl">{!customer?.id ? 'Nouveau client' : `Modifier un client`}</h1>
        {customer?.id ? (
          <Button outline className="gap-1 items-center" variant="error" onClick={tryDelete}>
            <TrashIcon className="w-5" />
            <span>{t('delete')}</span>
          </Button>
        ) : null}
      </div>
      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-3'>

          <Input
            label={t('customers.form.name.label')}
            placeholder={t('customers.form.name.placeholder')}
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
            label={t('customers.form.address.label')}
            placeholder={t('customers.form.address.placeholder')}
            name={addressField.name}
            value={addressField.value}
            onChange={addressField.onChange}
            onBlur={addressField.onBlur}
            ref={addressField.ref}
            error={addressFieldState.invalid}
            required
          />
          <div className='grid md:grid-cols-2 gap-3'>
            <Input
              label={t('customers.form.email.label')}
              placeholder={t('customers.form.email.placeholder')}
              name={emailField.name}
              value={emailField.value}
              onChange={emailField.onChange}
              onBlur={emailField.onBlur}
              ref={emailField.ref}
              error={emailFieldState.invalid}
              maxLength={100}
            />
            <Input
              label={t('customers.form.phoneNumber.label')}
              placeholder={t('customers.form.phoneNumber.placeholder')}
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
              label={t('customers.form.city.label')}
              placeholder={t('customers.form.city.placeholder')}
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
              label={t('customers.form.postalCode.label')}
              placeholder={t('customers.form.postalcode.placeholder')}
              name={postalCodeField.name}
              value={postalCodeField.value}
              onChange={postalCodeField.onChange}
              onBlur={postalCodeField.onBlur}
              ref={postalCodeField.ref}
              error={postalCodeFieldState.invalid}
              maxLength={10}
            />
          </div>
          <Input
            label={t('customers.form.contact.label')}
            placeholder={t('customers.form.contact.placeholder')}
            name={contactField.name}
            value={contactField.value}
            onChange={contactField.onChange}
            onBlur={contactField.onBlur}
            ref={contactField.ref}
            error={contactFieldState.invalid}
            maxLength={100}
          />
        </div>
        <Button variant="primary" disabled={!isValid || isSubmitting} type="submit">
          {t('save')}
        </Button>
      </form>
    </div>
  )
}

export default CustomerForm
