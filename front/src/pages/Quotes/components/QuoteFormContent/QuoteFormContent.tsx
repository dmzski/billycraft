import { Input, Select } from '@coco-ui/core'
import { ComponentProps, useMemo } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { Prompt } from 'react-router-dom'
import useCustomers from '@/hooks/useCustomers'
import Quote from '@/models/Quote'
import QuoteLineTable from './QuoteLineTable'
import { useI18n } from '@/i18n'
import { QuoteFormValues } from './types'



type QuoteFormProps = {
  quote?: Quote
}

export const QuoteFormContent = ({ quote }: QuoteFormProps) => {
  const { t } = useI18n()
  const customers = useCustomers()
  const { control, formState: { isDirty, isSubmitting, disabled } } = useFormContext<QuoteFormValues>()

  const customerOptions: ComponentProps<typeof Select>['options'] = useMemo(() => {
    const array: ComponentProps<typeof Select>['options'] = []
    if (customers) {
      array.push(
        ...customers
          .filter(({ deleted }) => !deleted)
          .map(customer => ({
            value: customer.id,
            label: customer.name,
          })),
      )
    }
    if (quote?.customerId && !array.find(({ value }) => value === quote.customerId)) {
      const customer = customers.find(({ id }) => id === quote.customerId)
      if (customer) array.push({ value: customer.id, label: customer.name })
    }

    return array
  }, [customers, quote?.customerId])

  const { field: titleField, fieldState: titleFieldState } = useController({
    control,
    name: 'title',
    rules: { required: true, minLength: 3 },
  })
  const { field: customerIdField, fieldState: customerIdFieldState } = useController({
    control,
    name: 'customerId',
    rules: { required: true },
  })
  const { field: tvaField, fieldState: tvaFieldState } = useController({
    control,
    name: 'tva',
    rules: { required: true, min: 0, max: 100 },
  })

  return (
    <>
      <Prompt when={isDirty && !isSubmitting} message={t('quotes.form.exitWarning')} />
      <Input
        label={t('quotes.form.fields.title.label')}
        error={titleFieldState.invalid}
        placeholder={t('quotes.form.fields.title.placeholder')}
        onChange={titleField.onChange}
        onBlur={titleField.onBlur}
        name={titleField.name}
        value={titleField.value}
        ref={titleField.ref}
        disabled={disabled}
        required
      />
      <Select
        error={customerIdFieldState.invalid}
        label={t('quotes.form.fields.customerId.label')}
        id="customer-select"
        name={customerIdField.name}
        disabled={disabled || !customers}
        onChange={customerIdField.onChange}
        options={customerOptions}
        placeholder={t('quotes.form.fields.customerId.placeholder')}
        value={customerIdField.value}
        isSearchable
        ref={customerIdField.ref}
        required
      />
      <Input
        label={t('quotes.form.fields.vat.label')}
        disabled={disabled}
        placeholder={t('quotes.form.fields.vat.placeholder')}
        type="number"
        value={tvaField.value}
        name={tvaField.name}
        onChange={e => tvaField.onChange(Number(e.target.value))}
        onBlur={tvaField.onBlur}
        error={tvaFieldState.invalid}
        ref={tvaField.ref}
        min={0}
        max={100}
      />
      <QuoteLineTable control={control} disabled={disabled} />
    </>
  )
}
