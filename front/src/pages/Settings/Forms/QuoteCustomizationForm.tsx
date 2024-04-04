import { Button, Input, Switch, TextArea, useToast } from '@coco-ui/core'
import { QuoteCustomizationApi } from '@/api/QuoteCustomizationApi'
import QuoteCustomization from '@/models/QuoteCustomization'
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useI18n } from '@/i18n'

type QuoteCustomizationFormProps = {
  quoteCustomization: QuoteCustomization
}
const QuoteCustomizationForm = ({ quoteCustomization }: QuoteCustomizationFormProps) => {
  const { t } = useI18n()
  const [newQuoteCustomization, setNewQuoteCustomization] = useState<QuoteCustomization>(
    {} as QuoteCustomization,
  )
  const toast = useToast()

  const handleToggle = (property: keyof QuoteCustomization) => () => {
    setNewQuoteCustomization(current => ({
      ...current,
      [property]: !current[property],
    }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await QuoteCustomizationApi.updateMine(newQuoteCustomization)
    toast.success(t('settings.forms.quoteCustomization.submit.success'))
  }

  useEffect(() => {
    if (quoteCustomization) {
      setNewQuoteCustomization(quoteCustomization)
    }
  }, [quoteCustomization])

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col gap-8">
      <h2 className="text-2xl">{t('customs PDF')}</h2>
      <div className="ml-4 flex flex-col gap-8">
        <div className="flex gap-4 w-full content-center items-center">
          <div
            className="w-10 h-10 border-2 border-black"
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
            label={t('settings.forms.quoteCustomization.mainColor.label')}
            placeholder={t('settings.forms.quoteCustomization.mainColor.placeholder')}
            className="w-full"
          />
        </div>
        <div className="flex">
          <div className="flex flex-col flex-grow gap-2 items-start">
            <h3>{t('customer information')}</h3>
            <Switch
              checked={newQuoteCustomization.displayCustomerEmail}
              id="displayCustomerEmail"
              onChange={handleToggle('displayCustomerEmail')}
            >
              {t('display customer email')}
            </Switch>
            <Switch
              checked={newQuoteCustomization.displayCustomerPhoneNumber}
              id="displayCustomerPhoneNumber"
              onChange={handleToggle('displayCustomerPhoneNumber')}
            >
              {t('display customer phonenumber')}
            </Switch>
          </div>
          <div className="flex flex-col flex-grow gap-2 items-start">
            <h3>{t('compagny informations')}</h3>
            <Switch
              checked={newQuoteCustomization.displayCompanyEmail}
              id="displayCompanyEmail"
              onChange={handleToggle('displayCompanyEmail')}
            >
              {t('display compagny email')}
            </Switch>
            <Switch
              checked={newQuoteCustomization.displayCompanyPhoneNumber}
              id="displayCompanyPhoneNumber"
              onChange={handleToggle('displayCompanyPhoneNumber')}
            >
              {t('display compagny phonenumber')}
            </Switch>
          </div>
        </div>
        <TextArea
          id="afterTable"
          rows={5}
          label={t('settings.forms.quoteCustomization.afterTable.label')}
          placeholder={t('settings.forms.quoteCustomization.afterTable.placeholder')}
          value={newQuoteCustomization.afterTable}
          className="w-full"
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setNewQuoteCustomization({
              ...newQuoteCustomization,
              afterTable: e.target.value,
            })
          }
        />
        <TextArea
          id="footer"
          rows={5}
          label={t('settings.forms.quoteCustomization.footer.label')}
          className="w-full"
          placeholder={t('settings.forms.quoteCustomization.footer.placeholder')}
          value={newQuoteCustomization.footer}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setNewQuoteCustomization({
              ...newQuoteCustomization,
              footer: e.target.value,
            })
          }
        />
        <Button type="submit" variant="success" block size="md" onClick={onSubmit}>
          {t('save customs PDF')}
        </Button>
      </div>
    </form>
  )
}

export default QuoteCustomizationForm
