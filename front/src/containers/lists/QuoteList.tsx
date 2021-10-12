import { Table, useTableState } from "@coco-ui/core";
import React from "react";
import QuoteTableLine from "../../components/quote/QuoteTableLine";

const QuoteList = ({ data }: any): JSX.Element => {
  const { data: quotes, sort, onSort } = useTableState({ data, initialSort: { field: "createdAt", order: "desc" } });

  return (
    <Table hoverable className="w-full mt-4 table-fixed text-left" data={quotes}>
      <Table.Head>
        <Table.Row>
          <Table.HeadCell className="pl-2 w-1/3 py-3" sort={sort} sortable="title" onSort={onSort}>
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
      <Table.Body>
        {quotes.map((quote) => (
          <QuoteTableLine key={quote.id} quote={quote} />
        ))}
      </Table.Body>
    </Table>
  );
};

export default QuoteList;
