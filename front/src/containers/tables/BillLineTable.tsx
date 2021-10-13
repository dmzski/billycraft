import { Table } from "@coco-ui/core";
import Bill from "models/Bill";
import React from "react";
import BillLineTableLine from "../../components/bill/BillLineTableLine";

type BillLineTableProps = {
  bill: Bill;
  setBill: React.Dispatch<React.SetStateAction<Bill>>;
  disabled?: boolean;
};
const BillLineTable = ({
  bill,
  setBill,
  disabled,
}: BillLineTableProps): JSX.Element => {
  function deleteLine(index: number) {
    return () => {
      const newLines = [...bill.lines];
      newLines.splice(
        bill.lines.findIndex(({ line }) => line === index),
        1
      );
      setBill({ ...bill, lines: newLines });
    };
  }

  function setLine(index: number) {
    return (newLine: any) => {
      const newLines = [...bill.lines];
      newLines[bill.lines.findIndex(({ line }) => line === index)] = newLine;
      setBill({ ...bill, lines: newLines });
    };
  }

  return (
    <Table className="table-fixed w-full">
      <Table.Head>
        <Table.Row>
          <Table.HeadCell className="w-48 py-2 pl-2">Type</Table.HeadCell>
          <Table.HeadCell className="w-full px-1">Nom</Table.HeadCell>
          <Table.HeadCell className="w-full px-1">Description</Table.HeadCell>
          <Table.HeadCell className="w-28 px-1">Quantité</Table.HeadCell>
          <Table.HeadCell className="w-36 px-1 text-right">
            Prix HT
          </Table.HeadCell>
          <Table.HeadCell className="w-36 px-1 text-right">
            Prix TTC
          </Table.HeadCell>
          <Table.HeadCell className="w-36 px-1 text-right">
            Sous Total
          </Table.HeadCell>
          <Table.HeadCell className="w-12" />
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {bill.lines?.map((line: any) => (
          <Table.Row key={line.line}>
            <BillLineTableLine
              disabled={disabled}
              tva={bill.tva}
              line={line}
              deleteLine={deleteLine(line.line)}
              setLine={setLine(line.line)}
            />
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default BillLineTable;
