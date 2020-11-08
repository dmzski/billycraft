import React from "react";
import { useQuery } from "react-query";
import { Bill, BillLine } from "../../models/Bill";
import BaseInput from "../../components/inputs/BaseInput";
import BillLineTable from "../tables/BillLineTable";
import AutoCompleteInput from "../../components/inputs/AutoCompleteInput";
import { CustomerGraphQL } from "../../graphql/CustomerGraphQL";
import { BillStatusEnum } from "../../models/BillStatusEnum";

const BillForm: React.FC<any> = ({ bill, setBill, onSubmit, disabled, onUpdateStatus }) => {
  const [customerInputValue, setCustomerInputValue] = React.useState(bill.customer ? bill.customer.name : "");
  const customersByNameContainsQuery = useQuery(["customers-by-name-contains", customerInputValue], CustomerGraphQL.getAllCustomersByNameContain, {
    enabled: customerInputValue.length >= 3,
  });

  function inputChange(property: keyof Bill) {
    return (event: any) => {
      const tmp: any = { ...bill };
      let value: any;
      switch (property) {
        case "tva":
          value = parseInt(event.target.value);
          break;
        default:
          value = event.target.value;
      }
      tmp[property] = value;
      setBill(tmp);
    };
  }

  function onCustomerOptionClick(option: any) {
    const tmp: any = { ...bill };
    tmp.customer = { id: option.id };
    setCustomerInputValue(option.name);
    setBill(tmp);
  }

  function addLine() {
    const tmp = { ...bill };
    const newLine = new BillLine();
    newLine.line = tmp.lines.length + 1;
    tmp.lines.push(newLine);
    setBill(tmp);
  }

  const beforeOnSubmit = (e: any) => {
    const tmp = { ...bill };
    tmp.lines = tmp.lines.map((line: BillLine) => {
      line.price = parseFloat(line.price as any);
      line.quantity = parseFloat(line.quantity as any);
      return line;
    });
    setBill(tmp);
    onSubmit(e);
  };

  const cantUpdate = React.useMemo(() => {
    return bill.status !== BillStatusEnum.DRAFT;
  }, [bill]);

  return (
    <form className="bill-form" onSubmit={beforeOnSubmit}>
      <BaseInput disabled={disabled || cantUpdate} label="Titre" placeholder="Titre de la facture" value={bill.title} onChange={inputChange("title")} />
      <AutoCompleteInput
        disabled={disabled || cantUpdate}
        onOptionClick={onCustomerOptionClick}
        options={customersByNameContainsQuery.data}
        label="Client"
        placeholder="Nom du client"
        value={customerInputValue}
        onChange={(e: any) => setCustomerInputValue(e.target.value)}
      />
      <BaseInput disabled={disabled || cantUpdate} label="TVA" placeholder="TVA en %" type="numeric" value={bill.tva || ""} onChange={inputChange("tva")} />
      <BillLineTable disabled={disabled || cantUpdate} bill={bill} setBill={setBill} />
      {!cantUpdate && (
        <div className="flex">
          <button type="button" className="primary w-full" onClick={addLine} disabled={disabled}>
            Ajouter une ligne
          </button>
        </div>
      )}

      <div className="flex pt-3 flex-row-reverse">
        {(!bill.id || bill.status === BillStatusEnum.DRAFT || !bill.status) && (
          <button className="bg-gray-600 text-white p-3 rounded ml-4" type="submit" onClick={beforeOnSubmit} disabled={disabled}>
            Enregistrer
          </button>
        )}
        {bill.id && bill.status === BillStatusEnum.DRAFT && (
          <button className="bg-green-600 text-white p-3 rounded" type="button" onClick={onUpdateStatus(BillStatusEnum.SENT)} disabled={disabled}>
            Envoyer la facture
          </button>
        )}
        {bill.status === BillStatusEnum.SENT && (
          <>
            <button type="button" className="button success ml-3" onClick={onUpdateStatus(BillStatusEnum.ACCEPTED)}>
              Facture accepté
            </button>
            <button type="button" className="button error" onClick={onUpdateStatus(BillStatusEnum.REFUSED)}>
              Facture refusé
            </button>
          </>
        )}
        {bill.status === BillStatusEnum.ACCEPTED && (
          <button type="button" className="primary" onClick={onUpdateStatus(BillStatusEnum.PAYMENT_ASK)}>
            Paiement demandé
          </button>
        )}
        {bill.status === BillStatusEnum.PAYMENT_ASK && (
          <button type="button" className="primary" onClick={onUpdateStatus(BillStatusEnum.PAYMENT_PAID)}>
            Payée
          </button>
        )}
        {bill.status === BillStatusEnum.PAYMENT_PAID && (
          <button type="button" className="primary" onClick={onUpdateStatus(BillStatusEnum.ARCHIVED)}>
            Archiver la facture
          </button>
        )}
      </div>
    </form>
  );
};

export default BillForm;
