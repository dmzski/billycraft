import { Badge, Button, Icon, useToast } from '@coco-ui/core'
import { useState, useEffect } from 'react'
import { useQuery, useQueryCache } from 'react-query'
import { useHistory, useParams } from 'react-router-dom'
import { BillApi } from 'api/BillApi'
import { BILL_STATUS } from 'constants/bill'
import { PdfApi } from '../../../api/PdfApi'
import useLoadingState from '../../../hooks/useLoadingState'
import Bill from '../../../models/Bill'
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
      toast.error('Erreur lors de la génération du PDF')
      setTimeout(() => {
        pdfState.update('idle')
      }, 1000)
    }
  }

  useEffect(() => {
    setNewBill(bill && id !== 'new' ? bill : ({} as Bill))
  }, [bill])

  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <Button variant="ghost" onClick={history.goBack}>
          <Icon name="chevron-left" />
          &nbsp; Retourner à la liste des factures
        </Button>
      </div>
      <div className="flex items-center flex-wrap border-b pb-2">
        <div className="flex items-center flex-grow gap-2">
          <h1 className="text-3xl">{!newBill.id ? 'Nouvelle facture' : 'Modifier une facture'}</h1>
          {newBill.status ? (
            <Badge variant="info" size="sm">
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
          >
            <Icon name="document-download" />
            &nbsp; Télécharger le PDF
          </Button>
        ) : null}
      </div>
      <BillForm onSubmitSuccess={onSubmitSuccess} bill={newBill} />
    </div>
  )
}

export default BillFormPage
