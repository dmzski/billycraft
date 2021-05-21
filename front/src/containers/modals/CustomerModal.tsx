import { Modal } from "@coco-ui/core";
import React from "react";
import { useMutation, useQueryCache } from "react-query";
import { CustomerGraphQL } from "../../graphql/CustomerGraphQL";
import { Customer } from "../../models/Customer";
import { useToast } from "../../providers/ToastProvider";
import CustomerForm from "../forms/CustomerForm";

const CustomerModal = ({ isOpen, onRequestClose, customer }: any): JSX.Element => {
  const [newCustomer, setNewCustomer] = React.useState<Customer>(new Customer());
  const toast = useToast();
  const queryCache = useQueryCache();
  const [customerMutation, { isLoading, isError }] = useMutation(CustomerGraphQL.createOrUpdateCustomer, {
    onSuccess: () => {
      toast.show({ message: "Enregistrement réussi", variant: "success" });
      onRequestClose();
    },
    throwOnError: true,
  });

  const saveCustomer = async (e: any) => {
    e.preventDefault();

    try {
      await customerMutation(newCustomer);
      queryCache.invalidateQueries("customers-query");
    } catch (error) {
      toast.show({ message: "Erreur lors de l'enregistrement", variant: "error" });
      console.error("Error !!!", error);
    }
  };

  React.useEffect(() => {
    setNewCustomer(customer ? customer : new Customer());
  }, [customer]);

  return (
    <Modal open={isOpen} onClose={onRequestClose}>
      <CustomerForm
        setCustomer={setNewCustomer}
        customer={newCustomer}
        closeModal={onRequestClose}
        isLoading={isLoading}
        onSubmit={saveCustomer}
        disabled={isLoading}
      />
      {isError && <div className="mt-3">Une erreur est survenue</div>}
    </Modal>
  );
};

export default CustomerModal;
