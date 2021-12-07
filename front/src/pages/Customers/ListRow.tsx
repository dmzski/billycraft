import { Table } from "@coco-ui/core";
import React from "react";
import { useParams, useHistory } from "react-router-dom";
import CustomerModal from "pages/Customers/Modals/CustomerModal";
import Customer from "models/Customer";
import { ROUTES } from "routes";

const QuoteTableLine = ({ customer }: { customer: Customer }): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const editCustomer = () => {
    if (customer.id)
      history.push(ROUTES.CUSTOMER_FORM.path.replace(":id", `${customer.id}`));
  };

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
          isOpen={id === `${customer.id}`}
          onRequestClose={(e: any) => {
            if (e) e.stopPropagation();
            history.push(ROUTES.CUSTOMERS.path);
          }}
          customer={customer}
        />
      </Table.Cell>
    </Table.Row>
  );
};

export default QuoteTableLine;
