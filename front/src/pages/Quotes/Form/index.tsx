import { Badge, Button, useToast } from '@coco-ui/core'
import { useState, useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { QuoteApi } from '@/api/QuoteApi'
import { isQuoteMinimumAccepted } from '@/utils/quote'
import { QUOTE_STATUS } from '@/constants/quote'
import { STRINGS } from '@/constants/strings'
import { PdfApi } from '../../../api/PdfApi'
import useLoadingState from '../../../hooks/useLoadingState'
import Quote from '../../../models/Quote'
import { ROUTES } from '../../../routes'
import QuoteForm from './Form'
import { useDataLoader, useDataLoaderContext } from '@scaleway/use-dataloader'
import { ChevronLeftIcon, DocumentArrowDownIcon, DocumentPlusIcon } from '@heroicons/react/24/solid'

const QuoteCreationPage = () => {
  const [newQuote, setNewQuote] = useState<Quote>({} as Quote)
  const {reload} = useDataLoaderContext()
  const toast = useToast()
  const pdfState = useLoadingState()
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const { data: quote, reload: reloadQuote } = useDataLoader(`quote-${id}`, () => QuoteApi.findById(id), {
    enabled: id !== 'new',
  })

  const onSubmitSuccess = async (data: Quote) => {
    if (data.id !== id) {
      history.push(ROUTES.QUOTE_FORM.path.replace(':id', data.id))
    } else {
      reload('quotes')
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
      toast.error('Erreur lors de la génération du PDF')
      setTimeout(() => {
        pdfState.update('idle')
      }, 1000)
    }
  }

  const createBill = useCallback(async () => {
    try {
      const data = await QuoteApi.createBill({ id: newQuote.id })
      toast.success(STRINGS.BILL_CREATED)
      if (data.id) {
        history.push(ROUTES.BILL_FORM.path.replace(':id', data.id))
      } else {
        history.push(ROUTES.BILLS.path)
      }
    } catch {
      toast.error('Erreur lors de la création de la facture')
    }
  }, [history, newQuote.id, toast])

  useEffect(() => {
    setNewQuote(quote && id !== 'new' ? quote : ({} as Quote))
  }, [id, quote])

  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <div>
        <Button variant="ghost" className="mb-4" size="sm" onClick={history.goBack}>
          <ChevronLeftIcon /> &nbsp; Retourner à la liste des devis
        </Button>
      </div>
      <div className="flex items-center flex-wrap border-b pb-2">
        <div className="flex items-center gap-4 flex-grow mb-4 md:mb-0">
          <h1 className="text-3xl">{!newQuote.id ? 'Nouveau devis' : 'Modifier un devis'}</h1>
          {newQuote.status ? (
            <Badge variant="ghost">{QUOTE_STATUS[newQuote.status]?.text}</Badge>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Button
            variant="success"
            size="md"
            onClick={createBill}
            title="Créer la facture"
            disabled={
              !isQuoteMinimumAccepted(newQuote) ||
              !newQuote.id
            }
          >
            <DocumentPlusIcon />
            &nbsp; Créer la facture
          </Button>
          <Button
            disabled={pdfState.isLoading || !newQuote.id}
            title="Télécharger le PDF"
            onClick={downloadPdf}
            variant="primary"
            size="md"
          >
            <DocumentArrowDownIcon /> &nbsp; Télécharger le PDF
          </Button>
        </div>
      </div>
      <QuoteForm onSubmitSuccess={onSubmitSuccess} quote={newQuote} />
    </div>
  )
}

export default QuoteCreationPage
