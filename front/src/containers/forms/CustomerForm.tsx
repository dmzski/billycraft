import { Button, TextInput } from "@coco-ui/core";
import React from "react";
import { Customer } from "../../models/Customer";

const CustomerForm = ({ customer, setCustomer, onSubmit, isLoading, disabled }: any): JSX.Element => {
  function inputChange(property: keyof Customer) {
    return (event: any) => {
      const tmp: any = { ...customer };
      tmp[property] = event.target.value;
      setCustomer(tmp);
    };
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center border-b-2 border-gray-400 pb-3 w-full">
        <h1 className="ml-4 text-xl">
          {!customer.id ? "Nouveau " : "Modifier un "}client{customer.id ? " #" + customer.id : ""}
        </h1>
      </div>
      <form className="mt-3" onSubmit={onSubmit}>
        <TextInput disabled={disabled} label="Nom" placeholder="Nom du client" value={customer.name} maxLength={100} onChange={inputChange("name")} />
        <TextInput
          multiline
          rows={3}
          disabled={disabled}
          containerClassName="mt-3"
          label="Adresse"
          placeholder="Adresse du client"
          value={customer.address}
          onChange={inputChange("address")}
          maxLength={255}
        />
        <TextInput
          disabled={disabled}
          containerClassName="mt-3"
          label="Email"
          placeholder="Adresse email"
          value={customer.email}
          onChange={inputChange("email")}
        />
        <TextInput
          disabled={disabled}
          containerClassName="mt-3"
          label="Téléphone"
          placeholder="Téléphone"
          value={customer.phoneNumber}
          onChange={inputChange("phoneNumber")}
          maxLength={10}
        />
        <TextInput disabled={disabled} containerClassName="mt-3" label="Ville" placeholder="Ville" value={customer.city} onChange={inputChange("city")} />
        <TextInput
          disabled={disabled}
          containerClassName="mt-3"
          label="Code Postal"
          placeholder="Code Postal"
          value={customer.postalCode}
          onChange={inputChange("postalCode")}
          maxLength={10}
        />
        <TextInput
          disabled={disabled}
          containerClassName="mt-3"
          label="Contact"
          placeholder="Nom complet"
          value={customer.contact}
          onChange={inputChange("contact")}
          maxLength={100}
        />
        <div className="mt-3 flex flex-row-reverse">
          <Button size="md" disabled={isLoading || disabled} type="submit">
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
