import { Badge, Button, useToast } from '@coco-ui/core'
import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { QuoteApi } from '@/api/QuoteApi'
import { isQuoteMinimumAccepted } from '@/utils/quote'
import { PdfApi } from '@/api/PdfApi'
import useLoadingState from '@/hooks/useLoadingState'
import Quote from '@/models/Quote'
import { ROUTES } from '@/routes'
import QuoteForm from './Form'
import { ChevronLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'
import { useQuoteByIdQuery } from '@/queries/useQuoteByIdQuery'

const QuoteCreationPage = () => {
  const { t } = useI18n()
  const [newQuote, setNewQuote] = useState<Quote>({} as Quote)
  const toast = useToast()
  const pdfState = useLoadingState()
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const { data: quote, reload: reloadQuote } = useQuoteByIdQuery(
    id,
    {
      enabled: id !== 'new',
    },
  )

  const onSubmitSuccess = async (data: Quote) => {
    if (data.id !== id) {
      history.push(ROUTES.QUOTE_FORM.path.replace(':id', data.id))
    } else {
      reloadQuote()
    }
  }

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
    try {
      const data = await QuoteApi.createBill({ id: newQuote.id })
      toast.success(t('quotes.form.createBill'))
      if (data.id) {
        history.push(ROUTES.BILL_FORM.path.replace(':id', data.id))
      } else {
        history.push(ROUTES.BILLS.path)
      }
    } catch {
      toast.error(t('quotes.form.createBillError'))
    }
  }

  useEffect(() => {
    setNewQuote(quote && id !== 'new' ? quote : ({} as Quote))
  }, [id, quote])

  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <div>
        <Button variant="ghost" className="gap-1" size="sm" onClick={history.goBack}>
          <ChevronLeftIcon className="w-5" /> &nbsp; Retourner à la liste des devis
        </Button>
      </div>
      <div className="flex items-center flex-wrap border-b pb-2">
        <div className="flex items-center gap-4 flex-grow">
          <h1 className="text-3xl">
            {!newQuote.id ? t('quotes.form.title.new') : t('quotes.form.title.edit')}
          </h1>
          {newQuote.status ? (
            <Badge variant="ghost">{t(`quotes.status.${newQuote.status}`)}</Badge>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Button
            variant="success"
            size="md"
            onClick={createBill}
            title="Créer la facture"
            disabled={!isQuoteMinimumAccepted(newQuote) || !newQuote.id}
          >
            {t('quotes.form.createBill')}
          </Button>
          <Button
            disabled={pdfState.isLoading || !newQuote.id}
            onClick={downloadPdf}
            variant="primary"
            size="md"
            className="gap-1"
          >
            <DocumentArrowDownIcon className="w-5" />
            {t('quotes.form.downloadPdfButton')}
          </Button>
        </div>
      </div>
      <QuoteForm onSubmitSuccess={onSubmitSuccess} quote={newQuote} />
    </div>
  )
}

export default QuoteCreationPage
