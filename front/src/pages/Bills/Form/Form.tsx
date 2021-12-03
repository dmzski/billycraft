import React from "react";
import { useQuery } from "react-query";
import Bill, { BillLine } from "../../../models/Bill";
import BillLineTable from "./BillLineTable";
import { BillStatusEnum } from "../../../models/Bill";
import { Button, Select, TextInput } from "@coco-ui/core";
import { LineTypeEnum } from "models/LineTypeEnum";
import {
  FormEventHandler,
  MouseEventHandler,
} from "react-router/node_modules/@types/react";
import Customer from "models/Customer";
import { CustomerApi } from "api/CustomerApi";
import { ProductApi } from "api/ProductApi";
import { ValueType } from "@coco-ui/core/dist/components/Select";

const defaultLine = {
  description: "",
  name: "",
  price: 0,
  quantity: 0,
  type: LineTypeEnum.ARTICLE,
};

type BillFormProps = {
  bill: Bill;
  customer?: Customer;
  setBill: React.Dispatch<React.SetStateAction<Bill>>;
  onSubmit: FormEventHandler;
  disabled?: boolean;
  onUpdateStatus: (status: BillStatusEnum) => MouseEventHandler;
};

const BillForm = ({
  bill,
  customer,
  setBill,
  onSubmit,
  disabled,
  onUpdateStatus,
}: BillFormProps): JSX.Element => {
  const [productIdSelected, setProductIdSelected] = React.useState<number>();
  const [errors, setErrors] = React.useState<
    Record<string, string | undefined>
  >({});
  const customersQuery = useQuery(
    "customers",
    CustomerApi.findAllByNameContains,
    {
      refetchOnWindowFocus: false,
    }
  );
  const productsQuery = useQuery("products", ProductApi.findAll, {
    refetchOnWindowFocus: false,
  });

  const inputChange = React.useCallback((property: keyof Bill) => {
    return (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      let value: string | number;
      switch (property) {
        case "tva":
          value = Number(event.target.value);
          break;
        default:
          value = event.target.value;
      }
      setBill((current) => ({
        ...current,
        [property]: value,
      }));
    };
  }, []);

  const onCustomerOptionClick = React.useCallback((option: ValueType) => {
    setBill((current) => ({
      ...current,
      customerId: Number(option),
    }));
    setErrors((current) => ({ ...current, customer: undefined }));
  }, []);

  const addLine = React.useCallback(
    (newLine: Partial<BillLine> = defaultLine) => {
      setBill((current) => ({
        ...current,
        lines: [
          ...(current.lines || []),
          {
            ...newLine,
            line: (current.lines || []).length + 1,
          } as BillLine,
        ],
      }));
      setTimeout(() => {
        document.getElementById(newLine.line + "-select")?.focus();
      }, 200);
    },
    []
  );

  const beforeOnSubmit = React.useCallback(
    (e: React.FormEvent) => {
      setBill((current) => ({
        ...current,
        lines: (current.lines || []).map((line) => ({
          ...line,
          price: Number(line.price),
          quantity: Number(line.quantity),
        })),
      }));
      if (bill.customerId) {
        onSubmit(e);
      } else {
        e.preventDefault();
        setErrors({
          customer: "Choisissez un client en le sélectionnant dans la liste",
        });
      }
    },
    [bill]
  );

  const handleSelectExistingProduct = React.useCallback(
    (productId: ValueType) => {
      setProductIdSelected(Number(productId));
    },
    []
  );

  const addExistingProductSelected = React.useCallback(() => {
    if (productIdSelected && productsQuery.data) {
      addLine(productsQuery.data.find(({ id }) => id === productIdSelected));
      setProductIdSelected(undefined);
    }
  }, [productIdSelected, productsQuery.data]);

  const cantUpdate = React.useMemo(() => {
    return bill.status && bill.status !== BillStatusEnum.DRAFT;
  }, [bill]);

  const handleShortcut = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.ctrlKey && event.key === "Enter" && !cantUpdate) {
        addLine();
      }
    },
    [addLine, cantUpdate]
  );

  const customerOptions = React.useMemo(() => {
    if (customersQuery.data) {
      return customersQuery.data.map(({ id, name }) => ({
        value: id,
        label: name,
      }));
    }
    if (customer) {
      return [{ value: customer.id, label: customer.name }];
    }
    return [];
  }, []);

  const productOptions = React.useMemo(() => {
    if (productsQuery.data) {
      return productsQuery.data.map(({ id, name }) => ({
        value: id,
        label: name,
      }));
    }
    return [];
  }, [productsQuery.data]);

  return (
    <form className="bill-form" onSubmit={beforeOnSubmit}>
      <TextInput
        containerClassName="my-4"
        disabled={disabled || cantUpdate}
        label="Titre"
        placeholder="Titre de la facture"
        value={bill.title}
        onChange={inputChange("title")}
      />
      <Select
        tabIndex={0}
        label="Sélectionner un client"
        id="customer-select"
        name="customer"
        disabled={disabled || cantUpdate}
        onChange={onCustomerOptionClick}
        inputProps={{
          autoComplete: "nope",
        }}
        options={customerOptions}
        placeholder="Nom du client"
        value={bill.customerId}
        isSearchable
        isLoading={customersQuery.isLoading}
      />
      {errors && errors.customer && <div>{errors.customer}</div>}
      <TextInput
        containerClassName="my-4"
        disabled={disabled || cantUpdate}
        label="TVA"
        placeholder="TVA en %"
        type="numeric"
        value={bill.tva || ""}
        onChange={inputChange("tva")}
      />
      <div onKeyDown={handleShortcut}>
        <BillLineTable
          disabled={disabled || cantUpdate}
          bill={bill}
          setBill={setBill}
        />
      </div>
      {!cantUpdate ? (
        <>
          <Button
            type="button"
            className="mt-4 w-full"
            variant="secondary"
            size="sm"
            onClick={() => addLine()}
            disabled={disabled}
            icon="plus"
          >
            Ajouter une ligne
          </Button>
          <div className="my-2 flex items-end">
            <Select
              disabled={disabled || cantUpdate}
              label="Ajouter un produit existant"
              tabIndex={0}
              containerClassName="flex-grow"
              name="existing-product"
              id="existing-product"
              inputProps={{
                autoComplete: "nope",
              }}
              options={productOptions}
              isLoading={productsQuery.isLoading}
              isSearchable
              placeholder="Nom du produit"
              value={productIdSelected}
              onChange={handleSelectExistingProduct}
            />
            <Button
              disabled={disabled || cantUpdate}
              onClick={addExistingProductSelected}
              type="button"
              className="py-2 ml-4 w-1/6"
              variant="secondary"
            >
              Ajouter
            </Button>
          </div>
        </>
      ) : null}

      <div className="flex pt-3 flex-row-reverse">
        {!bill.id || bill.status === BillStatusEnum.DRAFT || !bill.status ? (
          <Button
            icon="save"
            size="md"
            type="button"
            onClick={beforeOnSubmit}
            disabled={disabled}
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
            onClick={onUpdateStatus(BillStatusEnum.SENT)}
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
              onClick={onUpdateStatus(BillStatusEnum.PAYMENT_PAID)}
            >
              Facture payée
            </Button>
            <Button
              icon="thumb-down"
              size="md"
              type="button"
              variant="error"
              onClick={onUpdateStatus(BillStatusEnum.REFUSED)}
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
            onClick={onUpdateStatus(BillStatusEnum.ARCHIVED)}
          >
            Archiver la facture
          </Button>
        ) : null}
      </div>
    </form>
  );
};

export default BillForm;
