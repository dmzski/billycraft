import { Badge, Button, Loader, useToast } from '@coco-ui/core'
import { Link, useHistory, useParams } from 'react-router-dom'
import { QuoteApi } from '@/api/QuoteApi'
import { isQuoteMinimumAccepted } from '@/utils/quote'
import { PdfApi } from '@/api/PdfApi'
import useLoadingState from '@/hooks/useLoadingState'
import { QuoteStatusEnum } from '@/models/Quote'
import { ROUTES } from '@/routes'
import { QuoteFormContent } from '@/pages/Quotes/components/QuoteFormContent'
import { BanknotesIcon, CheckIcon, ChevronLeftIcon, DocumentArrowDownIcon, EnvelopeIcon, InboxArrowDownIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'
import { useQuoteByIdQuery } from '@/queries/useQuoteByIdQuery'
import { QuoteFormValues } from '../components/QuoteFormContent'
import { FormProvider, useForm } from 'react-hook-form'

const defaultQuote = {
  lines: [],
  tva: 0,
  title: "",
} as QuoteFormValues

export const Edit = () => {
  const { t } = useI18n()
  const toast = useToast()
  const pdfState = useLoadingState()
  const { push } = useHistory()
  const { id } = useParams<{ id: string }>()
  const { data: quote, reload: reloadQuote, isLoading } = useQuoteByIdQuery(
    id,
    {
      enabled: !!id,
    },
  )
  const downloadPdf = async () => {
    try {
      if (pdfState.isIdle && quote?.id) {
        pdfState.update('loading')
        const blob = await PdfApi.getQuotePdf(quote.id)
        const link = document.createElement('a')
        link.download = quote.id
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        pdfState.update('idle')
      }
    } catch {
      toast.error(t('quotes.form.pdfError'))
      setTimeout(() => {
        pdfState.update('idle')
      }, 1000)
    }
  }

  const createBill = async () => {
    if (quote) {
      try {

        const data = await QuoteApi.createBill({ id: quote.id })
        toast.success(t('quotes.form.createBill'))
        if (data.id) {
          push(ROUTES.BILL_FORM.path.replace(':id', data.id))
        } else {
          push(ROUTES.BILLS.path)
        }
      } catch {
        toast.error(t('quotes.form.createBillError'))
      }
    }
  }

  const updateQuoteStatus = (status: QuoteStatusEnum) => async () => {
    try {
      await QuoteApi.updateStatus({ id: quote.id, status })
      toast.success(t('quotes.form.submit.edit.success'))
      await reloadQuote()
    } catch {
      toast.error(t('genericFormError'))
    }
  }

  const onSubmit = async (data: QuoteFormValues) => {
    const tmp = {
      id: quote?.id ?? "",
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
      if (quote?.id) {
        await QuoteApi.update(tmp)
      }
      await reloadQuote()
      toast.success(t('quotes.form.submit.success'))
    } catch {
      toast.error(t('genericFormError'))
    }
  }

  const methods = useForm<QuoteFormValues>({
    shouldFocusError: true,
    mode: 'onChange',
    values: quote ?? defaultQuote,
    disabled: !!(quote && quote.status !== QuoteStatusEnum.DRAFT)
  })

  const { isValid, isSubmitting, disabled } = methods.formState

  if (!quote && isLoading) {
    return <Loader />
  }

  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <Link className="gap-1 link link-primary flex items-center" to={ROUTES.QUOTES.path}>
        <ChevronLeftIcon className="w-5" /> {t('quotes.form.backTo')}
      </Link>
      <div className="flex items-center flex-wrap border-b pb-2">
        <div className="flex items-center gap-4 flex-grow">
          <h1 className="text-3xl">
            {!quote?.id ? t('quotes.form.title.new') : t('quotes.form.title.edit')}
          </h1>
          {quote?.status ? (
            <Badge variant="ghost">{t(`quotes.status.${quote.status}`)}</Badge>
          ) : null}
        </div>
        {quote ? (
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={createBill}
              disabled={!isQuoteMinimumAccepted(quote)}
              className='gap-4'
            >
              <PlusIcon className='w-5' />
              {t('quotes.form.createBill')}
            </Button>
            <Button
              disabled={pdfState.isLoading}
              onClick={downloadPdf}
              variant="primary"
              outline
              size="md"
              className="gap-1"
            >
              <DocumentArrowDownIcon className="w-5" />
              {t('quotes.form.downloadPdfButton')}
            </Button>
          </div>
        ) : null}
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <QuoteFormContent quote={quote} />
        </form>
      </FormProvider>
      <div className="grid md:grid-cols-2 gap-4">
        {quote.id && quote.status === QuoteStatusEnum.DRAFT ? (
          <Button
            size="md"
            type="button"
            onClick={updateQuoteStatus(QuoteStatusEnum.SENT)}
            disabled={disabled}
            variant='primary'
            outline
            className='gap-4'
          >
            <EnvelopeIcon className='w-5' />
            {t('quotes.form.actions.sent')}
          </Button>
        ) : null}
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
        {quote.status === QuoteStatusEnum.SENT ? (
          <>
            <Button
              size="md"
              type="button"
              onClick={updateQuoteStatus(QuoteStatusEnum.REFUSED)}
              variant='error'
              className='gap-4'
            >
              <XMarkIcon className='w-5' />
              {t('quotes.form.actions.refused')}
            </Button>
            <Button
              size="md"
              type="button"
              onClick={updateQuoteStatus(QuoteStatusEnum.ACCEPTED)}
              variant='success'
              className='gap-4'
            >
              <CheckIcon className='w-5' />
              {t('quotes.form.actions.accepted')}
            </Button>
          </>
        ) : null}
        {quote.status === QuoteStatusEnum.REFUSED ? (
          <>
            <Button
              size="md"
              type="button"
              variant='primary'
              onClick={updateQuoteStatus(QuoteStatusEnum.DRAFT)}
            >
              {t('quotes.form.actions.backToDraft')}
            </Button>
            <Button outline variant='error' className='gap-4' size="md" type="button" onClick={updateQuoteStatus(QuoteStatusEnum.ARCHIVED)}>
              <InboxArrowDownIcon className='w-5' />
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
              variant='error'
              onClick={updateQuoteStatus(QuoteStatusEnum.ARCHIVED)}
            >
              <InboxArrowDownIcon className='w-5' />
              {t('quotes.form.actions.archive')}
            </Button>
            <Button
              variant="primary"
              size="md"
              type="button"
              onClick={updateQuoteStatus(QuoteStatusEnum.DEPOSIT_ASK)}
            >
              {t('quotes.form.actions.depositAsk')}
            </Button>
          </>
        ) : null}
        {quote.status === QuoteStatusEnum.DEPOSIT_ASK ? (
          <Button variant='success' className='gap-4 md:col-start-2' size="md" type="button" onClick={updateQuoteStatus(QuoteStatusEnum.DEPOSIT_PAID)}>
            <BanknotesIcon className='w-5' />
            {t('quotes.form.actions.depositPaid')}
          </Button>
        ) : null}
        {quote.status === QuoteStatusEnum.DEPOSIT_PAID ? (
          <Button variant='primary' className='gap-4 md:col-start-2' size="md" type="button" onClick={updateQuoteStatus(QuoteStatusEnum.ARCHIVED)}>
            <InboxArrowDownIcon className='w-5' />
            {t('quotes.form.actions.archive')}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
