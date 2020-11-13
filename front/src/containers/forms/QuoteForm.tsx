import React from "react";
import { useMutation, useQuery } from "react-query";
import { QuoteGraphQL } from "../../graphql/QuoteGraphQL";
import { Quote, QuoteLine } from "../../models/Quote";
import BaseInput from "../../components/inputs/BaseInput";
import QuoteLineTable from "../tables/QuoteLineTable";
import AutoCompleteInput from "../../components/inputs/AutoCompleteInput";
import { CustomerGraphQL } from "../../graphql/CustomerGraphQL";
import { QuoteStatusEnum } from "../../models/QuoteStatusEnum";
import SelectInput from "../../components/inputs/SelectInput";

const QuoteForm: React.FC<any> = ({ quote, setQuote, onSubmit, disabled, onUpdateStatus }) => {
  const [customerInputValue, setCustomerInputValue] = React.useState(quote.customer ? quote.customer.name : "");
  const customersQuery = useQuery("customers", CustomerGraphQL.getAllCustomers, { refetchOnWindowFocus: false });
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

  function onCustomerOptionClick(event: any, option: any) {
    const tmp: any = { ...quote };
    tmp.customer = { id: option.id };
    setCustomerInputValue(option.description);
    setQuote(tmp);
  }

  const addLine = React.useCallback(() => {
    const tmp = { ...quote };
    const newLine = new QuoteLine();
    newLine.line = -1 * tmp.lines.length + 1;
    tmp.lines.push(newLine);
    setQuote(tmp);
    setTimeout(() => {
      console.log(document.getElementById(newLine.line + "-select"));
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
    } else {
    }
  };

  const cantUpdate = React.useMemo(() => {
    return quote.status !== QuoteStatusEnum.DRAFT;
  }, [quote]);

  const getSelectCustomerData = React.useCallback(() => {
    const array: any[] = [{ header: undefined, values: [] }];
    if (customersQuery.data) {
      customersQuery.data.forEach((customer: any) => {
        array[0].values.push({ id: customer.id + "", description: customer.name });
      });
    }
    return array;
  }, [customersQuery.data]);

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

  return (
    <form className="quote-form" onSubmit={beforeOnSubmit}>
      <BaseInput disabled={disabled || cantUpdate} label="Titre" placeholder="Titre du devis" value={quote.title} onChange={inputChange("title")} />
      <div className="mt-2">
        <label htmlFor="customer-select" className="block text-gray-700 text-sm font-bold mb-1 ml-1">
          Sélectionner un client
        </label>
        <SelectInput
          id="customer-select"
          disabled={disabled || cantUpdate}
          onClickOption={onCustomerOptionClick}
          data={getSelectCustomerData()}
          placeholder="Nom du client"
          value={customerInputValue}
          onChange={(e: any) => setCustomerInputValue(e.target.value)}
          className="text-gray-700 py-2 px-3 w-full z-10 shadow appearance-none border rounded focus:outline-none focus:shadow-outline"
        />
      </div>
      <BaseInput
        divClassName="mt-2"
        disabled={disabled || cantUpdate}
        label="TVA"
        placeholder="TVA en %"
        type="numeric"
        value={quote.tva || ""}
        onChange={inputChange("tva")}
      />
      <div ref={lineTableRef}>
        <QuoteLineTable disabled={disabled || cantUpdate} quote={quote} setQuote={setQuote} />
        {!cantUpdate && (
          <div className="flex">
            <button type="button" className="button transparent w-full focus:shadow-outline" onClick={addLine} disabled={disabled}>
              Ajouter une ligne
            </button>
          </div>
        )}
      </div>

      <div className="flex pt-3 flex-row-reverse">
        {(!quote.id || quote.status === QuoteStatusEnum.DRAFT || !quote.status) && (
          <button className="button bg-gray-600 text-white p-3 rounded ml-4" type="submit" onClick={beforeOnSubmit} disabled={disabled}>
            Enregistrer
          </button>
        )}
        {quote.id && quote.status === QuoteStatusEnum.DRAFT && (
          <button className="button bg-green-600 text-white p-3 rounded" type="button" onClick={onUpdateStatus(QuoteStatusEnum.SENT)} disabled={disabled}>
            Envoyer le devis
          </button>
        )}
        {quote.status === QuoteStatusEnum.SENT && (
          <>
            <button type="button" className="button success ml-3" onClick={onUpdateStatus(QuoteStatusEnum.ACCEPTED)}>
              Devis accepté
            </button>
            <button type="button" className="button error" onClick={onUpdateStatus(QuoteStatusEnum.REFUSED)}>
              Devis refusé
            </button>
          </>
        )}
        {quote.status === QuoteStatusEnum.ACCEPTED && (
          <button type="button" className="button primary" onClick={onUpdateStatus(QuoteStatusEnum.DEPOSIT_ASK)}>
            Demander un accompte
          </button>
        )}
        {quote.status === QuoteStatusEnum.DEPOSIT_ASK && (
          <button type="button" className="button primary" onClick={onUpdateStatus(QuoteStatusEnum.DEPOSIT_PAID)}>
            Accompte payé
          </button>
        )}
        {quote.status === QuoteStatusEnum.DEPOSIT_PAID && (
          <button type="button" className="button primary" onClick={onUpdateStatus(QuoteStatusEnum.ARCHIVED)}>
            Archiver le devis
          </button>
        )}
      </div>
    </form>
  );
};

export default QuoteForm;
