import { Button, Input, Switch, TextArea } from '@coco-ui/core'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import QuoteEmailCustomization from '@/models/QuoteEmailCustomization'
import { useI18n } from '@/i18n'

const defaultValues = {
  body: '',
  object: '',
  sendAutomatically: false,
} as QuoteEmailCustomization

type QuoteEmailCustomizationFormProps = {
  quoteEmailCustomization: QuoteEmailCustomization
  onSubmit: (e: FormEvent, data: QuoteEmailCustomization) => void
}
const QuoteEmailCustomizationForm = ({
  quoteEmailCustomization,
  onSubmit,
}: QuoteEmailCustomizationFormProps) => {
  const {t}=useI18n()
  const [
    newQuoteEmailCustomization,
    setNewQuoteEmailCustomization,
  ] = useState(quoteEmailCustomization ?? defaultValues)

  useEffect(() => {
    setNewQuoteEmailCustomization(quoteEmailCustomization ?? defaultValues)
  }, [quoteEmailCustomization])

  const handleToggle = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setNewQuoteEmailCustomization({
      ...newQuoteEmailCustomization,
      [field]: e.target.checked,
    })
  }

  return (
    <form onSubmit={e => onSubmit(e, newQuoteEmailCustomization)} className="w-full">
      <h2 className="text-2xl">{t('email customs')}</h2>
      <div className="ml-4">
        <div className="my-4 flex">
          <Switch
            labelPosition="right"
            checked={newQuoteEmailCustomization.sendAutomatically}
            id="sendQuoteAutomatically"
            onChange={handleToggle('sendAutomatically')}
          >
            <div className="ml-2">
              {t('send email automatically when the quote goes to status sent')}
            </div>
          </Switch>
        </div>
        <div className="bg-info-200 rounded text-info-700 p-3 mb-3">
          <p className="underline">{t('Tips')} :</p>
          <ul className="list-inside list-disc">
            <li>{t('To insert the quote number enter : #QUOTE_ID#')}</li>
            <li>{t('To insert the quote title enter : #QUOTE_TITLE#')}</li>
          </ul>
        </div>
        <div>
          <Input
            id="email-subject"
            label={t("settings.forms.quoteemailcustomizationform.email-subject.label")}
            value={newQuoteEmailCustomization.object}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewQuoteEmailCustomization({
                ...newQuoteEmailCustomization,
                object: e.target.value,
              })
            }
            placeholder="Devis #QUOTE_ID# : #QUOTE_TITLE#"
            className="border-2 border-gray-200 p-3 w-full rounded"
          />
        </div>
        <div className="mt-2">
          <TextArea
            id="email-body"
            label={t("settings.forms.quoteemailcustomizationform.email-body.label")}
            rows={5}
            value={newQuoteEmailCustomization.body}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setNewQuoteEmailCustomization({
                ...newQuoteEmailCustomization,
                body: e.target.value,
              })
            }
            placeholder="Vous trouvez en pièce jointe le devis #QUOTE_ID# concernant #QUOTE_TITLE#.&#10;Cordialement,"
            className="border-2 border-gray-200 p-3 w-full rounded"
          />
        </div>
        <Button type="submit" size="md" className="mt-4">
          {t('Save email customizations')}
        </Button>
      </div>
    </form>
  )
}

export default QuoteEmailCustomizationForm
