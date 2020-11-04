import React from "react";
import { useMutation, useQuery } from "react-query";
import { QuoteGraphQL } from "../../graphql/QuoteGraphQL";
import { Quote, QuoteLine } from "../../models/Quote";
import BaseInput from "../../components/inputs/BaseInput";
import QuoteLineTable from "../tables/QuoteLineTable";
import AutoCompleteInput from "../../components/inputs/AutoCompleteInput";
import { CustomerGraphQL } from "../../graphql/CustomerGraphQL";
import { QuoteStatusEnum } from "../../models/QuoteStatusEnum";

const QuoteForm: React.FC<any> = ({ quote, setQuote, onSubmit, disabled, onUpdateStatus }) => {
  const [customerInputValue, setCustomerInputValue] = React.useState(quote.customer ? quote.customer.name : "");
  const customersByNameContainsQuery = useQuery(["customers-by-name-contains", customerInputValue], CustomerGraphQL.getAllCustomersByNameContain, {
    enabled: customerInputValue.length >= 3,
  });

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
    tmp.customer = { id: option.id };
    setCustomerInputValue(option.name);
    setQuote(tmp);
  }

  function addLine() {
    const tmp = { ...quote };
    const newLine = new QuoteLine();
    newLine.line = tmp.lines.length + 1;
    tmp.lines.push(newLine);
    setQuote(tmp);
  }

  const beforeOnSubmit = (e: any) => {
    const tmp = { ...quote };
    tmp.lines = tmp.lines.map((line: QuoteLine) => {
      line.price = parseFloat(line.price as any);
      line.quantity = parseFloat(line.quantity as any);
      return line;
    });
    console.log("TMp", tmp);
    setQuote(tmp);
    onSubmit(e);
  };

  const cantUpdate = React.useMemo(() => {
    return quote.status !== QuoteStatusEnum.DRAFT;
  }, [quote]);

  return (
    <form className="quote-form" onSubmit={beforeOnSubmit}>
      <BaseInput disabled={disabled || cantUpdate} label="Titre" placeholder="Titre du devis" value={quote.title} onChange={inputChange("title")} />
      <AutoCompleteInput
        disabled={disabled || cantUpdate}
        onOptionClick={onCustomerOptionClick}
        options={customersByNameContainsQuery.data}
        label="Client"
        placeholder="Nom du client"
        value={customerInputValue}
        onChange={(e: any) => setCustomerInputValue(e.target.value)}
      />
      <BaseInput disabled={disabled || cantUpdate} label="TVA" placeholder="TVA en %" type="numeric" value={quote.tva || ""} onChange={inputChange("tva")} />
      <QuoteLineTable disabled={disabled || cantUpdate} quote={quote} setQuote={setQuote} />
      {!cantUpdate && (
        <div className="flex">
          <button type="button" className="primary w-full" onClick={addLine} disabled={disabled}>
            Ajouter une ligne
          </button>
        </div>
      )}

      <div className="flex pt-3 flex-row-reverse">
        {(!quote.id || quote.status === QuoteStatusEnum.DRAFT || !quote.status) && (
          <button className="bg-gray-600 text-white p-3 rounded ml-4" type="submit" onClick={beforeOnSubmit} disabled={disabled}>
            Enregistrer
          </button>
        )}
        {quote.id && quote.status === QuoteStatusEnum.DRAFT && (
          <button className="bg-green-600 text-white p-3 rounded" type="button" onClick={onUpdateStatus(QuoteStatusEnum.SENT)} disabled={disabled}>
            Envoyer le devis
          </button>
        )}
        {quote.status === QuoteStatusEnum.SENT && (
          <>
            <button type="button" className="button-success ml-3" onClick={onUpdateStatus(QuoteStatusEnum.ACCEPTED)}>
              Devis accepté
            </button>
            <button type="button" className="button-error" onClick={onUpdateStatus(QuoteStatusEnum.REFUSED)}>
              Devis refusé
            </button>
          </>
        )}
        {quote.status === QuoteStatusEnum.ACCEPTED && (
          <button type="button" className="primary" onClick={onUpdateStatus(QuoteStatusEnum.DEPOSIT_ASK)}>
            Demander un accompte
          </button>
        )}
        {quote.status === QuoteStatusEnum.DEPOSIT_ASK && (
          <button type="button" className="primary" onClick={onUpdateStatus(QuoteStatusEnum.DEPOSIT_PAID)}>
            Accompte payé
          </button>
        )}
        {quote.status === QuoteStatusEnum.DEPOSIT_PAID && (
          <button type="button" className="primary" onClick={onUpdateStatus(QuoteStatusEnum.ARCHIVED)}>
            Archiver le devis
          </button>
        )}
      </div>
    </form>
  );
};

export default QuoteForm;
