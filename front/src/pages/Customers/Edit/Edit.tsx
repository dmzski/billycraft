import { Alert, Button, Input, Loader, TextArea, useToast } from '@coco-ui/core'
import { CustomerApi } from '@/api/CustomerApi'
import { useController, useForm } from 'react-hook-form'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useCustomerQuery } from '@/queries/useCustomerQuery'
import { ROUTES } from '@/routes'
import { CustomerUpdateRequest } from '@/models/dtos/CustomerUpdateRequest'

const defaultCustomer = {
  address: '',
  name: '',
  city: '',
  phoneNumber: '',
  contact: '',
  email: '',
  postalCode: '',
} as CustomerUpdateRequest

export const Edit = () => {
  const { id } = useParams<{ id: string }>()
  const { data: customer, isLoading } = useCustomerQuery(id, { enabled: !!id })
  const { t } = useI18n()
  const { push } = useHistory()
  const toast = useToast()
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = useForm<CustomerUpdateRequest>({
    mode: 'onChange',
    values: customer ?? defaultCustomer,
  })

  const onSubmit = async (data: CustomerUpdateRequest) => {
    try {
      if (customer?.id) {
        await CustomerApi.update(data)
        push(ROUTES.CUSTOMER_OVERVIEW.path({ id: customer.id.toString() }))
        toast.success(t('customers.form.submit.success'))
      }
    } catch {
      toast.error(t('genericFormError'))
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

  if (!customer && isLoading) {
    return <Loader />
  }

  if (!customer) {
    return <Alert variant="error">{t('genericDataLoadError')}</Alert>
  }

  return (
    <div className="flex flex-col w-full gap-5">
      <Link
        to={ROUTES.CUSTOMER_OVERVIEW.path({ id: customer?.id.toString() })}
        className="link-primary link-hover flex gap-2 items-center"
      >
        <ChevronLeftIcon className="w-5" />
        {t('customers.form.backToList')}
      </Link>
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="text-3xl">{'Modifier un client'}</h1>
      </div>
      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3">
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
          <div className="grid md:grid-cols-2 gap-3">
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
