import React from "react";
import { useQuery } from "react-query";
import { Bill, BillLine } from "../../models/Bill";
import BillLineTable from "../tables/BillLineTable";
import { CustomerGraphQL } from "../../graphql/CustomerGraphQL";
import { BillStatusEnum } from "../../models/BillStatusEnum";
import { Button, Select, TextInput } from "@coco-ui/core";

const BillForm = ({ bill, setBill, onSubmit, disabled, onUpdateStatus }: any): JSX.Element => {
  const [customerInputValue, setCustomerInputValue] = React.useState(bill.customer ? bill.customer.name : "");
  const customersQuery = useQuery(["customers-by-name", customerInputValue], CustomerGraphQL.getAllCustomersByNameContain, {
    refetchOnWindowFocus: false,
    enabled: customerInputValue?.length > 0,
  });
  const [errors, setErrors] = React.useState<any>({});

  function inputChange(property: keyof Bill) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const tmp: any = { ...bill };
      let value: string | number;
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
    setCustomerInputValue(option.description);
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
    if (tmp.customer.id) {
      onSubmit(e);
    } else {
      e.preventDefault();
      setErrors({ customer: "Choisissez un client en le sélectionnant dans la liste" });
    }
  };

  const cantUpdate = React.useMemo(() => {
    return bill.status !== BillStatusEnum.DRAFT;
  }, [bill]);

  return (
    <form className="bill-form" onSubmit={beforeOnSubmit}>
      <TextInput
        containerClassName="my-2"
        disabled={disabled || cantUpdate}
        label="Titre"
        placeholder="Titre de la facture"
        value={bill.title}
        onChange={inputChange("title")}
      />
      <Select
        label="Sélectionner un client"
        id="customer-select"
        isLoading={customersQuery.isLoading}
        isSearchable
        disabled={disabled || cantUpdate}
        options={customersQuery.data || [bill.customer]}
        textKey="name"
        valueKey="id"
        placeholder="Nom du client"
        value={bill.customer}
        onSearchChange={(str) => str && setCustomerInputValue(str)}
        onChange={onCustomerOptionClick}
      />
      {errors && errors.customer && <div>{errors.customer}</div>}
      <TextInput
        containerClassName="my-3"
        disabled={disabled || cantUpdate}
        label="TVA"
        placeholder="TVA en %"
        type="numeric"
        value={bill.tva || ""}
        onChange={inputChange("tva")}
      />
      <BillLineTable disabled={disabled || cantUpdate} bill={bill} setBill={setBill} />
      {!cantUpdate && (
        <Button type="button" className="mt-2 w-full" variant="default" size="sm" onClick={addLine} disabled={disabled}>
          Ajouter une ligne
        </Button>
      )}

      <div className="flex pt-3 flex-row-reverse">
        {(!bill.id || bill.status === BillStatusEnum.DRAFT || !bill.status) && (
          <Button icon="save" size="md" type="submit" onClick={beforeOnSubmit} disabled={disabled}>
            Enregistrer
          </Button>
        )}
        {bill.id && bill.status === BillStatusEnum.DRAFT && (
          <Button size="md" icon="mail" className="mr-1" variant="success" type="button" onClick={onUpdateStatus(BillStatusEnum.SENT)} disabled={disabled}>
            Envoyer la facture
          </Button>
        )}
        {bill.status === BillStatusEnum.SENT && (
          <>
            <Button icon="thumb-up" size="md" type="button" variant="success" className="ml-3" onClick={onUpdateStatus(BillStatusEnum.PAYMENT_PAID)}>
              Facture payée
            </Button>
            <Button icon="thumb-down" size="md" type="button" variant="error" onClick={onUpdateStatus(BillStatusEnum.REFUSED)}>
              Facture refusée
            </Button>
          </>
        )}
        {bill.status === BillStatusEnum.PAYMENT_PAID && (
          <Button size="md" icon="archive" type="button" onClick={onUpdateStatus(BillStatusEnum.ARCHIVED)}>
            Archiver la facture
          </Button>
        )}
      </div>
    </form>
  );
};

export default BillForm;
