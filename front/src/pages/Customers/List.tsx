import React from "react";
import { Table, useTableState } from "@coco-ui/core";
import CustomerTableLine from "./ListRow";
import Customer from "models/Customer";

const CustomerTable = ({ data = [] }: { data: Customer[] }): JSX.Element => {
  const { data: customers, sort, onSort } = useTableState({
    data,
    initialSort: { field: "name", order: "asc" },
  });

  return (
    <Table className="mt-2 w-full text-left">
      <Table.Head>
        <Table.Row>
          <Table.HeadCell
            className="w-1/3 py-3 pl-2"
            sort={sort}
            onSort={onSort}
            sortable="name"
          >
            Nom
          </Table.HeadCell>
          <Table.HeadCell
            className="w-1/3"
            sort={sort}
            onSort={onSort}
            sortable="contact"
          >
            Contact
          </Table.HeadCell>
          <Table.HeadCell
            className="w-48"
            sort={sort}
            onSort={onSort}
            sortable="phone"
          >
            Téléphone
          </Table.HeadCell>
          <Table.HeadCell
            className="w-48"
            sort={sort}
            onSort={onSort}
            sortable="email"
          >
            Email
          </Table.HeadCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {customers.map((customer) => (
          <CustomerTableLine key={customer.id} customer={customer} />
        ))}
      </Table.Body>
    </Table>
  );
};

export default CustomerTable;
