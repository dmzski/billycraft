import { Button, Select, TextInput } from "@coco-ui/core";
import React from "react";
import { useQuery } from "react-query";
import { Quote, QuoteLine } from "../../models/Quote";
import QuoteLineTable from "../tables/QuoteLineTable";
import { CustomerGraphQL } from "../../graphql/CustomerGraphQL";
import { QuoteStatusEnum } from "../../models/QuoteStatusEnum";

type QuoteFormProps = {
  quote: Quote;
  setQuote: React.Dispatch<any>;
  onSubmit: (event: React.FormEvent<any>) => any;
  disabled: boolean;
  onUpdateStatus: (status: QuoteStatusEnum) => any;
};
const QuoteForm = ({ quote, setQuote, onSubmit, disabled, onUpdateStatus }: QuoteFormProps): JSX.Element => {
  const [customerInputValue, setCustomerInputValue] = React.useState(quote.customer ? quote.customer.name : "");
  const [errors, setErrors] = React.useState<any>({});
  const customersQuery = useQuery(["customers-by-name", customerInputValue], CustomerGraphQL.getAllCustomersByNameContain, {
    refetchOnWindowFocus: false,
    enabled: customerInputValue?.length > 0,
  });
  const lineTableRef = React.useRef<any>(null);

  function inputChange(property: keyof Quote) {
    return (event: any) => {
      const tmp: any = { ...quote };
      let value: any;
      switch (property) {
        case "tva":
          value = parseInt(event.target.value);
          break;
        default:
          value = event.target.value;
      }
      tmp[property] = value;
      setQuote(tmp);
    };
  }

  function onCustomerOptionClick(option: any) {
    const tmp: any = { ...quote };
    tmp.customer = option;
    setQuote(tmp);
    setErrors({ ...errors, customer: undefined });
  }

  const addLine = React.useCallback(() => {
    const tmp = { ...quote };
    const newLine = new QuoteLine();
    newLine.line = -1 * tmp.lines.length + 1;
    tmp.lines.push(newLine);
    setQuote(tmp);
    setTimeout(() => {
      document.getElementById(newLine.line + "-select")?.focus();
    }, 200);
  }, [setQuote, quote]);

  const beforeOnSubmit = (e: any) => {
    const tmp = { ...quote };
    tmp.lines = tmp.lines.map((line: QuoteLine) => {
      line.price = parseFloat(line.price as any);
      line.quantity = parseFloat(line.quantity as any);
      return line;
    });
    setQuote(tmp);
    if (tmp.customer.id) {
      onSubmit(e);
      setErrors({});
    } else {
      e.preventDefault();
      setErrors({ customer: "Saisissez un client en le sélectionnant dans la liste" });
    }
  };

  const cantUpdate = React.useMemo(() => {
    return quote.status !== QuoteStatusEnum.DRAFT;
  }, [quote]);

  React.useEffect(() => {
    const el = lineTableRef.current;
    function handleCtrlEnter(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "Enter" && !cantUpdate) {
        addLine();
      }
    }
    if (el) {
      el.addEventListener("keydown", handleCtrlEnter);
    }
    return () => {
      if (el) {
        el.removeEventListener("keydown", handleCtrlEnter);
      }
    };
  }, [lineTableRef, cantUpdate, addLine]);

  React.useEffect(() => {
    if (!quote.customer) {
      setCustomerInputValue("");
    }
  }, [quote.customer]);

  return (
    <form onSubmit={beforeOnSubmit}>
      <TextInput
        containerClassName="my-3"
        label="Titre"
        disabled={disabled || cantUpdate}
        aria-label="Titre"
        placeholder="Titre du devis"
        value={quote.title}
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
          autocomplete: "off",
        }}
        options={customersQuery.data || [quote.customer]}
        placeholder="Nom du client"
        value={quote.customer}
        onSearchChange={(str) => {
          if (str) {
            setCustomerInputValue(str);
          }
        }}
        textKey="name"
        valueKey="id"
        isSearchable
        isLoading={customersQuery.isLoading}
      />
      {errors && errors.customer && <div className="text-error-600 text-xs">{errors.customer}</div>}
      <TextInput
        label="TVA (%)"
        containerClassName="my-3"
        disabled={disabled || cantUpdate}
        aria-label="TVA"
        placeholder="TVA en %"
        type="numeric"
        value={quote.tva || ""}
        onChange={inputChange("tva")}
      />
      <div ref={lineTableRef}>
        <QuoteLineTable disabled={disabled || cantUpdate} quote={quote} setQuote={setQuote} />
        {!cantUpdate && (
          <Button type="button" variant="default" className="w-full mt-2" size="sm" onClick={addLine} disabled={disabled}>
            Ajouter une ligne
          </Button>
        )}
      </div>

      <div className="flex justify-end pt-3">
        {quote.id && quote.status === QuoteStatusEnum.DRAFT && (
          <Button className="mr-1" variant="success" size="md" type="button" onClick={onUpdateStatus(QuoteStatusEnum.SENT)} disabled={disabled}>
            Envoyer le devis
          </Button>
        )}
        {(!quote.id || quote.status === QuoteStatusEnum.DRAFT || !quote.status) && (
          <Button variant="primary" size="md" type="submit" onClick={beforeOnSubmit} disabled={disabled}>
            Enregistrer
          </Button>
        )}
        {quote.status === QuoteStatusEnum.SENT && (
          <>
            <Button size="md" variant="success" type="button" icon="thumb-up" className="ml-3" onClick={onUpdateStatus(QuoteStatusEnum.ACCEPTED)}>
              Devis accepté
            </Button>
            <Button size="md" variant="error" type="button" icon="thumb-down" onClick={onUpdateStatus(QuoteStatusEnum.REFUSED)}>
              Devis refusé
            </Button>
          </>
        )}
        {quote.status === QuoteStatusEnum.ACCEPTED && (
          <Button size="md" icon="currency-euro" type="button" onClick={onUpdateStatus(QuoteStatusEnum.DEPOSIT_ASK)}>
            Demander un accompte
          </Button>
        )}
        {quote.status === QuoteStatusEnum.DEPOSIT_ASK && (
          <Button size="md" icon="check" type="button" onClick={onUpdateStatus(QuoteStatusEnum.DEPOSIT_PAID)}>
            Accompte payé
          </Button>
        )}
        {quote.status === QuoteStatusEnum.DEPOSIT_PAID && (
          <Button size="md" icon="archive" type="button" onClick={onUpdateStatus(QuoteStatusEnum.ARCHIVED)}>
            Archiver le devis
          </Button>
        )}
      </div>
    </form>
  );
};

export default QuoteForm;
