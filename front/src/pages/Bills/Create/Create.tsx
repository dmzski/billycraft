import { useToast } from '@coco-ui/core'
import { useHistory } from 'react-router-dom'
import { BillApi } from '@/api/BillApi'
import { ROUTES } from '@/routes'
import { BillFormContent, type BillFormValues } from '@/pages/Bills/components/BillFormContent'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'
import { FormProvider, useForm } from 'react-hook-form'
import { BillCreateRequest } from '@/models/dtos/BillCreateRequest'
import { RRLink } from '@/components/RRLink'
import { Submit } from '@/components/form/Submit'

const defaultBill = {
  lines: [],
  tva: 0,
  title: '',
  customerId: '',
} as BillFormValues

export const Create = () => {
  const { t } = useI18n()
  const toast = useToast()
  const { push } = useHistory()

  const methods = useForm<BillFormValues>({
    shouldFocusError: false,
    mode: 'onChange',
    values: defaultBill,
  })

  const onSubmit = async (data: BillFormValues) => {
    const tmp: BillCreateRequest = {
      ...data,
      lines: data.lines.map((line, index: number) => ({
        ...line,
        line: index + 1,
        price: line.price ? Number(`${line.price}`) : undefined,
        quantity: line.quantity ? Number(`${line.quantity}`) : undefined,
      })),
    }
    try {
      const { id } = await BillApi.create(tmp)
      toast.show(t('bills.form.submit.success'))
      push(ROUTES.BILL_OVERVIEW.path({ id }))
    } catch {
      toast.destructive(t('genericFormError'))
    }
  }

  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <RRLink className="gap-1 flex items-center" to={ROUTES.BILLS.path}>
        <ChevronLeftIcon className="size-5" />
        <span>{t('bills.form.backTo')}</span>
      </RRLink>
      <div className="flex items-center flex-wrap border-b pb-2">
        <div className="flex items-center gap-4 flex-grow">
          <h1 className="text-3xl">{t('bills.form.title.new')}</h1>
        </div>
      </div>
      <FormProvider {...methods}>
        <form noValidate onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <BillFormContent />
          <Submit>{t('bills.form.submit')}</Submit>
        </form>
      </FormProvider>
    </div>
  )
}
