import { Button, Loader, useToast } from '@coco-ui/core'
import { Link, Redirect, useHistory, useParams } from 'react-router-dom'
import { QuoteApi } from '@/api/QuoteApi'
import { QuoteStatusEnum } from '@/models/Quote'
import { ROUTES } from '@/routes'
import { QuoteFormContent } from '@/pages/Quotes/components/QuoteFormContent'
import { ChevronLeftIcon, DocumentIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'
import { useQuoteByIdQuery } from '@/queries/useQuoteByIdQuery'
import { QuoteFormValues } from '../components/QuoteFormContent'
import { FormProvider, useForm } from 'react-hook-form'
import { QuoteUpdateRequest } from '@/models/dtos/QuoteUpdateRequest'
import { useMemo } from 'react'
import { calculatePriceTTC } from '@/utils/price'

const defaultQuote = {
  lines: [],
  tva: 0,
  title: '',
  customerId: '',
} as QuoteFormValues

export const Edit = () => {
  const { t } = useI18n()
  const toast = useToast()
  const { push } = useHistory()
  const { id } = useParams<{ id: string }>()
  const { data: quote, isLoading } = useQuoteByIdQuery(id, {
    enabled: !!id,
  })

  const onSubmit = async (data: QuoteFormValues) => {
    const tmp: QuoteUpdateRequest = {
      id: quote?.id ?? '',
      ...data,
      lines: data.lines.map((line, index: number) => ({
        name: line.name,
        quoteId: line.quoteId,
        type: line.type,
        description: line.description,
        line: index + 1,
        price: line.price ? Number(`${line.price}`) : undefined,
        quantity: line.quantity ? Number(`${line.quantity}`) : undefined,
      })),
    }
    try {
      if (quote?.id) {
        await QuoteApi.update(tmp)
        toast.success(t('quotes.form.submit.success'))
        push(ROUTES.QUOTE_OVERVIEW.path({ id: quote.id }))
      }
    } catch {
      toast.error(t('genericFormError'))
    }
  }

  const initialValues: QuoteFormValues = useMemo(
    () =>
      quote
        ? {
            ...quote,
            lines: quote.lines.map(({ price, ...rest }) => ({
              ...rest,
              price,
              itPrice: calculatePriceTTC(price, quote.tva),
            })),
          }
        : defaultQuote,
    [quote],
  )

  const methods = useForm<QuoteFormValues>({
    shouldFocusError: true,
    mode: 'onChange',
    values: initialValues,
    disabled: !!(quote && quote.status !== QuoteStatusEnum.DRAFT),
  })

  const { isValid, isSubmitting, disabled } = methods.formState

  if (!quote && isLoading) {
    return <Loader />
  }

  if (!quote) {
    return t('genericDataLoadError')
  }

  if (quote.status !== QuoteStatusEnum.DRAFT) {
    return <Redirect to={ROUTES.QUOTE_OVERVIEW.path({ id: quote.id })} />
  }

  return (
    <div className="flex flex-col gap-10">
      <Link
        className="gap-1 link link-primary flex items-center"
        to={ROUTES.QUOTE_OVERVIEW.path({ id: quote.id })}
      >
        <ChevronLeftIcon className="w-5" /> {t('quotes.form.backTo.edit')}
      </Link>
      <h1 className="text-4xl font-bold flex gap-5 items-center">
        <DocumentIcon className="w-14 p-3 text-primary bg-primary-content mask mask-squircle" />
        <span>{quote.name}</span>
      </h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <QuoteFormContent quote={quote} />
          <div className="grid md:grid-cols-2 gap-4">
            {!quote.id || quote.status === QuoteStatusEnum.DRAFT || !quote.status ? (
              <Button
                size="md"
                type="submit"
                disabled={!isValid || isSubmitting || disabled}
                variant="primary"
              >
                {t('quotes.form.submit')}
              </Button>
            ) : null}
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
