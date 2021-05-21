import { Table } from "@coco-ui/core";
import React from "react";
import { useParams } from "react-router-dom";
import CustomerModal from "../../containers/modals/CustomerModal";

const QuoteTableLine = ({ customer }: any): JSX.Element => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const { id } = useParams<any>();

  const editCustomer = () => {
    setIsOpen(true);
  };

  React.useEffect(() => {
    if (customer && id === customer.id) {
      setIsOpen(true);
    }
  }, [id, customer]);

  return (
    <Table.Row hoverable onClick={editCustomer}>
      <Table.Cell>{customer.name}</Table.Cell>
      <Table.Cell>{customer.contact}</Table.Cell>
      <Table.Cell>{customer.phoneNumber ? customer.phoneNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5") : ""}</Table.Cell>
      <Table.Cell>{customer.email}</Table.Cell>
      <CustomerModal
        isOpen={modalIsOpen}
        onRequestClose={(e: any) => {
          if (e) e.stopPropagation();
          setIsOpen(false);
        }}
        customer={customer}
      />
    </Table.Row>
  );
};

export default QuoteTableLine;
