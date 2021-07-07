import { Table, useTableState } from "@coco-ui/core";
import React from "react";
import BillTableLine from "../../components/bill/BillTableLine";

const BillList = ({ data }: any): JSX.Element => {
  const { sort, onSort, data: bills } = useTableState({ data, initialSort: { field: "createdAt", order: "desc" } });

  return (
    <Table className="text-left mt-4 w-full table-fixed" data={bills}>
      <Table.Head>
        <Table.Row>
          <Table.HeadCell className="w-1/3 py-3 pl-2" sort={sort} sortable="title" onSort={onSort}>
            Titre
          </Table.HeadCell>
          <Table.HeadCell className="w-1/4" sort={sort} sortable="customer" onSort={onSort}>
            Client
          </Table.HeadCell>
          <Table.HeadCell className="w-48" sort={sort} sortable="createdAt" onSort={onSort}>
            Création
          </Table.HeadCell>
          <Table.HeadCell className="w-48" sort={sort} sortable="sentAt" onSort={onSort}>
            Envoyé
          </Table.HeadCell>
          <Table.HeadCell className="w-48" sort={sort} sortable="total" onSort={onSort}>
            Total
          </Table.HeadCell>
          <Table.HeadCell className="w-48" sort={sort} sortable="status" onSort={onSort}>
            Status
          </Table.HeadCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>{({ row }) => <BillTableLine key={row.id} bill={row} />}</Table.Body>
    </Table>
  );
};

export default BillList;
