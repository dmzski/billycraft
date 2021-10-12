import React from "react";
import { useQuery } from "react-query";
import { Bill, BillLine } from "../../models/Bill";
import BillLineTable from "../tables/BillLineTable";
import { CustomerGraphQL } from "../../graphql/CustomerGraphQL";
import { BillStatusEnum } from "../../models/BillStatusEnum";
import { Button, Select, TextInput } from "@coco-ui/core";
import { ProductGraphQL } from "graphql/ProductGraphQL";

const BillForm = ({ bill, setBill, onSubmit, disabled, onUpdateStatus }: any): JSX.Element => {
  const [customerInputValue, setCustomerInputValue] = React.useState(bill.customer ? bill.customer.name : "");
  const [existingProductInput, setExistingProductInput] = React.useState<string>("");
  const [existingProductSelected, setExistingProductSelected] = React.useState<any>();
  const [errors, setErrors] = React.useState<any>({});
  const customersQuery = useQuery(["customers-by-name", customerInputValue], CustomerGraphQL.getAllCustomersByNameContain, {
    refetchOnWindowFocus: false,
    enabled: customerInputValue?.length > 0,
  });
  const productsQuery = useQuery(["products-by-name"], ProductGraphQL.getAllProducts, {
    refetchOnWindowFocus: false,
    enabled: existingProductInput?.length > 0,
  });

  const inputChange = (property: keyof Bill) => {
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
  };

  const onCustomerOptionClick = (option: any) => {
    const tmp: any = { ...bill };
    tmp.customer = option;
    setBill(tmp);
    setErrors({ ...errors, customer: undefined });
  };

  const addLine = React.useCallback(
    (newLine = new BillLine()) => {
      const tmp = { ...bill };
      newLine.line = -1 * tmp.lines.length + 1;
      tmp.lines.push(newLine);
      setBill(tmp);
      setTimeout(() => {
        document.getElementById(newLine.line + "-select")?.focus();
      }, 200);
    },
    [setBill, bill]
  );

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

  const handleSelectExistingProduct = (result: any) => {
    setExistingProductSelected(result);
  };

  const addExistingProductSelected = () => {
    if (existingProductSelected) {
      addLine(existingProductSelected);
      setExistingProductInput("");
      setExistingProductSelected(undefined);
    }
  };

  const cantUpdate = React.useMemo(() => {
    return bill.status !== BillStatusEnum.DRAFT;
  }, [bill]);

  React.useEffect(() => {
    if (!bill.customer) {
      setCustomerInputValue("");
    }
  }, [bill.customer]);

  const handleShortcut = (event: React.KeyboardEvent) => {
    if (event.ctrlKey && event.key === "Enter" && !cantUpdate) {
      addLine();
    }
  };

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
        tabIndex={0}
        label="Sélectionner un client"
        id="customer-select"
        name="customer"
        disabled={disabled || cantUpdate}
        onChange={onCustomerOptionClick}
        inputProps={{
          autoComplete: "nope",
        }}
        options={customersQuery.data || [bill.customer]}
        placeholder="Nom du client"
        value={bill.customer}
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
          options={productsQuery.data ? productsQuery.data.filter((product: any) => product.name) : []}
          isLoading={productsQuery.isLoading}
          isSearchable
          placeholder="Nom du produit"
          valueKey="id"
          textKey="name"
          value={existingProductSelected}
          onSearchChange={(str) => setExistingProductInput(str ?? "")}
          onChange={handleSelectExistingProduct}
        />
        <Button disabled={disabled || cantUpdate} onClick={addExistingProductSelected} type="button" className="py-2 ml-2 w-1/6" variant="default">
          Ajouter
        </Button>
      </div>
      <div onKeyDown={handleShortcut}>
        <BillLineTable disabled={disabled || cantUpdate} bill={bill} setBill={setBill} />
      </div>
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
