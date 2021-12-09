import { Button, Input, Switch, TextArea } from '@coco-ui/core'
import { ChangeEvent, FormEvent } from 'react';
import * as React from 'react';
import QuoteEmailCustomization from '../../../models/QuoteEmailCustomization'

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
}: QuoteEmailCustomizationFormProps): JSX.Element => {
  const [
    newQuoteEmailCustomization,
    setNewQuoteEmailCustomization,
  ] = React.useState<QuoteEmailCustomization>(quoteEmailCustomization || defaultValues)

  React.useEffect(() => {
    setNewQuoteEmailCustomization(quoteEmailCustomization || defaultValues)
  }, [quoteEmailCustomization])

  const handleToggle = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setNewQuoteEmailCustomization({
      ...newQuoteEmailCustomization,
      [field]: e.target.checked,
    })
  }

  return (
    <form onSubmit={e => onSubmit(e, newQuoteEmailCustomization)} className="w-full">
      <h2 className="text-2xl">Personnalisation de l&lsquo;email</h2>
      <div className="ml-4">
        <div className="my-4 flex">
          <Switch
            labelPosition="right"
            checked={newQuoteEmailCustomization.sendAutomatically}
            id="sendQuoteAutomatically"
            onChange={handleToggle('sendAutomatically')}
          >
            <div className="ml-2">
              Envoyer l&lsquo;email automatiquement lorsque le devis passe au status
              &ldquo;Envoyé&ldquo;
            </div>
          </Switch>
        </div>
        <div className="bg-info-200 rounded text-info-700 p-3 mb-3">
          <p className="underline">Astuces :</p>
          <ul className="list-inside list-disc">
            <li>Pour insérer le numéro du devis entrez : #QUOTE_ID#</li>
            <li>Pour insérer le titre du devis entrez : #QUOTE_TITLE#</li>
          </ul>
        </div>
        <div>
          <Input
            id="email-subject"
            label="Objet du mail"
            value={newQuoteEmailCustomization.object}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
            label="Corps du mail"
            rows={5}
            value={newQuoteEmailCustomization.body}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
          Enregistrer la personnalisation de l&lsquo;email
        </Button>
      </div>
    </form>
  )
}

export default QuoteEmailCustomizationForm
