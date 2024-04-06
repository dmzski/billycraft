import { Button, useToast } from '@coco-ui/core'
import { Link, useHistory } from 'react-router-dom'
import { QuoteApi } from '@/api/QuoteApi'
import { ROUTES } from '@/routes'
import { QuoteFormContent, type QuoteFormValues } from '@/pages/Quotes/components/QuoteFormContent'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'
import { FormProvider, useForm } from 'react-hook-form'

const defaultQuote = {
  lines: [],
  tva: 0,
  title: "",
} as QuoteFormValues

export const Create = () => {
  const { t } = useI18n()
  const toast = useToast()
  const history = useHistory()

  const methods = useForm<QuoteFormValues>({
    shouldFocusError: true,
    mode: 'onChange',
    values: defaultQuote
  })

  const onSubmit = async (data: QuoteFormValues) => {
    const tmp = {
      ...data,
      lines: data.lines.map((line, index: number) => ({
        name: line.name,
        quoteId: line.quoteId,
        type: line.type,
        description: line.description,
        line: index + 1,
        price: line.price ? Number(`${line.price}`) : null,
        quantity: line.quantity ? Number(`${line.quantity}`) : null,
      })),
    }
    try {
      const { id } = await QuoteApi.create(tmp)
      toast.success(t('quotes.form.submit.success'))
      history.push(ROUTES.QUOTE_EDIT.path.replace(':id', id))
    } catch {
      toast.error(t('genericFormError'))
    }
  }

  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <Link className="gap-1 link link-primary flex items-center" to={ROUTES.QUOTES.path}>
        <ChevronLeftIcon className="w-5" /> {t('quotes.form.backTo')}
      </Link>
      <div className="flex items-center flex-wrap border-b pb-2">
        <div className="flex items-center gap-4 flex-grow">
          <h1 className="text-3xl">
            {t('quotes.form.title.new')}
          </h1>
        </div>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <QuoteFormContent />
        </form>
      </FormProvider>
      <Button
        size="md"
        type="submit"
        disabled={!methods.formState.isValid || methods.formState.isSubmitting}
        variant="primary"
      >
        {t('quotes.form.submit')}
      </Button>
    </div>
  )
}
