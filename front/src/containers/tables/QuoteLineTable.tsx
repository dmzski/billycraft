import { Table } from "@coco-ui/core";
import React from "react";
import QuoteLineTableLine from "../../components/quote/QuoteLineTableLine";

const QuoteLineTable = ({ quote, setQuote, disabled }: any): JSX.Element => {
  function deleteLine(index: number) {
    return () => {
      const newLines = [...quote.lines];
      newLines.splice(index, 1);
      setQuote({ ...quote, lines: newLines });
    };
  }

  function setLine(index: number) {
    return (newLine: any) => {
      const newLines = [...quote.lines];
      newLines[index] = newLine;
      setQuote({ ...quote, lines: newLines });
    };
  }

  return (
    <Table className="table-fixed">
      <Table.Head>
        <Table.Row>
          <Table.HeadCell className="w-48">Type</Table.HeadCell>
          <Table.HeadCell className="w-full">Description</Table.HeadCell>
          <Table.HeadCell className="w-32">Quantité</Table.HeadCell>
          <Table.HeadCell className="w-48">Prix HT</Table.HeadCell>
          <Table.HeadCell className="w-32">Prix TTC</Table.HeadCell>
          <Table.HeadCell className="w-36">Sous Total</Table.HeadCell>
          <Table.HeadCell className="w-8" />
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {quote.lines &&
          quote.lines.map((line: any, index: number) => (
            <Table.Row key={index}>
              <QuoteLineTableLine disabled={disabled} tva={quote.tva} line={line} deleteLine={deleteLine(index)} setLine={setLine(index)} />
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
};

export default QuoteLineTable;
