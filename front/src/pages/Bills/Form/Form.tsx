import React, { useEffect } from "react";
import { useMutation } from "react-query";
import Bill, { BillLine } from "../../../models/Bill";
import BillLineTable from "./BillLineTable";
import { BillStatusEnum } from "../../../models/Bill";
import { Button, Select, TextInput } from "@coco-ui/core";
import { useToast } from "providers/ToastProvider";
import { Controller, useForm } from "react-hook-form";
import { BillApi } from "api/BillApi";
import { Prompt } from "react-router";
import useCustomers from "hooks/useCustomers";
import { STRINGS } from "constants/strings";

const defaultBill = {} as Partial<Bill>;

type BillFormProps = {
  bill: Bill;
  onSubmitSuccess: (res: Bill) => Promise<void> | void;
};

const BillForm = ({ bill, onSubmitSuccess }: BillFormProps): JSX.Element => {
  const toast = useToast();
  const customers = useCustomers();
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting, isDirty },
    reset,
  } = useForm({
    mode: "all",
    shouldFocusError: true,
    defaultValues: defaultBill,
  });
  const [
    updateBillStatusMutation,
    { isLoading: isUpdatingStatus },
  ] = useMutation(BillApi.updateStatus);

  const updateBillStatus = (status: BillStatusEnum) => async () => {
    try {
      const res = await updateBillStatusMutation({ id: bill.id, status });
      toast.show({ message: STRINGS.SAVE_SUCCESS, variant: "success" });
      onSubmitSuccess(res as Bill);
    } catch {
      toast.show({ message: STRINGS.SAVE_ERROR, variant: "error" });
    }
  };

  const onSubmit = async (data: Bill) => {
    const tmp = { ...data };
    tmp.lines = (tmp.lines ?? []).map((line: BillLine, index: number) => ({
      ...line,
      line: index + 1,
      price: line.price ? Number(`${line.price}`) : null,
      quantity: line.quantity ? Number(`${line.quantity}`) : null,
    }));
    try {
      const res = await BillApi.createOrUpdate(tmp);
      onSubmitSuccess(res);
      toast.show({ message: STRINGS.SAVE_SUCCESS, variant: "success" });
    } catch {
      toast.show({
        message: STRINGS.SAVE_ERROR,
        variant: "error",
      });
    }
  };

  const disabled = React.useMemo(
    () =>
      (bill.id && bill.status !== BillStatusEnum.DRAFT) || isUpdatingStatus
        ? true
        : false,
    [bill, isUpdatingStatus]
  );

  const customerOptions = React.useMemo(() => {
    const array = [];
    if (customers) {
      array.push(
        ...customers
          .filter(({ deleted }) => !deleted)
          .map((customer) => ({
            value: customer.id,
            label: customer.name,
          }))
      );
    }
    if (
      bill.customerId &&
      !array.find(({ value }) => value === bill.customerId)
    ) {
      const customer = customers.find(({ id }) => id === bill.customerId);
      if (customer) array.push({ value: customer.id, label: customer.name });
    }

    return array;
  }, [customers, bill]);

  useEffect(() => {
    if (bill) {
      reset(bill);
    }
  }, [reset, bill]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Prompt
        when={isDirty}
        message={() =>
          `Attention ! Certaines modifications ne sont pas enregistrées`
        }
      />
      <Controller
        name="title"
        control={control}
        rules={{ required: true, minLength: 3 }}
        render={({ field, fieldState: { invalid } }) => (
          <TextInput
            containerClassName="my-4"
            label="Titre"
            disabled={disabled}
            error={invalid}
            aria-label="Titre"
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
            name={field.name}
            disabled={disabled}
            onChange={field.onChange}
            inputProps={{
              autoComplete: "off",
            }}
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
          <TextInput
            label="TVA (%)"
            containerClassName="my-4"
            disabled={disabled}
            aria-label="TVA"
            placeholder="TVA en %"
            type="number"
            value={field.value}
            name={field.name}
            onChange={field.onChange}
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
            variant="success"
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
  );
};

export default BillForm;
