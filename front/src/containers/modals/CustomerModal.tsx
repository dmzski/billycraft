import React from "react";
import { useMutation, useQueryCache } from "react-query";
import { CustomerGraphQL } from "../../graphql/CustomerGraphQL";
import { Customer } from "../../models/Customer";
import { useToast } from "../../providers/ToastProvider";
import CustomerForm from "../forms/CustomerForm";
import CustomModal from "./CustomModal";

const CustomerModal: React.FC<any> = ({ isOpen, onRequestClose, customer }) => {
  const [newCustomer, setNewCustomer] = React.useState<Customer>(new Customer());
  const toast = useToast();
  const queryCache = useQueryCache();
  const [customerMutation, { isLoading, isError }] = useMutation(CustomerGraphQL.createOrUpdateCustomer, {
    onSuccess: () => {
      onRequestClose();
      toast.show({ message: "Enregistrement réussi", variant: "success" });
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
    <CustomModal isOpen={isOpen} onRequestClose={onRequestClose} style={{ content: { minWidth: "80%" } }}>
      <CustomerForm
        setCustomer={setNewCustomer}
        customer={newCustomer}
        closeModal={onRequestClose}
        isLoading={isLoading}
        onSubmit={saveCustomer}
        disabled={isLoading}
      />
      {isError && <div className="mt-3">Une erreur est survenue</div>}
    </CustomModal>
  );
};

export default CustomerModal;
