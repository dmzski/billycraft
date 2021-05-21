import { Table } from "@coco-ui/core";
import React from "react";
import BillLineTableLine from "../../components/bill/BillLineTableLine";

const BillLineTable = ({ bill, setBill, disabled }: any): JSX.Element => {
  function deleteLine(index: number) {
    return () => {
      const newLines = [...bill.lines];
      newLines.splice(index, 1);
      setBill({ ...bill, lines: newLines });
    };
  }

  function setLine(index: number) {
    return (newLine: any) => {
      const newLines = [...bill.lines];
      newLines[index] = newLine;
      setBill({ ...bill, lines: newLines });
    };
  }

  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.HeadCell>Type</Table.HeadCell>
          <Table.HeadCell>Description</Table.HeadCell>
          <Table.HeadCell>Quantité</Table.HeadCell>
          <Table.HeadCell>Prix HT</Table.HeadCell>
          <Table.HeadCell>Prix TTC</Table.HeadCell>
          <Table.HeadCell>Sous Total</Table.HeadCell>
          <Table.HeadCell className="w-8" />
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {bill.lines &&
          bill.lines.map((line: any, index: number) => (
            <Table.Row key={index}>
              <BillLineTableLine disabled={disabled} tva={bill.tva} line={line} deleteLine={deleteLine(index)} setLine={setLine(index)} />
            </Table.Row>
          ))}
      </Table.Body>
    </Table>
  );
};

export default BillLineTable;
