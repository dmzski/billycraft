import { Button, Select, TextInput } from "@coco-ui/core";
import React from "react";
import { useQuery } from "react-query";
import Quote, { QuoteLine } from "../../../models/Quote";
import QuoteLineTable from "./QuoteLineTable";
import { QuoteStatusEnum } from "../../../models/Quote";
import Customer from "models/Customer";
import { LineTypeEnum } from "models/LineTypeEnum";
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

type QuoteFormProps = {
  quote: Quote;
  customer?: Customer;
  setQuote: React.Dispatch<React.SetStateAction<Quote>>;
  onSubmit: (event: React.FormEvent<any>) => any;
  disabled: boolean;
  onUpdateStatus: (status: QuoteStatusEnum) => any;
};
const QuoteForm = ({
  quote,
  customer,
  setQuote,
  onSubmit,
  disabled,
  onUpdateStatus,
}: QuoteFormProps): JSX.Element => {
  const [customerInputValue, setCustomerInputValue] = React.useState<string>(
    customer ? customer.name : ""
  );
  const [
    existingProductInput,
    setExistingProductInput,
  ] = React.useState<string>("");
  const [productIdSelected, setProductIdSelected] = React.useState<number>();
  const [errors, setErrors] = React.useState<
    Record<string, string | undefined>
  >({});
  const customersQuery = useQuery(
    ["customers-by-name", customerInputValue],
    CustomerApi.findAllByNameContains,
    {
      refetchOnWindowFocus: false,
      enabled: customerInputValue?.length > 0,
    }
  );
  const productsQuery = useQuery(["products-by-name"], ProductApi.findAll, {
    refetchOnWindowFocus: false,
    enabled: existingProductInput?.length > 0,
  });

  const inputChange = (property: keyof Quote) => {
    return (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      let value: any;
      switch (property) {
        case "tva":
          value = Number(event.target.value) ?? 0;
          break;
        default:
          value = event.target.value;
      }
      setQuote((current) => ({
        ...current,
        [property]: value,
      }));
    };
  };

  const onCustomerOptionClick = React.useCallback((option: ValueType) => {
    setQuote((current) => ({
      ...current,
      customerId: Number(option),
    }));
    setErrors((current) => ({ ...current, customer: undefined }));
  }, []);

  const onProductSelectedChange = React.useCallback((option: ValueType) => {
    setProductIdSelected(Number(option));
  }, []);

  const addLine = React.useCallback((newLine = defaultLine) => {
    setQuote((current) => ({
      ...current,
      lines: [
        ...(current.lines || []),
        { ...newLine, line: (current.lines || []).length + 1 },
      ],
    }));
    setTimeout(() => {
      document.getElementById(newLine.line + "-select")?.focus();
    }, 200);
  }, []);

  const beforeOnSubmit = (e: any) => {
    const tmp = { ...quote };
    tmp.lines = tmp.lines.map((line: QuoteLine) => {
      line.price = parseFloat(line.price as any);
      line.quantity = parseFloat(line.quantity as any);
      return line;
    });
    setQuote(tmp);
    if (tmp.customerId) {
      onSubmit(e);
      setErrors({});
    } else {
      e.preventDefault();
      setErrors({
        customer: "Saisissez un client en le sélectionnant dans la liste",
      });
    }
  };

  const addExistingProductSelected = () => {
    if (productIdSelected && productsQuery.data) {
      addLine(
        productsQuery.data.find((product) => product.id === productIdSelected)
      );
      setExistingProductInput("");
      setProductIdSelected(undefined);
    }
  };

  const cantUpdate = React.useMemo(() => {
    return quote.status && quote.status !== QuoteStatusEnum.DRAFT;
  }, [quote]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey && e.key === "Enter" && !cantUpdate) {
      e.stopPropagation();
      addLine();
    }
  };

  React.useEffect(() => {
    if (!customer) {
      setCustomerInputValue("");
    }
  }, [customer]);

  const customerOptions = React.useMemo(() => {
    if (customersQuery.data) {
      return customersQuery.data.map((customer) => ({
        value: customer.id,
        label: customer.name,
      }));
    }
    if (customer) {
      return [{ value: customer.id, label: customer.name }];
    }
    return [];
  }, [customersQuery.data, customer]);

  const productOptions = React.useMemo(() => {
    if (productsQuery.data) {
      return productsQuery.data.map((product) => ({
        value: product.id,
        label: product.name,
      }));
    }
    return [];
  }, [productsQuery.data]);

  return (
    <form onSubmit={beforeOnSubmit}>
      <TextInput
        containerClassName="my-4"
        label="Titre"
        disabled={disabled || cantUpdate}
        aria-label="Titre"
        placeholder="Titre du devis"
        value={quote.title ?? ""}
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
        value={quote.customerId}
        onSearchChange={(str) => {
          if (str) {
            setCustomerInputValue(str);
          }
        }}
        isSearchable
        isLoading={customersQuery.isLoading}
      />
      {errors && errors.customer && (
        <div className="text-error-600 text-xs">{errors.customer}</div>
      )}
      <TextInput
        label="TVA (%)"
        containerClassName="my-4"
        disabled={disabled || cantUpdate}
        aria-label="TVA"
        placeholder="TVA en %"
        type="numeric"
        value={quote.tva ?? ""}
        onChange={inputChange("tva")}
      />
      <div className="my-4 flex items-end">
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
          onSearchChange={(str) => setExistingProductInput(str ?? "")}
          onChange={onProductSelectedChange}
        />
        <Button
          disabled={disabled || cantUpdate}
          onClick={addExistingProductSelected}
          type="button"
          className="py-2 ml-4 w-1/6"
          variant="default"
        >
          Ajouter
        </Button>
      </div>
      <div onKeyDown={handleKeyDown} className="my-4">
        <QuoteLineTable
          disabled={disabled || cantUpdate}
          quote={quote}
          setQuote={setQuote}
        />
        {!cantUpdate && (
          <Button
            type="button"
            variant="default"
            className="w-full mt-4"
            size="sm"
            onClick={addLine}
            disabled={disabled}
            icon="plus"
          >
            Ajouter une ligne
          </Button>
        )}
      </div>

      <div className="flex justify-end pt-4">
        {quote.id && quote.status === QuoteStatusEnum.DRAFT ? (
          <Button
            className="mr-4"
            variant="success"
            size="md"
            type="button"
            onClick={onUpdateStatus(QuoteStatusEnum.SENT)}
            disabled={disabled}
          >
            Envoyer le devis
          </Button>
        ) : null}
        {!quote.id ||
        quote.status === QuoteStatusEnum.DRAFT ||
        !quote.status ? (
          <Button
            variant="primary"
            size="md"
            type="submit"
            onClick={beforeOnSubmit}
            disabled={disabled}
          >
            Enregistrer
          </Button>
        ) : null}
        {quote.status === QuoteStatusEnum.SENT ? (
          <>
            <Button
              size="md"
              variant="success"
              type="button"
              icon="thumb-up"
              className="mr-4"
              onClick={onUpdateStatus(QuoteStatusEnum.ACCEPTED)}
            >
              Devis accepté
            </Button>
            <Button
              size="md"
              variant="error"
              type="button"
              icon="thumb-down"
              onClick={onUpdateStatus(QuoteStatusEnum.REFUSED)}
            >
              Devis refusé
            </Button>
          </>
        ) : null}
        {quote.status === QuoteStatusEnum.ACCEPTED ? (
          <>
            <Button
              size="md"
              variant="default"
              className="mr-4"
              icon="document"
              type="button"
              onClick={onUpdateStatus(QuoteStatusEnum.DRAFT)}
            >
              Remettre en brouillon
            </Button>
            <Button
              size="md"
              icon="currency-euro"
              type="button"
              onClick={onUpdateStatus(QuoteStatusEnum.DEPOSIT_ASK)}
            >
              Demander un accompte
            </Button>
          </>
        ) : null}
        {quote.status === QuoteStatusEnum.DEPOSIT_ASK ? (
          <Button
            size="md"
            icon="check"
            type="button"
            onClick={onUpdateStatus(QuoteStatusEnum.DEPOSIT_PAID)}
          >
            Accompte payé
          </Button>
        ) : null}
        {quote.status === QuoteStatusEnum.DEPOSIT_PAID ? (
          <Button
            size="md"
            icon="archive"
            type="button"
            onClick={onUpdateStatus(QuoteStatusEnum.ARCHIVED)}
          >
            Archiver le devis
          </Button>
        ) : null}
      </div>
    </form>
  );
};

export default QuoteForm;
