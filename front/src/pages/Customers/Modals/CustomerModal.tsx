import { Modal } from "@coco-ui/core";
import { CustomerApi } from "api/CustomerApi";
import React from "react";
import { useMutation, useQueryCache } from "react-query";
import Customer from "../../../models/Customer";
import { useToast } from "../../../providers/ToastProvider";
import CustomerForm from "../Form/Form";

type CustomerModalProps = {
  isOpen: boolean;
  onRequestClose: (e?: MouseEvent) => void;
  customer?: Customer;
};
const CustomerModal = ({
  isOpen,
  onRequestClose,
  customer,
}: CustomerModalProps): JSX.Element => {
  const [newCustomer, setNewCustomer] = React.useState<Customer>(
    {} as Customer
  );
  const toast = useToast();
  const queryCache = useQueryCache();
  const [customerMutation, { isLoading }] = useMutation(
    CustomerApi.createOrUpdate,
    {
      onSuccess: () => {
        toast.show({ message: "Enregistrement réussi", variant: "success" });
        onRequestClose();
      },
      throwOnError: true,
    }
  );

  const saveCustomer = async (e: any) => {
    e.preventDefault();

    try {
      await customerMutation(newCustomer);
      queryCache.invalidateQueries("customers-query");
    } catch (error) {
      toast.show({
        message: "Erreur lors de l'enregistrement",
        variant: "error",
      });
      console.error("Error !!!", error);
    }
  };

  React.useEffect(() => {
    setNewCustomer(customer ? customer : ({} as Customer));
  }, [customer]);

  return (
    <Modal open={isOpen} onClose={onRequestClose}>
      <CustomerForm
        setCustomer={setNewCustomer}
        customer={newCustomer}
        isLoading={isLoading}
        onSubmit={saveCustomer}
        disabled={isLoading}
      />
    </Modal>
  );
};

export default CustomerModal;
