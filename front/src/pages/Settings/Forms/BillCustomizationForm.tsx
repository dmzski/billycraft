import { Button, Input, Switch, TextArea, useToast } from '@coco-ui/core'
import { BillCustomizationApi } from 'api/BillCustomizationApi'
import { STRINGS } from 'constants/strings'
import BillCustomization from 'models/BillCustomization'
import { ChangeEvent } from 'react'
import * as React from 'react'
import { useMutation } from 'react-query'

type BillCustomizationFormProps = {
  billCustomization: BillCustomization
}

const BillCustomizationForm = ({ billCustomization }: BillCustomizationFormProps): JSX.Element => {
  const [newBillCustomization, setNewBillCustomization] = React.useState<BillCustomization>(
    {} as BillCustomization,
  )
  const toast = useToast()
  const [updateBillCustomizationMutation, updateBillCustomizationMutationState] = useMutation(
    BillCustomizationApi.updateMine,
    {
      onSuccess: () => {
        toast.success(STRINGS.SAVE_SUCCESS)
      },
    },
  )

  const handleToggle = (property: keyof BillCustomization) => () => {
    setNewBillCustomization(current => ({
      ...current,
      [property]: !current[property],
    }))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!updateBillCustomizationMutationState.isLoading) {
      updateBillCustomizationMutation(newBillCustomization)
    }
  }

  React.useEffect(() => {
    if (billCustomization) {
      setNewBillCustomization(billCustomization)
    }
  }, [billCustomization])

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col gap-8">
      <h2 className="text-2xl">Personnalisation du PDF</h2>
      <div className="ml-4 flex flex-col gap-8">
        <div className="flex w-full items-center gap-4">
          <div
            className="w-10 h-10 border-2 border-base-300"
            style={{
              backgroundColor: newBillCustomization.mainColor || 'white',
            }}
          />
          <Input
            id="mainColor"
            value={newBillCustomization.mainColor}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNewBillCustomization({
                ...newBillCustomization,
                mainColor: e.target.value,
              })
            }}
            label="Couleur principale"
            placeholder="Couleur en hexadecimale : #000000"
            className="w-full"
          />
        </div>
        <div className="flex">
          <div className="flex flex-grow flex-col gap-2 items-start">
            <h3>Informations du client</h3>
            <Switch
              checked={newBillCustomization.displayCustomerEmail}
              id="displayCustomerEmail"
              onChange={handleToggle('displayCustomerEmail')}
            >
              Afficher l&lsquo;email du client
            </Switch>
            <Switch
              checked={newBillCustomization.displayCustomerPhoneNumber}
              id="displayCustomerPhoneNumber"
              onChange={handleToggle('displayCustomerPhoneNumber')}
            >
              Afficher le téléphone du client
            </Switch>
          </div>
          <div className="flex flex-grow flex-col gap-2 items-start">
            <h3>Informations de l&lsquo;entreprise</h3>
            <Switch
              checked={newBillCustomization.displayCompanyEmail}
              id="displayCompanyEmail"
              onChange={handleToggle('displayCompanyEmail')}
            >
              Afficher l&lsquo;email de mon entreprise
            </Switch>
            <Switch
              checked={newBillCustomization.displayCompanyPhoneNumber}
              id="displayCompanyPhoneNumber"
              onChange={handleToggle('displayCompanyPhoneNumber')}
            >
              Afficher le téléphone de mon entreprise
            </Switch>
          </div>
        </div>
        <TextArea
          id="afterTable"
          label="Après le tableau"
          rows={5}
          placeholder="En dessous du tableau"
          value={newBillCustomization.afterTable}
          className="w-full"
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setNewBillCustomization({
              ...newBillCustomization,
              afterTable: e.target.value,
            })
          }
        />
        <TextArea
          label="Pied de page"
          id="footer"
          rows={5}
          className="w-full"
          placeholder="Pied de page"
          value={newBillCustomization.footer}
          onChange={(e: React.ChangeEvent) =>
            setNewBillCustomization({
              ...newBillCustomization,
              footer: (e.target as HTMLTextAreaElement).value,
            })
          }
        />
        <Button
          type="submit"
          size="md"
          block
          variant="success"
          disabled={updateBillCustomizationMutationState.isLoading}
          onClick={onSubmit}
        >
          Enregister la personnalisation du PDF
        </Button>
      </div>
    </form>
  )
}

export default BillCustomizationForm
