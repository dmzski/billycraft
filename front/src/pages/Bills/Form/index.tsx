import { Badge, Button } from '@coco-ui/core'
import { useState, useEffect } from 'react'
import { useQuery, useQueryCache } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'
import { BillApi } from 'api/BillApi'
import { BILL_STATUS } from 'constants/bill'
import { PdfApi } from '../../../api/PdfApi'
import useLoadingState from '../../../hooks/useLoadingState'
import Bill from '../../../models/Bill'
import { useToast } from '../../../providers/ToastProvider'
import { ROUTES } from '../../../routes'
import BillForm from './Form'

const BillFormPage = (): JSX.Element => {
  const [newBill, setNewBill] = useState<Bill>({} as Bill)
  const queryCache = useQueryCache()
  const toast = useToast()
  const pdfState = useLoadingState()
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const { data: bill, refetch } = useQuery(`bill-${id}`, () => BillApi.findById(id), {
    enabled: id !== 'new',
  })

  const onSubmitSuccess = async (data: Bill) => {
    if (data.id !== id) {
      history.push(ROUTES.BILL_FORM.path.replace(':id', data.id))
    } else {
      queryCache.invalidateQueries('bills')
      refetch()
    }
  }

  const downloadPdf = async () => {
    try {
      if (pdfState.isIdle && bill?.id) {
        pdfState.update('loading')
        const blob = await PdfApi.getBillPdf(bill.id)
        const link = document.createElement('a')
        link.download = bill.id
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        pdfState.update('idle')
      }
    } catch {
      toast.show({
        message: 'Erreur lors de la génération du PDF',
        variant: 'error',
      })
      setTimeout(() => {
        pdfState.update('idle')
      }, 1000)
    }
  }

  useEffect(() => {
    setNewBill(bill && id !== 'new' ? bill : ({} as Bill))
  }, [bill])

  return (
    <div className="w-full">
      <Button variant="inverted-primary" className="mb-4" size="xs" onClick={history.goBack}>
        Retourner à la liste des factures
      </Button>
      <div className="flex items-center mb-8 border-b">
        <div className="flex items-end flex-grow">
          <h1 className="text-3xl">{!newBill.id ? 'Nouvelle facture' : 'Modifier une facture'}</h1>
          {newBill.status ? (
            <Badge variant="outline" className="text-xs ml-2 my-2 px-2">
              {BILL_STATUS[newBill.status]?.text}
            </Badge>
          ) : null}
        </div>
        {newBill && newBill.id ? (
          <Button
            disabled={pdfState.isLoading}
            title="Télécharger le PDF"
            onClick={downloadPdf}
            variant="primary"
            className="mb-1"
            size="sm"
            icon="document-download"
          >
            Télécharger le PDF
          </Button>
        ) : null}
      </div>
      <BillForm onSubmitSuccess={onSubmitSuccess} bill={newBill} />
    </div>
  )
}

export default BillFormPage
