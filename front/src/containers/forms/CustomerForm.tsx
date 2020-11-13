import React from "react";
import { useMutation, useQuery, useQueryCache } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import BaseInput from "../../components/inputs/BaseInput";
import { CustomerGraphQL } from "../../graphql/CustomerGraphQL";
import { Customer } from "../../models/Customer";
import { useToast } from "../../providers/ToastProvider";
import { ROUTES } from "../../routes";

const CustomerForm: React.FC<any> = ({ customer, closeModal, setCustomer, onSubmit, isLoading, disabled }) => {
  function inputChange(property: keyof Customer) {
    return (event: any) => {
      const tmp: any = { ...customer };
      tmp[property] = event.target.value;
      setCustomer(tmp);
    };
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center border-b-2 border-gray-400 pb-3">
        <h1 className="ml-4 text-xl">
          {!customer.id ? "Nouveau " : "Modifier un "}client{customer.id ? " #" + customer.id : ""}
        </h1>
      </div>
      <form className="mt-3" onSubmit={onSubmit}>
        <BaseInput disabled={disabled} divClassName="mt-3" label="Nom" placeholder="Nom du client" value={customer.name} onChange={inputChange("name")} />
        <BaseInput
          disabled={disabled}
          divClassName="mt-3"
          label="Adresse"
          placeholder="Adresse du client"
          value={customer.address}
          onChange={inputChange("address")}
        />
        <BaseInput disabled={disabled} divClassName="mt-3" label="Email" placeholder="Adresse email" value={customer.email} onChange={inputChange("email")} />
        <BaseInput
          disabled={disabled}
          divClassName="mt-3"
          label="Téléphone"
          placeholder="Téléphone"
          value={customer.phoneNumber}
          onChange={inputChange("phoneNumber")}
        />
        <BaseInput disabled={disabled} divClassName="mt-3" label="Ville" placeholder="Ville" value={customer.city} onChange={inputChange("city")} />
        <BaseInput
          disabled={disabled}
          divClassName="mt-3"
          label="Code Postal"
          placeholder="Code Postal"
          value={customer.postalCode}
          onChange={inputChange("postalCode")}
        />
        <BaseInput
          disabled={disabled}
          divClassName="mt-3"
          label="Contact"
          placeholder="Nom complet"
          value={customer.contact}
          onChange={inputChange("contact")}
        />
        <div className="mt-3 flex flex-row-reverse">
          <button className="primary" disabled={isLoading || disabled} type="submit">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
