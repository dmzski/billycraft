import { useMemo, useEffect } from 'react'
import { Button, Input, Select, useToast } from '@coco-ui/core'
import { Controller, useForm } from 'react-hook-form'
import { BillApi } from '@/api/BillApi'
import { Prompt } from 'react-router-dom'
import useCustomers from '@/hooks/useCustomers'
import Bill, { BillStatusEnum, BillLine } from '@/models/Bill'
import BillLineTable from './BillLineTable'
import {
  ArchiveBoxArrowDownIcon,
  EnvelopeIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/solid'
import { useI18n } from '@/i18n'

export type BillFormValues = {
  lines: Array<BillLine & { id: string }>
} & Omit<Bill, 'lines'>

const defaultBill = {} as Partial<BillFormValues>

type BillFormProps = {
  bill: Bill
  onSubmitSuccess: (res: Bill) => Promise<void> | void
}

const BillForm = ({ bill, onSubmitSuccess }: BillFormProps) => {
  const { t } = useI18n()
  const toast = useToast()
  const customers = useCustomers()
  const {
    handleSubmit,
    control,
    formState: { isValidating, isSubmitting, isDirty },
    reset,
  } = useForm<BillFormValues>({
    reValidateMode: 'onChange',
    mode: 'onSubmit',
    shouldUseNativeValidation: false,
    shouldFocusError: true,
    defaultValues: defaultBill,
  })

  const updateBillStatus = (status: BillStatusEnum) => async () => {
    try {
      const res = await BillApi.updateStatus({ id: bill.id, status })
      toast.success(t('bills.form.submit.edit.success'))
      onSubmitSuccess(res as Bill)
    } catch {
      toast.error(t('genericFormError'))
    }
  }

  const onSubmit = async (data: BillFormValues) => {
    const tmp: Bill = {
      ...data,
      lines: data.lines.map((line: BillLine, index: number) => ({
        billId: line.billId,
        description: line.description,
        name: line.name,
        type: line.type,
        line: index + 1,
        price: line.price ? Number(`${line.price}`) : null,
        quantity: line.quantity ? Number(`${line.quantity}`) : null,
      })),
    }
    try {
      const res = await BillApi.createOrUpdate(tmp)
      reset(res)
      onSubmitSuccess(res)
      toast.success(t('bills.form.submit.success'))
    } catch {
      toast.error(t('genericFormError'))
    }
  }

  const disabled = useMemo(() => !!(bill.id && bill.status !== BillStatusEnum.DRAFT), [bill])

  const customerOptions = useMemo(() => {
    const array = []
    if (customers) {
      array.push(
        ...customers
          .filter(({ deleted }) => !deleted)
          .map(customer => ({
            value: customer.id,
            label: customer.name,
          })),
      )
    }
    if (bill.customerId && !array.find(({ value }) => value === bill.customerId)) {
      const customer = customers.find(({ id }) => id === bill.customerId)
      if (customer) array.push({ value: customer.id, label: customer.name })
    }

    return array
  }, [customers, bill])

  useEffect(() => {
    if (bill) {
      reset(bill)
    }
  }, [reset, bill])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Prompt when={isDirty} message={t('bills.form.exitWarning')} />
      <Controller
        name="title"
        control={control}
        rules={{ required: true, minLength: 3 }}
        render={({ field, fieldState: { invalid } }) => (
          <Input
            label={t('bills.form.fields.title.label')}
            disabled={disabled}
            error={invalid}
            placeholder={t('bills.form.fields.title.placeholder')}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            value={field.value}
            ref={field.ref}
            required
          />
        )}
      />
      <Controller
        name="customerId"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState: { invalid } }) => (
          <Select
            tabIndex={0}
            error={invalid}
            label={t('bills.form.fields.customerId.label')}
            autoComplete="off"
            id="customer-select"
            name={field.name}
            disabled={disabled}
            onChange={field.onChange}
            options={customerOptions}
            placeholder={t('bills.form.fields.customerId.placeholder')}
            value={field.value}
            isSearchable
            ref={field.ref}
            required
          />
        )}
      />
      <Controller
        name="tva"
        control={control}
        rules={{ min: 0, max: 100 }}
        render={({ field, fieldState: { invalid } }) => (
          <Input
            label={t('bills.form.fields.vat.label')}
            disabled={disabled}
            placeholder={t('bills.form.fields.vat.placeholder')}
            type="number"
            value={field.value}
            name={field.name}
            onChange={e => field.onChange(Number(e.target.value))}
            onBlur={field.onBlur}
            error={invalid}
            ref={field.ref}
          />
        )}
      />
      <BillLineTable control={control} disabled={disabled} />
      <div className="flex flex-row-reverse gap-4">
        {!bill.id || bill.status === BillStatusEnum.DRAFT || !bill.status ? (
          <Button
            size="md"
            type="submit"
            variant="success"
            disabled={isValidating || isSubmitting || disabled}
          >
            {t('bills.form.submit')}
          </Button>
        ) : null}
        {bill.id && bill.status === BillStatusEnum.DRAFT ? (
          <Button
            size="md"
            variant="info"
            type="button"
            onClick={updateBillStatus(BillStatusEnum.SENT)}
            disabled={disabled}
            className="gap-1"
          >
            <EnvelopeIcon className="w-5" />
            <span>{t('bills.form.actions.sent')}</span>
          </Button>
        ) : null}
        {bill.status === BillStatusEnum.SENT ? (
          <>
            <Button
              size="md"
              type="button"
              variant="success"
              onClick={updateBillStatus(BillStatusEnum.PAYMENT_PAID)}
              className="gap-1"
            >
              <HandThumbUpIcon className="w-5" />
              <span>{t('bills.form.actions.paid')}</span>
            </Button>
            <Button
              size="md"
              type="button"
              variant="error"
              onClick={updateBillStatus(BillStatusEnum.REFUSED)}
              className="gap-1"
            >
              <HandThumbDownIcon className="w-5" />
              <span>{t('bills.form.actions.refused')}</span>
            </Button>
          </>
        ) : null}
        {bill.status === BillStatusEnum.PAYMENT_PAID ? (
          <Button
            size="md"
            type="button"
            className="gap-1"
            onClick={updateBillStatus(BillStatusEnum.ARCHIVED)}
          >
            <ArchiveBoxArrowDownIcon className="w-5" />
            <span>{t('bills.form.actions.archive')}</span>
          </Button>
        ) : null}
      </div>
    </form>
  )
}

export default BillForm
