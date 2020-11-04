import React from "react";
import { useMutation, useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import BaseInput from "../components/inputs/BaseInput";
import Layout from "../containers/layout/Layout";
import { CustomerGraphQL } from "../graphql/CustomerGraphQL";
import { Customer } from "../models/Customer";
import { ROUTES } from "../routes";

const CustomerForm: React.FC<any> = () => {
  const { id } = useParams<any>();
  const history = useHistory();
  const [customer, setCustomer] = React.useState<Customer>(new Customer());
  const customerQuery = useQuery(["customer", id], CustomerGraphQL.getCustomer, { enabled: false });
  const [customerMutation, { isLoading, isSuccess, isError }] = useMutation(CustomerGraphQL.createOrUpdateCustomer, {
    onSuccess: () => {
      history.push(ROUTES.CUSTOMERS.path);
    },
  });

  function goBack(e: any) {
    history.goBack();
  }

  function inputChange(property: keyof Customer) {
    return (event: any) => {
      const tmp: any = { ...customer };
      tmp[property] = event.target.value;
      setCustomer(tmp);
    };
  }

  const saveCustomer = async (e: any) => {
    e.preventDefault();

    try {
      customerMutation(customer);
    } catch (error) {
      console.error("Error !!!", error);
    }
  };

  React.useEffect(() => {
    try {
      if (id !== "new" && !customerQuery.isLoading) {
        customerQuery.refetch();
      }
    } catch (e) {
      setCustomer(new Customer());
    }
  }, [id, customerQuery]);

  React.useEffect(() => {
    if (customerQuery.data) {
      setCustomer(customerQuery.data);
    }
  }, [customerQuery]);

  return (
    <Layout>
      <div className="flex flex-col">
        <div className="flex items-center">
          <button className="primary" onClick={goBack}>
            Retour
          </button>
          <h1 className="ml-4 text-lg">
            {!customer.id ? "Nouveau " : "Modifier un "}client{customer.id ? " #" + customer.id : ""}
          </h1>
        </div>
        <form className="mt-3" onSubmit={saveCustomer}>
          <BaseInput label="Nom" placeholder="Nom du client" value={customer.name} onChange={inputChange("name")} />
          <BaseInput label="Contact" placeholder="Nom complet" value={customer.contact} onChange={inputChange("contact")} />
          <BaseInput label="Téléphone" placeholder="Téléphone" value={customer.phoneNumber} onChange={inputChange("phoneNumber")} />
          <BaseInput label="Ville" placeholder="Ville" value={customer.city} onChange={inputChange("city")} />
          <BaseInput label="Code Postal" placeholder="Code Postal" value={customer.postalCode} onChange={inputChange("postalCode")} />
          <div className="mt-3 flex flex-row-reverse">
            <button className="primary" disabled={isLoading} type="submit">
              Enregistrer
            </button>
          </div>
          {isError && <div className="mt-3">Une erreur est survenue</div>}
        </form>
      </div>
    </Layout>
  );
};

export default CustomerForm;
