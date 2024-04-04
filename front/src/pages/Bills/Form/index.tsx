import { Badge, Button, useToast } from '@coco-ui/core'
import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { PdfApi } from '@/api/PdfApi'
import useLoadingState from '@/hooks/useLoadingState'
import Bill from '@/models/Bill'
import { ROUTES } from '@/routes'
import BillForm from './Form'
import { ChevronLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'
import { useBillByIdQuery } from '@/queries/useBillByIdQuery'

const BillFormPage = () => {
  const { t } = useI18n()
  const [newBill, setNewBill] = useState<Bill>({} as Bill)
  const toast = useToast()
  const pdfState = useLoadingState()
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const { data: bill, reload } = useBillByIdQuery(id, {
    enabled: id !== 'new',
  })

  const onSubmitSuccess = async (data: Bill) => {
    if (data.id !== id) {
      history.push(ROUTES.BILL_FORM.path.replace(':id', data.id))
    } else {
      reload()
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
      toast.error(t('bills.form.pdfError'))
      setTimeout(() => {
        pdfState.update('idle')
      }, 1000)
    }
  }

  useEffect(() => {
    setNewBill(bill && id !== 'new' ? bill : ({} as Bill))
  }, [bill, id])

  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <Button className="gap-1" variant="ghost" onClick={history.goBack}>
          <ChevronLeftIcon className="w-5" />
          <span>{t('bills.form.backTo')}</span>
        </Button>
      </div>
      <div className="flex items-center flex-wrap border-b pb-2">
        <div className="flex items-center flex-grow gap-2">
          <h1 className="text-3xl">
            {!newBill.id ? t('bills.form.title.new') : t('bills.form.title.edit')}
          </h1>
          {newBill.status ? (
            <Badge variant="info" size="sm">
              {t(`bills.status.${newBill.status}`)}
            </Badge>
          ) : null}
        </div>
        {newBill?.id !== undefined ? (
          <Button
            disabled={pdfState.isLoading}
            onClick={downloadPdf}
            variant="primary"
            className="gap-1"
          >
            <DocumentArrowDownIcon className="w-5" />
            <span>{t('bills.form.downloadPdfButton')}</span>
          </Button>
        ) : null}
      </div>
      <BillForm onSubmitSuccess={onSubmitSuccess} bill={newBill} />
    </div>
  )
}

export default BillFormPage
