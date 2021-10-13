import { Button, TextInput } from "@coco-ui/core";
import { CustomerApi } from "api/CustomerApi";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import Customer from "../models/Customer";
import { ROUTES } from "../routes";

const CustomerForm = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [customer, setCustomer] = React.useState<Customer>({} as Customer);
  const customerQuery = useQuery(
    ["customer", id],
    () => CustomerApi.findById(Number(id)),
    { enabled: false }
  );
  const [customerMutation, { isLoading, isError }] = useMutation(
    CustomerApi.createOrUpdate,
    {
      onSuccess: () => {
        history.push(ROUTES.CUSTOMERS.path);
      },
    }
  );

  function goBack() {
    history.goBack();
  }

  function inputChange(property: keyof Customer) {
    return (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
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
      setCustomer({} as Customer);
    }
  }, [id, customerQuery]);

  React.useEffect(() => {
    if (customerQuery.data) {
      setCustomer(customerQuery.data);
    }
  }, [customerQuery]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center">
          <Button variant="link" onClick={goBack}>
            Retour
          </Button>
          <h1 className="ml-4 text-lg">
            {!customer.id ? "Nouveau " : "Modifier un "}client
            {customer.id ? " #" + customer.id : ""}
          </h1>
        </div>
        <form className="mt-3" onSubmit={saveCustomer}>
          <TextInput
            label="Nom"
            placeholder="Nom du client"
            value={customer.name}
            onChange={inputChange("name")}
          />
          <TextInput
            label="Contact"
            placeholder="Nom complet"
            value={customer.contact}
            onChange={inputChange("contact")}
          />
          <TextInput
            label="Téléphone"
            placeholder="Téléphone"
            value={customer.phoneNumber}
            onChange={inputChange("phoneNumber")}
          />
          <TextInput
            label="Ville"
            placeholder="Ville"
            value={customer.city}
            onChange={inputChange("city")}
          />
          <TextInput
            label="Code Postal"
            placeholder="Code Postal"
            value={customer.postalCode}
            onChange={inputChange("postalCode")}
          />
          <div className="mt-3 flex flex-row-reverse">
            <Button disabled={isLoading} type="submit">
              Enregistrer
            </Button>
          </div>
          {isError && <div className="mt-3">Une erreur est survenue</div>}
        </form>
      </div>
    </>
  );
};

export default CustomerForm;
