import { Button, Input, Switch, TextArea } from '@coco-ui/core'
import { BillCustomizationApi } from 'api/BillCustomizationApi'
import { STRINGS } from 'constants/strings'
import { ContentState, EditorState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import BillCustomization from 'models/BillCustomization'
import { ChangeEvent } from 'react'
import * as React from 'react'
import { useMutation } from 'react-query'
import { useToast } from '../../../providers/ToastProvider'

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
        toast.show({ message: STRINGS.SAVE_SUCCESS, variant: 'success' })
      },
    },
  )
  const [, setAfterTableEditor] = React.useState(() =>
    EditorState.createWithContent(
      ContentState.createFromBlockArray(
        htmlToDraft(newBillCustomization.afterTable || '<div></div>').contentBlocks,
      ),
    ),
  )
  const [, setFooterEditor] = React.useState(() =>
    EditorState.createWithContent(
      ContentState.createFromBlockArray(
        htmlToDraft(newBillCustomization.footer || '<div></div>').contentBlocks,
      ),
    ),
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
      setAfterTableEditor(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            htmlToDraft(billCustomization.afterTable || '').contentBlocks,
          ),
        ),
      )
      setFooterEditor(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            htmlToDraft(billCustomization.footer || '').contentBlocks,
          ),
        ),
      )
    }
  }, [billCustomization])

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col">
      <h2 className="text-2xl">Personnalisation du PDF</h2>
      <div className="ml-4 mt-4">
        <div className="flex w-full items-center">
          <div
            className="w-10 h-10 mr-3 border-2 border-black"
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
        <div className="flex justify-around mt-3">
          <div className="flex flex-col">
            <h3>Informations du client</h3>
            <div className="mt-2 flex">
              <Switch
                checked={newBillCustomization.displayCustomerEmail}
                id="displayCustomerEmail"
                onChange={handleToggle('displayCustomerEmail')}
              >
                Afficher l&lsquo;email du client
              </Switch>
            </div>
            <div className="mt-2 flex">
              <Switch
                checked={newBillCustomization.displayCustomerPhoneNumber}
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
                checked={newBillCustomization.displayCompanyEmail}
                id="displayCompanyEmail"
                onChange={handleToggle('displayCompanyEmail')}
              >
                Afficher l&lsquo;email de mon entreprise
              </Switch>
            </div>
            <div className="mt-2 flex">
              <Switch
                checked={newBillCustomization.displayCompanyPhoneNumber}
                id="displayCompanyPhoneNumber"
                onChange={handleToggle('displayCompanyPhoneNumber')}
              >
                Afficher le téléphone de mon entreprise
              </Switch>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <TextArea
            id="afterTable"
            label="Après le tableau"
            rows={5}
            placeholder="En dessous du tableau"
            value={newBillCustomization.afterTable}
            className="w-full"
            maxLength={1000}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setNewBillCustomization({
                ...newBillCustomization,
                afterTable: e.target.value,
              })
            }
          />
        </div>
        <div className="mt-4">
          <TextArea
            label="Pied de page"
            id="footer"
            rows={5}
            className="w-full"
            placeholder="Pied de page"
            value={newBillCustomization.footer}
            maxLength={1000}
            onChange={(e: React.ChangeEvent) =>
              setNewBillCustomization({
                ...newBillCustomization,
                footer: (e.target as HTMLTextAreaElement).value,
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

export default BillCustomizationForm
