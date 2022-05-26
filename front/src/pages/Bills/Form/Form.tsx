import { useMemo, useEffect } from 'react'
import { useMutation } from 'react-query'
import { Button, Input, Select, useToast } from '@coco-ui/core'
import { Controller, useForm } from 'react-hook-form'
import { BillApi } from 'api/BillApi'
import { Prompt } from 'react-router-dom'
import useCustomers from 'hooks/useCustomers'
import { STRINGS } from 'constants/strings'
import { sendErrorToSentry } from 'utils/errors'
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
    formState: { isValid, isSubmitting, isDirty },
    reset,
  } = useForm({
    mode: 'all',
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
    } catch (error) {
      toast.error(STRINGS.SAVE_ERROR)
      sendErrorToSentry(error)
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
    } catch (error) {
      toast.error(STRINGS.SAVE_ERROR)
      sendErrorToSentry(error)
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
    <form onSubmit={handleSubmit(onSubmit)}>
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
            className="my-4"
            label="Titre"
            disabled={disabled}
            error={invalid}
            aria-label="Titre"
            variant="outside"
            placeholder="Titre du devis"
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            value={field.value}
            ref={field.ref}
          />
        )}
      />
      <Controller
        name="customerId"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            tabIndex={0}
            label="Sélectionner un client"
            id="customer-select"
            variant="outside"
            name={field.name}
            disabled={disabled}
            onChange={field.onChange}
            options={customerOptions}
            placeholder="Nom du client"
            value={field.value}
            isSearchable
            ref={field.ref}
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
            className="my-4"
            disabled={disabled}
            aria-label="TVA"
            placeholder="TVA en %"
            type="number"
            variant="outside"
            value={field.value}
            name={field.name}
            onChange={e => field.onChange(Number(e.target.value))}
            onBlur={field.onBlur}
            error={invalid}
            ref={field.ref}
          />
        )}
      />
      <div className="my-4">
        <BillLineTable control={control} disabled={disabled} />
      </div>
      <div className="flex pt-3 flex-row-reverse">
        {!bill.id || bill.status === BillStatusEnum.DRAFT || !bill.status ? (
          <Button
            icon="save"
            size="md"
            type="submit"
            variant="success"
            disabled={!isValid || isSubmitting || disabled}
          >
            Enregistrer
          </Button>
        ) : null}
        {bill.id && bill.status === BillStatusEnum.DRAFT ? (
          <Button
            size="md"
            icon="mail"
            className="mr-1"
            variant="info"
            type="button"
            onClick={updateBillStatus(BillStatusEnum.SENT)}
            disabled={disabled}
          >
            Envoyer la facture
          </Button>
        ) : null}
        {bill.status === BillStatusEnum.SENT ? (
          <>
            <Button
              icon="thumb-up"
              size="md"
              type="button"
              variant="success"
              className="ml-3"
              onClick={updateBillStatus(BillStatusEnum.PAYMENT_PAID)}
            >
              Facture payée
            </Button>
            <Button
              icon="thumb-down"
              size="md"
              type="button"
              variant="error"
              onClick={updateBillStatus(BillStatusEnum.REFUSED)}
            >
              Facture refusée
            </Button>
          </>
        ) : null}
        {bill.status === BillStatusEnum.PAYMENT_PAID ? (
          <Button
            size="md"
            icon="archive"
            type="button"
            onClick={updateBillStatus(BillStatusEnum.ARCHIVED)}
          >
            Archiver la facture
          </Button>
        ) : null}
      </div>
    </form>
  )
}

export default BillForm
