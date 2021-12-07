import { Modal } from "@coco-ui/core";
import React from "react";
import { useQueryCache } from "react-query";
import Customer from "../../../models/Customer";
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
  const queryCache = useQueryCache();

  const onSubmitSuccess = (data: Customer) => {
    queryCache.invalidateQueries("customers");
    if (data.deleted) onRequestClose();
  };

  return (
    <Modal open={isOpen} onClose={onRequestClose}>
      <CustomerForm customer={customer} onSubmitSuccess={onSubmitSuccess} />
    </Modal>
  );
};

export default CustomerModal;
