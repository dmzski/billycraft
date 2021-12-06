import React from "react";
import { useQuery } from "react-query";
import CustomerTable from "./List";
import CustomerModal from "./Modals/CustomerModal";
import Customer from "../../models/Customer";
import { Button, Loader } from "@coco-ui/core";
import { CustomerApi } from "api/CustomerApi";

const CustomerPage = (): JSX.Element => {
  const customersQuery = useQuery(
    ["customers", "not-deleted"],
    CustomerApi.findAllNotDeleted,
    {
      refetchOnWindowFocus: false,
    }
  );
  const [isOpen, setIsOpen] = React.useState(false);

  const goToNewCustomer = () => {
    setIsOpen(true);
  };

  return (
    <>
      <h1 className="text-3xl">Clients</h1>
      <div className="mt-4 flex flex-row-reverse">
        <Button icon="plus" size="md" onClick={goToNewCustomer}>
          Nouveau client
        </Button>
      </div>
      <div>
        <CustomerTable data={customersQuery.data ?? []} />
        {customersQuery.isLoading && (
          <div className="mt-2 flex justify-center">
            <Loader />
          </div>
        )}
        <CustomerModal
          customer={{} as Customer}
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
        />
      </div>
    </>
  );
};

export default CustomerPage;
