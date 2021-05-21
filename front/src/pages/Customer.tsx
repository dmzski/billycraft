import React from "react";
import { useQuery } from "react-query";
import CustomerTable from "../containers/tables/CustomerTable";
import { CustomerGraphQL } from "../graphql/CustomerGraphQL";
import CustomerModal from "../containers/modals/CustomerModal";
import { Customer } from "../models/Customer";
import { Button, Loader } from "@coco-ui/core";

const CustomerPage = (): JSX.Element => {
  const customersQuery = useQuery("customers-query", CustomerGraphQL.getAllCustomers, { refetchOnWindowFocus: false });
  const [isOpen, setIsOpen] = React.useState(false);

  const goToNewCustomer = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex flex-row-reverse">
        <Button icon="plus" size="md" onClick={goToNewCustomer}>
          Nouveau client
        </Button>
      </div>
      <div>
        <CustomerTable data={customersQuery.data} />
        {customersQuery.isLoading && (
          <div className="mt-2 flex justify-center">
            <Loader />
          </div>
        )}
      </div>
      <CustomerModal customer={new Customer()} isOpen={isOpen} onRequestClose={() => setIsOpen(false)} />
    </>
  );
};

export default CustomerPage;
