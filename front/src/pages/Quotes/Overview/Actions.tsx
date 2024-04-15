import { QuoteApi } from "@/api/QuoteApi"
import { useI18n } from "@/i18n"
import Quote, { QuoteStatusEnum } from "@/models/Quote"
import { Button, useToast } from "@coco-ui/core"
import { CheckIcon, EnvelopeIcon, InboxArrowDownIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { useState } from "react"

type ActionsProps = {
  quote: Quote,
  reloadQuote: () => Promise<void>
}

export const Actions = ({ quote, reloadQuote }: ActionsProps) => {
  const { t } = useI18n()
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateQuoteStatus = (status: QuoteStatusEnum) => async () => {
    setIsSubmitting(true)
    try {
      if (quote) {
        await QuoteApi.updateStatus({ id: quote.id, status })
        toast.success(t('quotes.form.submit.edit.success'))
        await reloadQuote()
      }
    } catch {
      toast.error(t('genericFormError'))
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <section className="grid md:grid-cols-2 gap-4 justify-end">
      {quote.id && quote.status === QuoteStatusEnum.DRAFT ? (
        <Button
          size="md"
          type="button"
          onClick={updateQuoteStatus(QuoteStatusEnum.SENT)}
          disabled={isSubmitting}
          variant='primary'
          outline
          className='gap-4 md:col-start-2'
        >
          <EnvelopeIcon className='w-5' />
          {t('quotes.form.actions.sent')}
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
            disabled={isSubmitting}
          >
            <XMarkIcon className='w-5' />
            {t('quotes.form.actions.refused')}
          </Button>
          <Button
            size="md"
            disabled={isSubmitting}
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
            disabled={isSubmitting}
            type="button"
            variant='primary'
            onClick={updateQuoteStatus(QuoteStatusEnum.DRAFT)}
          >
            {t('quotes.form.actions.backToDraft')}
          </Button>
          <Button

            disabled={isSubmitting}
            outline variant='error' className='gap-4' size="md" type="button" onClick={updateQuoteStatus(QuoteStatusEnum.ARCHIVED)}>
            <InboxArrowDownIcon className='w-5' />
            {t('quotes.form.actions.archive')}
          </Button>
        </>
      ) : null}
      {quote.status === QuoteStatusEnum.ACCEPTED ? (
        <>
          <Button
            size="md"
            disabled={isSubmitting}
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
            disabled={isSubmitting}
            size="md"
            type="button"
            onClick={updateQuoteStatus(QuoteStatusEnum.DEPOSIT_ASK)}
          >
            {t('quotes.form.actions.depositAsk')}
          </Button>
        </>
      ) : null}
      {quote.status === QuoteStatusEnum.DEPOSIT_ASK ? (
        <Button
          disabled={isSubmitting}
          variant='primary' className='gap-4 md:col-start-2' size="md" type="button" onClick={updateQuoteStatus(QuoteStatusEnum.ARCHIVED)}>
          <InboxArrowDownIcon className='w-5' />
          {t('quotes.form.actions.archive')}
        </Button>
      ) : null}
    </section>
  )
}
