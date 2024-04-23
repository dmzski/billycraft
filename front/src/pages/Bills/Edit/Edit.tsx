import { Button, Loader, useToast } from '@coco-ui/core'
import { Link, Redirect, useHistory, useParams } from 'react-router-dom'
import { BillApi } from '@/api/BillApi'
import { BillStatusEnum } from '@/models/Bill'
import { ROUTES } from '@/routes'
import { BillFormContent } from '@/pages/Bills/components/BillFormContent'
import { ChevronLeftIcon, CreditCardIcon } from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'
import { useBillByIdQuery } from '@/queries/useBillByIdQuery'
import { BillFormValues } from '../components/BillFormContent'
import { FormProvider, useForm } from 'react-hook-form'
import { BillUpdateRequest } from '@/models/dtos/BillUpdateRequest'
import { calculatePriceTTC } from '@/utils/price'
import { useMemo } from 'react'

const defaultBill = {
  lines: [],
  tva: 0,
  title: '',
  customerId: '',
} as BillFormValues

export const Edit = () => {
  const { t } = useI18n()
  const toast = useToast()
  const { push } = useHistory()
  const { id } = useParams<{ id: string }>()
  const { data: bill, isLoading } = useBillByIdQuery(id, {
    enabled: !!id,
  })

  const onSubmit = async (data: BillFormValues) => {
    const tmp: BillUpdateRequest = {
      id: bill?.id ?? '',
      ...data,
      lines: data.lines.map((line, index: number) => ({
        ...line,
        line: index + 1,
        price: line.price ? Number(`${line.price}`) : undefined,
        quantity: line.quantity ? Number(`${line.quantity}`) : undefined,
      })),
    }
    try {
      if (bill?.id) {
        await BillApi.update(tmp)
        toast.success(t('bills.form.submit.success'))
        push(ROUTES.BILL_OVERVIEW.path({ id: bill.id }))
      }
    } catch {
      toast.error(t('genericFormError'))
    }
  }

  const initialValues: BillFormValues = useMemo(
    () =>
      bill
        ? {
            ...bill,
            lines: bill.lines.map(({ price, ...rest }) => ({
              ...rest,
              price,
              itPrice: calculatePriceTTC(price, bill.tva),
            })),
          }
        : defaultBill,
    [bill],
  )

  const methods = useForm<BillFormValues>({
    shouldFocusError: false,
    mode: 'onChange',
    values: initialValues,
    disabled: !!(bill && bill.status !== BillStatusEnum.DRAFT),
  })

  const { isValid, isSubmitting, disabled } = methods.formState

  if (!bill && isLoading) {
    return <Loader />
  }

  if (!bill) {
    return t('genericDataLoadError')
  }

  if (bill.status !== BillStatusEnum.DRAFT) {
    return <Redirect to={ROUTES.BILL_OVERVIEW.path({ id: bill.id })} />
  }

  return (
    <div className="flex flex-col gap-10">
      <Link
        className="gap-1 link-hover link-primary flex items-center"
        to={ROUTES.BILL_OVERVIEW.path({ id: bill.id })}
      >
        <ChevronLeftIcon className="w-5" /> {t('bills.form.edit.backTo')}
      </Link>
      <h1 className="text-4xl font-bold flex gap-5 items-center">
        <CreditCardIcon className="w-14 p-3 text-primary bg-primary-content mask mask-squircle" />
        <span>{bill.name}</span>
      </h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <BillFormContent bill={bill} />
          {!bill.id || bill.status === BillStatusEnum.DRAFT || !bill.status ? (
            <Button
              size="md"
              type="submit"
              disabled={!isValid || isSubmitting || disabled}
              variant="primary"
            >
              {t('bills.form.submit')}
            </Button>
          ) : null}
        </form>
      </FormProvider>
    </div>
  )
}
