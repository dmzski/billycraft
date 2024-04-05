import { Button, Input, Switch, TextArea, useToast } from '@coco-ui/core'
import { BillCustomizationApi } from '@/api/BillCustomizationApi'
import BillCustomization from '@/models/BillCustomization'
import { ChangeEvent, useEffect, useState } from 'react'
import { useI18n } from '@/i18n'

type BillCustomizationFormProps = {
  billCustomization: BillCustomization
}

const BillCustomizationForm = ({ billCustomization }: BillCustomizationFormProps) => {
  const { t } = useI18n()
  const [newBillCustomization, setNewBillCustomization] = useState({} as BillCustomization)
  const toast = useToast()

  const handleToggle = (property: keyof BillCustomization) => () => {
    setNewBillCustomization(current => ({
      ...current,
      [property]: !current[property],
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await BillCustomizationApi.updateMine(newBillCustomization)
    toast.success(t('settings.forms.billCustomization.submit.success'))
  }

  useEffect(() => {
    if (billCustomization) {
      setNewBillCustomization(billCustomization)
    }
  }, [billCustomization])

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col gap-8">
      <h2 className="text-2xl">{t('customs PDF')}</h2>
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
            label={t('settings.forms.billCustomization.mainColor.label')}
            placeholder={t('settings.forms.billCustomization.mainColor.placeholder')}
            className="w-full"
          />
        </div>
        <div className="flex">
          <div className="flex flex-grow flex-col gap-2 items-start">
            <h3>{t('customer information')}</h3>
            <Switch
              checked={newBillCustomization.displayCustomerEmail}
              id="displayCustomerEmail"
              onChange={handleToggle('displayCustomerEmail')}
            >
              {t('display customer email')}
            </Switch>
            <Switch
              checked={newBillCustomization.displayCustomerPhoneNumber}
              id="displayCustomerPhoneNumber"
              onChange={handleToggle('displayCustomerPhoneNumber')}
            >
              {t('display customer phonenumber')}
            </Switch>
          </div>
          <div className="flex flex-grow flex-col gap-2 items-start">
            <h3>{t('compagny informations')}</h3>
            <Switch
              checked={newBillCustomization.displayCompanyEmail}
              id="displayCompanyEmail"
              onChange={handleToggle('displayCompanyEmail')}
            >
              {t('display compagny email')}
            </Switch>
            <Switch
              checked={newBillCustomization.displayCompanyPhoneNumber}
              id="displayCompanyPhoneNumber"
              onChange={handleToggle('displayCompanyPhoneNumber')}
            >
              {t('display compagny phonenumber')}
            </Switch>
          </div>
        </div>
        <TextArea
          id="afterTable"
          label={t('settings.forms.billCustomization.afterTable.label')}
          rows={5}
          placeholder={t('settings.forms.billCustomization.afterTable.label')}
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
          label={t('settings.forms.billCustomization.footer.label')}
          id="footer"
          rows={5}
          className="w-full"
          placeholder={t('settings.forms.billCustomization.footer.placeholder')}
          value={newBillCustomization.footer}
          onChange={e =>
            setNewBillCustomization({
              ...newBillCustomization,
              footer: e.target.value,
            })
          }
        />
        <Button type="submit" size="md" block variant="success" onClick={onSubmit}>
          {t('save customs PDF')}
        </Button>
      </div>
    </form>
  )
}

export default BillCustomizationForm
