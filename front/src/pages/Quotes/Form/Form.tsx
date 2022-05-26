import { Button, Input, Select, useToast } from '@coco-ui/core'
import { useMemo, useEffect } from 'react'
import { useMutation } from 'react-query'
import { Controller, useForm } from 'react-hook-form'
import { QuoteApi } from 'api/QuoteApi'
import { Prompt } from 'react-router-dom'
import useCustomers from 'hooks/useCustomers'
import { STRINGS } from 'constants/strings'
import { sendErrorToSentry } from 'utils/errors'
import Quote, { QuoteLine, QuoteStatusEnum } from '../../../models/Quote'
import QuoteLineTable from './QuoteLineTable'

type QuoteFormValues = Omit<Quote, 'lines'> & {
  lines: Array<QuoteLine & { id: string }>
}
const defaultQuote = {} as Partial<QuoteFormValues>
type QuoteFormProps = {
  quote: Quote
  onSubmitSuccess: (res: Quote) => Promise<void> | void
}
const QuoteForm = ({ quote, onSubmitSuccess }: QuoteFormProps): JSX.Element => {
  const toast = useToast()
  const customers = useCustomers()
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting, isDirty },
    reset,
  } = useForm({
    mode: 'all',
    shouldFocusError: true,
    defaultValues: defaultQuote,
  })
  const [updateQuoteStatusMutation, { isLoading: isUpdatingStatus }] = useMutation(
    QuoteApi.updateStatus,
  )
  const updateQuoteStatus = (status: QuoteStatusEnum) => async () => {
    try {
      const res = await updateQuoteStatusMutation({ id: quote.id, status })
      toast.success(STRINGS.SAVE_SUCCESS)
      onSubmitSuccess(res as Quote)
    } catch {
      toast.error(STRINGS.SAVE_ERROR)
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
      toast.success(STRINGS.SAVE_SUCCESS)
    } catch (error) {
      sendErrorToSentry(error)
      toast.error(STRINGS.SAVE_ERROR)
    }
  }

  const disabled = useMemo(
    () => !!((quote.id && quote.status !== QuoteStatusEnum.DRAFT) || isUpdatingStatus),
    [quote, isUpdatingStatus],
  )

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
    if (quote) {
      reset(quote)
    }
  }, [reset, quote])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Prompt
        when={isDirty}
        message="Attention ! Certaines modifications ne sont pas enregistrées"
      />
      <Controller
        name="title"
        control={control}
        rules={{ required: true, minLength: 3 }}
        render={({ field, fieldState: { invalid } }) => (
          <Input
            className="my-4"
            label="Titre"
            disabled={disabled}
            error={invalid}
            variant="outside"
            placeholder="Titre du devis"
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            value={field.value}
            ref={field.ref}
          />
        )}
      />
      <Controller
        name="customerId"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState: { invalid } }) => (
          <Select
            tabIndex={0}
            error={invalid}
            label="Sélectionner un client"
            variant="outside"
            id="customer-select"
            name={field.name}
            disabled={disabled}
            onChange={field.onChange}
            options={customerOptions}
            placeholder="Nom du client"
            value={field.value}
            isSearchable
            isLoading={!customers}
            ref={field.ref}
          />
        )}
      />
      <Controller
        name="tva"
        control={control}
        rules={{ min: 0, max: 100 }}
        render={({ field, fieldState: { invalid } }) => (
          <Input
            label="TVA (%)"
            className="my-4"
            disabled={disabled}
            variant="outside"
            placeholder="TVA en %"
            type="number"
            value={field.value}
            name={field.name}
            onChange={e => field.onChange(Number(e.target.value))}
            onBlur={field.onBlur}
            error={invalid}
            ref={field.ref}
          />
        )}
      />
      <div className="my-4">
        <QuoteLineTable control={control} disabled={disabled} />
      </div>

      <div className="flex justify-end pt-4">
        {quote.id && quote.status === QuoteStatusEnum.DRAFT ? (
          <Button
            className="mr-4"
            variant="info"
            size="md"
            type="button"
            onClick={updateQuoteStatus(QuoteStatusEnum.SENT)}
            disabled={disabled}
          >
            Envoyer le devis
          </Button>
        ) : null}
        {!quote.id || quote.status === QuoteStatusEnum.DRAFT || !quote.status ? (
          <Button
            variant="success"
            size="md"
            type="submit"
            disabled={!isValid || isSubmitting || disabled}
          >
            Enregistrer
          </Button>
        ) : null}
        {quote.status === QuoteStatusEnum.SENT ? (
          <>
            <Button
              size="md"
              variant="success"
              type="button"
              icon="thumb-up"
              className="mr-4"
              onClick={updateQuoteStatus(QuoteStatusEnum.ACCEPTED)}
              disabled={isUpdatingStatus}
            >
              Devis accepté
            </Button>
            <Button
              size="md"
              variant="error"
              type="button"
              icon="thumb-down"
              onClick={updateQuoteStatus(QuoteStatusEnum.REFUSED)}
              disabled={isUpdatingStatus}
            >
              Devis refusé
            </Button>
          </>
        ) : null}
        {quote.status === QuoteStatusEnum.ACCEPTED ? (
          <>
            <Button
              size="md"
              variant="secondary"
              className="mr-4"
              icon="document"
              type="button"
              onClick={updateQuoteStatus(QuoteStatusEnum.DRAFT)}
              disabled={isUpdatingStatus}
            >
              Remettre en brouillon
            </Button>
            <Button
              size="md"
              icon="currency-euro"
              type="button"
              onClick={updateQuoteStatus(QuoteStatusEnum.DEPOSIT_ASK)}
              disabled={isUpdatingStatus}
            >
              Demander un accompte
            </Button>
          </>
        ) : null}
        {quote.status === QuoteStatusEnum.DEPOSIT_ASK ? (
          <Button
            size="md"
            icon="check"
            type="button"
            onClick={updateQuoteStatus(QuoteStatusEnum.DEPOSIT_PAID)}
            disabled={isUpdatingStatus}
          >
            Accompte payé
          </Button>
        ) : null}
        {quote.status === QuoteStatusEnum.DEPOSIT_PAID ? (
          <Button
            size="md"
            icon="archive"
            type="button"
            onClick={updateQuoteStatus(QuoteStatusEnum.ARCHIVED)}
            disabled={isUpdatingStatus}
          >
            Archiver le devis
          </Button>
        ) : null}
      </div>
    </form>
  )
}

export default QuoteForm
