import { Button, Input, Select, useToast } from '@coco-ui/core'
import { useMemo, useEffect } from 'react'
import { useController, useForm } from 'react-hook-form'
import { QuoteApi } from '@/api/QuoteApi'
import { Prompt } from 'react-router-dom'
import useCustomers from '@/hooks/useCustomers'
import Quote, { QuoteLine, QuoteStatusEnum } from '@/models/Quote'
import QuoteLineTable from './QuoteLineTable'
import { useI18n } from '@/i18n'

export type QuoteFormValues = Omit<Quote, 'lines'> & {
  lines: Array<QuoteLine & { id: string }>
}

const defaultQuote = {} as Partial<QuoteFormValues>
type QuoteFormProps = {
  quote: Quote
  onSubmitSuccess: (res: Quote) => Promise<void> | void
}
const QuoteForm = ({ quote, onSubmitSuccess }: QuoteFormProps) => {
  const { t } = useI18n()
  const toast = useToast()
  const customers = useCustomers()
  const {
    handleSubmit,
    control,
    formState: { isValidating, isSubmitting, isDirty },
    reset,
  } = useForm<QuoteFormValues>({
    shouldFocusError: true,
    mode: 'onChange',
    defaultValues: defaultQuote,
  })

  const updateQuoteStatus = (status: QuoteStatusEnum) => async () => {
    try {
      const res = await QuoteApi.updateStatus({ id: quote.id, status })
      toast.success(t('quotes.form.submit.edit.success'))
      onSubmitSuccess(res as Quote)
    } catch {
      toast.error(t('genericFormError'))
    }
  }

  const onSubmit = async (data: QuoteFormValues) => {
    const tmp: Quote = {
      ...data,
      lines: data.lines.map((line, index: number) => ({
        name: line.name,
        quoteId: line.quoteId,
        type: line.type,
        description: line.description,
        line: index + 1,
        price: line.price ? Number(`${line.price}`) : null,
        quantity: line.quantity ? Number(`${line.quantity}`) : null,
      })),
    }
    try {
      const res = await QuoteApi.createOrUpdate(tmp)
      reset(res)
      onSubmitSuccess(res)
      toast.success(t('quotes.form.submit.success'))
    } catch {
      toast.error(t('genericFormError'))
    }
  }

  const disabled = useMemo(() => !!(quote.id && quote.status !== QuoteStatusEnum.DRAFT), [quote])

  const customerOptions = useMemo(() => {
    const array = []
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
    if (quote.customerId && !array.find(({ value }) => value === quote.customerId)) {
      const customer = customers.find(({ id }) => id === quote.customerId)
      if (customer) array.push({ value: customer.id, label: customer.name })
    }

    return array
  }, [customers, quote.customerId])

  useEffect(() => {
    if (quote?.id) {
      reset(quote)
    }
  }, [reset, quote])

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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Prompt when={isDirty} message={t('quotes.form.exitWarning')} />
      <Input
        label={t('quotes.form.fields.title.label')}
        disabled={disabled}
        error={titleFieldState.invalid}
        placeholder={t('quotes.form.fields.title.placeholder')}
        onChange={titleField.onChange}
        onBlur={titleField.onBlur}
        name={titleField.name}
        value={titleField.value}
        ref={titleField.ref}
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
        autoComplete="off"
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

      <div className="flex justify-end gap-4">
        {quote.id && quote.status === QuoteStatusEnum.DRAFT ? (
          <Button
            size="md"
            type="button"
            onClick={updateQuoteStatus(QuoteStatusEnum.SENT)}
            disabled={disabled}
          >
            {t('quotes.form.actions.sent')}
          </Button>
        ) : null}
        {!quote.id || quote.status === QuoteStatusEnum.DRAFT || !quote.status ? (
          <Button
            size="md"
            type="submit"
            disabled={isValidating || isSubmitting || disabled}
          >
            {t('quotes.form.submit')}
          </Button>
        ) : null}
        {quote.status === QuoteStatusEnum.SENT ? (
          <>
            <Button
              size="md"
              outline
              type="button"
              onClick={updateQuoteStatus(QuoteStatusEnum.REFUSED)}
            >
              {t('quotes.form.actions.refused')}
            </Button>
            <Button
              size="md"
              type="button"
              onClick={updateQuoteStatus(QuoteStatusEnum.ACCEPTED)}
            >
              {t('quotes.form.actions.accepted')}
            </Button>
          </>
        ) : null}
        {quote.status === QuoteStatusEnum.REFUSED ? (
          <>
            <Button
              size="md"
              outline
              type="button"
              onClick={updateQuoteStatus(QuoteStatusEnum.DRAFT)}
            >
              {t('quotes.form.actions.backToDraft')}
            </Button>
            <Button size="md" type="button" onClick={updateQuoteStatus(QuoteStatusEnum.ARCHIVED)}>
              {t('quotes.form.actions.archive')}
            </Button>
          </>
        ) : null}
        {quote.status === QuoteStatusEnum.ACCEPTED ? (
          <>
            <Button
              size="md"
              outline
              type="button"
              onClick={updateQuoteStatus(QuoteStatusEnum.ARCHIVED)}
            >
              {t('quotes.form.actions.archive')}
            </Button>
            <Button
              size="md"
              type="button"
              onClick={updateQuoteStatus(QuoteStatusEnum.DEPOSIT_ASK)}
            >
              {t('quotes.form.actions.depositAsk')}
            </Button>
          </>
        ) : null}
        {quote.status === QuoteStatusEnum.DEPOSIT_ASK ? (
          <Button size="md" type="button" onClick={updateQuoteStatus(QuoteStatusEnum.DEPOSIT_PAID)}>
            {t('quotes.form.actions.depositPaid')}
          </Button>
        ) : null}
        {quote.status === QuoteStatusEnum.DEPOSIT_PAID ? (
          <Button size="md" type="button" onClick={updateQuoteStatus(QuoteStatusEnum.ARCHIVED)}>
            {t('quotes.form.actions.archive')}
          </Button>
        ) : null}
      </div>
    </form>
  )
}

export default QuoteForm
