import { BillApi } from '@/api/BillApi'
import { useI18n } from '@/i18n'
import Bill, { BillStatusEnum } from '@/models/Bill'
import { Button, useToast } from '@coco-ui/core'
import { CheckIcon, EnvelopeIcon, InboxArrowDownIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

type ActionsProps = {
  bill: Bill
  reloadBill: () => Promise<void>
}

export const Actions = ({ bill, reloadBill }: ActionsProps) => {
  const { t } = useI18n()
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateBillStatus = (status: BillStatusEnum) => async () => {
    setIsSubmitting(true)
    try {
      if (bill) {
        await BillApi.updateStatus({ id: bill.id, status })
        toast.success(t('bills.form.submit.edit.success'))
        await reloadBill()
      }
    } catch {
      toast.error(t('genericFormError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="grid md:grid-cols-2 gap-4 justify-end">
      {bill.status === BillStatusEnum.DRAFT ? (
        <Button
          size="md"
          type="button"
          onClick={updateBillStatus(BillStatusEnum.SENT)}
          disabled={isSubmitting}
          variant="primary"
          outline
          className="gap-4 md:col-start-2"
        >
          <EnvelopeIcon className="w-5" />
          {t('bills.form.actions.sent')}
        </Button>
      ) : null}
      {bill.status === BillStatusEnum.SENT ? (
        <>
          <Button
            size="md"
            type="button"
            onClick={updateBillStatus(BillStatusEnum.REFUSED)}
            variant="error"
            className="gap-4"
            disabled={isSubmitting}
          >
            <XMarkIcon className="w-5" />
            {t('bills.form.actions.refused')}
          </Button>
          <Button
            size="md"
            disabled={isSubmitting}
            type="button"
            onClick={updateBillStatus(BillStatusEnum.TO_DECLARE)}
            variant="success"
            className="gap-4"
          >
            <CheckIcon className="w-5" />
            {t('bills.form.actions.toDeclare')}
          </Button>
        </>
      ) : null}
      {bill.status === BillStatusEnum.TO_DECLARE ? (
        <Button
          disabled={isSubmitting}
          variant="primary"
          className="gap-4 md:col-start-2"
          size="md"
          type="button"
          onClick={updateBillStatus(BillStatusEnum.ARCHIVED)}
        >
          <InboxArrowDownIcon className="w-5" />
          {t('bills.form.actions.archive')}
        </Button>
      ) : null}
    </section>
  )
}
