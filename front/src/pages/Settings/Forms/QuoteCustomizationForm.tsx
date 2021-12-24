import { Button, Input, Switch, TextArea, useToast } from '@coco-ui/core'
import { QuoteCustomizationApi } from 'api/QuoteCustomizationApi'
import { STRINGS } from 'constants/strings'
import QuoteCustomization from 'models/QuoteCustomization'
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useMutation } from 'react-query'

type QuoteCustomizationFormProps = {
  quoteCustomization: QuoteCustomization
}
const QuoteCustomizationForm = ({
  quoteCustomization,
}: QuoteCustomizationFormProps): JSX.Element => {
  const [newQuoteCustomization, setNewQuoteCustomization] = useState<QuoteCustomization>(
    {} as QuoteCustomization,
  )
  const toast = useToast()
  const [updateQuoteCustomizationMutation, updateQuoteCustomizationMutationState] = useMutation(
    QuoteCustomizationApi.updateMine,
    {
      onSuccess: () => {
        toast.success(STRINGS.SAVE_SUCCESS)
      },
    },
  )

  const handleToggle = (property: keyof QuoteCustomization) => () => {
    setNewQuoteCustomization(current => ({
      ...current,
      [property]: !current[property],
    }))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!updateQuoteCustomizationMutationState.isLoading) {
      updateQuoteCustomizationMutation(newQuoteCustomization)
    }
  }

  useEffect(() => {
    if (quoteCustomization) {
      setNewQuoteCustomization(quoteCustomization)
    }
  }, [quoteCustomization])

  return (
    <form onSubmit={onSubmit} className="w-full">
      <h2 className="text-2xl">Personnalisation du PDF</h2>
      <div className="ml-4">
        <div className="flex mt-4 w-full content-center items-center">
          <div
            className="w-10 h-10 mr-4 border-2 border-black"
            style={{
              backgroundColor: newQuoteCustomization.mainColor || 'white',
            }}
          />
          <Input
            id="mainColor"
            value={newQuoteCustomization.mainColor}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNewQuoteCustomization({
                ...newQuoteCustomization,
                mainColor: e.target.value,
              })
            }}
            label="Couleur principale"
            placeholder="Couleur en hexadecimale : #000000"
            className="w-full"
          />
        </div>
        <div className="flex justify-around mt-3">
          <div className="flex flex-col">
            <h3>Informations du client</h3>
            <div className="mt-2 flex">
              <Switch
                checked={newQuoteCustomization.displayCustomerEmail}
                id="displayCustomerEmail"
                onChange={handleToggle('displayCustomerEmail')}
              >
                Afficher l&lsquo;email du client
              </Switch>
            </div>
            <div className="mt-2 flex">
              <Switch
                checked={newQuoteCustomization.displayCustomerPhoneNumber}
                id="displayCustomerPhoneNumber"
                onChange={handleToggle('displayCustomerPhoneNumber')}
              >
                Afficher le téléphone du client
              </Switch>
            </div>
          </div>
          <div className="flex flex-col">
            <h3>Informations de l&lsquo;entreprise</h3>
            <div className="mt-2 flex">
              <Switch
                checked={newQuoteCustomization.displayCompanyEmail}
                id="displayCompanyEmail"
                onChange={handleToggle('displayCompanyEmail')}
              >
                Afficher l&lsquo;email de mon entreprise
              </Switch>
            </div>
            <div className="mt-2 flex">
              <Switch
                checked={newQuoteCustomization.displayCompanyPhoneNumber}
                id="displayCompanyPhoneNumber"
                onChange={handleToggle('displayCompanyPhoneNumber')}
              >
                Afficher le téléphone de mon entreprise
              </Switch>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <TextArea
            id="afterTable"
            rows={5}
            label="Après le tableau"
            placeholder="En dessous du tableau"
            value={newQuoteCustomization.afterTable}
            className="w-full"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setNewQuoteCustomization({
                ...newQuoteCustomization,
                afterTable: e.target.value,
              })
            }
          />
        </div>
        <div className="mt-4">
          <TextArea
            id="footer"
            rows={5}
            label="Pied de page"
            className="w-full"
            placeholder="Pied de page"
            value={newQuoteCustomization.footer}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setNewQuoteCustomization({
                ...newQuoteCustomization,
                footer: e.target.value,
              })
            }
          />
        </div>
        <Button type="submit" size="md" className="mt-4" onClick={onSubmit}>
          Enregister la personnalisation du PDF
        </Button>
      </div>
    </form>
  )
}

export default QuoteCustomizationForm
