import { useMemo, useEffect } from 'react'
import { useMutation } from 'react-query'
import { Button, Icon, Input, Select, useToast } from '@coco-ui/core'
import { Controller, useForm } from 'react-hook-form'
import { BillApi } from 'api/BillApi'
import { Prompt } from 'react-router-dom'
import useCustomers from 'hooks/useCustomers'
import { STRINGS } from 'constants/strings'
import Bill, { BillStatusEnum, BillLine } from '../../../models/Bill'
import BillLineTable from './BillLineTable'

export type BillFormValues = {
  lines: Array<BillLine & { id: string }>
} & Omit<Bill, 'lines'>

const defaultBill = {} as Partial<BillFormValues>

type BillFormProps = {
  bill: Bill
  onSubmitSuccess: (res: Bill) => Promise<void> | void
}

const BillForm = ({ bill, onSubmitSuccess }: BillFormProps): JSX.Element => {
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
  const [updateBillStatusMutation, { isLoading: isUpdatingStatus }] = useMutation(
    BillApi.updateStatus,
  )

  const updateBillStatus = (status: BillStatusEnum) => async () => {
    try {
      const res = await updateBillStatusMutation({ id: bill.id, status })
      toast.success(STRINGS.SAVE_SUCCESS)
      onSubmitSuccess(res as Bill)
    } catch {
      toast.error(STRINGS.SAVE_ERROR)
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
      toast.success(STRINGS.SAVE_SUCCESS)
    } catch {
      toast.error(STRINGS.SAVE_ERROR)
    }
  }

  const disabled = useMemo(
    () => !!((bill.id && bill.status !== BillStatusEnum.DRAFT) || isUpdatingStatus),
    [bill, isUpdatingStatus],
  )

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
      <Prompt
        when={isDirty}
        message="Attention ! Certaines modifications ne sont pas enregistrées"
      />
      <Controller
        name="title"
        control={control}
        rules={{ required: true, minLength: 3 }}
        render={({ field, fieldState: { invalid } }) => (
          <Input
            label="Titre"
            disabled={disabled}
            error={invalid}
            placeholder="Titre du devis"
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
            label="Sélectionner un client *"
            variant="outside"
            id="customer-select"
            name={field.name}
            disabled={disabled}
            onChange={field.onChange}
            options={customerOptions}
            placeholder="Nom du client"
            value={field.value}
            isSearchable
            isLoading={!customers}
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
            label="TVA (%)"
            disabled={disabled}
            placeholder="TVA en %"
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
            <Icon name="save" />
            &nbsp; Enregistrer
          </Button>
        ) : null}
        {bill.id && bill.status === BillStatusEnum.DRAFT ? (
          <Button
            size="md"
            variant="info"
            type="button"
            onClick={updateBillStatus(BillStatusEnum.SENT)}
            disabled={disabled}
          >
            <Icon name="mail" />
            &nbsp; Envoyer la facture
          </Button>
        ) : null}
        {bill.status === BillStatusEnum.SENT ? (
          <>
            <Button
              size="md"
              type="button"
              variant="success"
              onClick={updateBillStatus(BillStatusEnum.PAYMENT_PAID)}
            >
              <Icon name="thumb-up" />
              &nbsp; Facture payée
            </Button>
            <Button
              size="md"
              type="button"
              variant="error"
              onClick={updateBillStatus(BillStatusEnum.REFUSED)}
            >
              <Icon name="thumb-down" />
              &nbsp; Facture refusée
            </Button>
          </>
        ) : null}
        {bill.status === BillStatusEnum.PAYMENT_PAID ? (
          <Button size="md" type="button" onClick={updateBillStatus(BillStatusEnum.ARCHIVED)}>
            <Icon name="archive" />
            &nbsp; Archiver la facture
          </Button>
        ) : null}
      </div>
    </form>
  )
}

export default BillForm
