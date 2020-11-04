import React from "react";
import { useMutation, useQuery, useQueryCache } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import BaseInput from "../../components/inputs/BaseInput";
import { CustomerGraphQL } from "../../graphql/CustomerGraphQL";
import { Customer } from "../../models/Customer";
import { useToast } from "../../providers/ToastProvider";
import { ROUTES } from "../../routes";

const CustomerForm: React.FC<any> = ({ customer, closeModal }) => {
  const [newCustomer, setNewCustomer] = React.useState<Customer>(new Customer());
  const toast = useToast();
  const queryCache = useQueryCache();
  const [customerMutation, { isLoading, isError }] = useMutation(CustomerGraphQL.createOrUpdateCustomer, {
    onSuccess: () => {
      closeModal();
      toast.show({ message: "Enregistrement réussi", variant: "success" });
    },
  });

  function goBack(e: any) {
    closeModal();
  }

  function inputChange(property: keyof Customer) {
    return (event: any) => {
      const tmp: any = { ...newCustomer };
      tmp[property] = event.target.value;
      setNewCustomer(tmp);
    };
  }

  const saveCustomer = async (e: any) => {
    e.preventDefault();

    try {
      await customerMutation(newCustomer);
      queryCache.invalidateQueries("customers-query");
    } catch (error) {
      console.error("Error !!!", error);
    }
  };

  React.useEffect(() => {
    setNewCustomer(customer ? customer : new Customer());
  }, [customer]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center border-b-2 border-gray-400 pb-3">
        <h1 className="ml-4 text-xl">
          {!newCustomer.id ? "Nouveau " : "Modifier un "}client{newCustomer.id ? " #" + newCustomer.id : ""}
        </h1>
      </div>
      <form className="mt-3" onSubmit={saveCustomer}>
        <BaseInput divClassName="mt-3" label="Nom" placeholder="Nom du client" value={newCustomer.name} onChange={inputChange("name")} />
        <BaseInput divClassName="mt-3" label="Contact" placeholder="Nom complet" value={newCustomer.contact} onChange={inputChange("contact")} />
        <BaseInput divClassName="mt-3" label="Téléphone" placeholder="Téléphone" value={newCustomer.phoneNumber} onChange={inputChange("phoneNumber")} />
        <BaseInput divClassName="mt-3" label="Ville" placeholder="Ville" value={newCustomer.city} onChange={inputChange("city")} />
        <BaseInput divClassName="mt-3" label="Code Postal" placeholder="Code Postal" value={newCustomer.postalCode} onChange={inputChange("postalCode")} />
        <div className="mt-3 flex flex-row-reverse">
          <button className="primary" disabled={isLoading} type="submit">
            Enregistrer
          </button>
        </div>
        {isError && <div className="mt-3">Une erreur est survenue</div>}
      </form>
    </div>
  );
};

export default CustomerForm;
