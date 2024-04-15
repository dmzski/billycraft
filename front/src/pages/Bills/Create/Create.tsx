import { Button, useToast } from '@coco-ui/core'
import { Link, useHistory } from 'react-router-dom'
import { BillApi } from '@/api/BillApi'
import { ROUTES } from '@/routes'
import { BillFormContent, type BillFormValues } from '@/pages/Bills/components/BillFormContent'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'
import { FormProvider, useForm } from 'react-hook-form'
import { BillCreateRequest } from '@/models/dtos/BillCreateRequest'

const defaultBill = {
  lines: [],
  tva: 0,
  title: "",
  customerId: 0
} as BillFormValues

export const Create = () => {
  const { t } = useI18n()
  const toast = useToast()
  const { push } = useHistory()

  const methods = useForm<BillFormValues>({
    shouldFocusError: true,
    mode: 'onChange',
    values: defaultBill
  })

  const onSubmit = async (data: BillFormValues) => {
    const tmp: BillCreateRequest = {
      ...data,
      lines: data.lines.map((line, index: number) => ({
        name: line.name,
        billId: line.billId,
        type: line.type,
        description: line.description,
        line: index + 1,
        price: line.price ? Number(`${line.price}`) : undefined,
        quantity: line.quantity ? Number(`${line.quantity}`) : undefined,
      })),
    }
    try {
      const { id } = await BillApi.create(tmp)
      toast.success(t('bills.form.submit.success'))
      push(ROUTES.BILL_OVERVIEW.path({ id }))
    } catch {
      toast.error(t('genericFormError'))
    }
  }

  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <Link className="gap-1 link link-primary flex items-center" to={ROUTES.BILLS.path}>
        <ChevronLeftIcon className="w-5" /> {t('bills.form.backTo')}
      </Link>
      <div className="flex items-center flex-wrap border-b pb-2">
        <div className="flex items-center gap-4 flex-grow">
          <h1 className="text-3xl">
            {t('bills.form.title.new')}
          </h1>
        </div>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <BillFormContent />
          <Button
            size="md"
            type="submit"
            disabled={!methods.formState.isValid || methods.formState.isSubmitting}
            variant="primary"
          >
            {t('bills.form.submit')}
          </Button>
        </form>
      </FormProvider>
    </div>
  )
}
