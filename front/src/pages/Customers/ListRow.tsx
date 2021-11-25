import { Table } from "@coco-ui/core";
import React from "react";
import { useParams } from "react-router-dom";
import CustomerModal from "pages/Customers/Modals/CustomerModal";
import Customer from "models/Customer";

const QuoteTableLine = ({ customer }: { customer: Customer }): JSX.Element => {
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
      <Table.Cell className="truncate py-3 pl-2 w-1/3">
        {customer.name}
      </Table.Cell>
      <Table.Cell className="truncate w-1/3">{customer.contact}</Table.Cell>
      <Table.Cell className="w-48">
        {customer.phoneNumber
          ? customer.phoneNumber.replace(
              /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
              "$1 $2 $3 $4 $5"
            )
          : ""}
      </Table.Cell>
      <Table.Cell className="w-48">
        {customer.email}
        <CustomerModal
          isOpen={modalIsOpen}
          onRequestClose={(e: any) => {
            if (e) e.stopPropagation();
            setIsOpen(false);
          }}
          customer={customer}
        />
      </Table.Cell>
    </Table.Row>
  );
};

export default QuoteTableLine;
