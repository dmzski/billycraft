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
    toast.show(t('settings.forms.quoteCustomization.submit.success'))
  }

  useEffect(() => {
    if (quoteCustomization) {
      setNewQuoteCustomization(quoteCustomization)
    }
  }, [quoteCustomization])

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col gap-8">
      <h2 className="text-2xl">{t('settings.forms.quoteCustomization.title')}</h2>
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
              onCheckedChange={handleToggle('displayCustomerEmail')}
              label={t('display customer email')}
            />
            <Switch
              checked={newQuoteCustomization.displayCustomerPhoneNumber}
              id="displayCustomerPhoneNumber"
              onCheckedChange={handleToggle('displayCustomerPhoneNumber')}
              label={t('display customer phonenumber')}
            />
          </div>
          <div className="flex flex-col flex-grow gap-2 items-start">
            <h3>{t('compagny informations')}</h3>
            <Switch
              checked={newQuoteCustomization.displayCompanyEmail}
              id="displayCompanyEmail"
              onCheckedChange={handleToggle('displayCompanyEmail')}
              label={t('display compagny email')}
            />
            <Switch
              checked={newQuoteCustomization.displayCompanyPhoneNumber}
              id="displayCompanyPhoneNumber"
              onCheckedChange={handleToggle('displayCompanyPhoneNumber')}
              label={t('display compagny phonenumber')}
            />
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
          rows={6}
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
          helper={t('settings.forms.quoteCustomization.footer.helper')}
        />
        <Button type="submit" onClick={onSubmit}>
          {t('settings.forms.quoteCustomization.submit')}
        </Button>
      </div>
    </form>
  )
}

export default QuoteCustomizationForm
