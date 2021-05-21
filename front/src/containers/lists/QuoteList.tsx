import { Table, useTableState } from "@coco-ui/core";
import React from "react";
import QuoteTableLine from "../../components/quote/QuoteTableLine";

const QuoteList = ({ data }: any): JSX.Element => {
  const { data: quotes, sort, onSort } = useTableState({ data, initialSort: { field: "createdAt", order: "desc" } });

  return (
    <Table className="mt-4 table-fixed" data={quotes}>
      <Table.Head>
        <Table.Row>
          <Table.HeadCell sort={sort} sortable="title" onSort={onSort}>
            Titre
          </Table.HeadCell>
          <Table.HeadCell sort={sort} sortable="customer" onSort={onSort}>
            Client
          </Table.HeadCell>
          <Table.HeadCell sort={sort} sortable="createdAt" onSort={onSort}>
            Création
          </Table.HeadCell>
          <Table.HeadCell sort={sort} sortable="sentAt" onSort={onSort}>
            Envoyé
          </Table.HeadCell>
          <Table.HeadCell sort={sort} sortable="total" onSort={onSort}>
            Total
          </Table.HeadCell>
          <Table.HeadCell sort={sort} sortable="status" onSort={onSort}>
            Status
          </Table.HeadCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>{({ row }) => <QuoteTableLine key={row.id} quote={row} />}</Table.Body>
    </Table>
  );
};

export default QuoteList;
