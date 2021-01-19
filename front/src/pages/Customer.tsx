import React from "react";
import { useQuery } from "react-query";
import CustomerTable from "../containers/tables/CustomerTable";
import { CustomerGraphQL } from "../graphql/CustomerGraphQL";
import CustomerModal from "../containers/modals/CustomerModal";
import { Customer } from "../models/Customer";

const CustomerPage = () => {
  const customersQuery = useQuery("customers-query", CustomerGraphQL.getAllCustomers, {refetchOnWindowFocus: false});
  const [isOpen, setIsOpen] = React.useState(false);

  const goToNewCustomer = (e: any) => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex flex-row-reverse">
        <button className="primary" onClick={goToNewCustomer}>
          <span className="material-icons">add</span>
          <p>Nouveau client</p>
        </button>
      </div>
      <div>
        <CustomerTable data={customersQuery.data} />
        {customersQuery.isLoading && <div>Chargement en cours...</div>}
      </div>
      <CustomerModal customer={new Customer()} isOpen={isOpen} onRequestClose={() => setIsOpen(false)} />
    </>
  );
};

export default CustomerPage;
