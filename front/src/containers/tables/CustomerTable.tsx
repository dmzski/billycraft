import React from "react";
import { Table, useTableState } from "@coco-ui/core";
import CustomerTableLine from "../../components/customer/CustomerTableLine";

const CustomerTable = ({ data = [] }: any): JSX.Element => {
  const { data: customers, sort, onSort } = useTableState({ data, initialSort: { field: "name", order: "asc" } });

  return (
    <Table className="mt-2" data={customers}>
      <Table.Head>
        <Table.Row>
          <Table.HeadCell sort={sort} onSort={onSort} sortable="name">
            Nom
          </Table.HeadCell>
          <Table.HeadCell sort={sort} onSort={onSort} sortable="contact">
            Contact
          </Table.HeadCell>
          <Table.HeadCell sort={sort} onSort={onSort} sortable="phone">
            Téléphone
          </Table.HeadCell>
          <Table.HeadCell sort={sort} onSort={onSort} sortable="email">
            Email
          </Table.HeadCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>{({ row }) => <CustomerTableLine key={row.id} customer={row} />}</Table.Body>
    </Table>
  );
};

export default CustomerTable;
