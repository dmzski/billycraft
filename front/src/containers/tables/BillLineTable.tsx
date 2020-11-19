import React from "react";
import BillLineTableLine from "../../components/bill/BillLineTableLine";

const BillLineTable: React.FC<any> = ({ bill, setBill, disabled }) => {
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
    <table className="bill-table w-full">
      <thead>
        <tr>
          <th className="w-32 px-2 py-2">Type</th>
          <th className="px-2 w-auto py-2 text-left">Description</th>
          <th className="w-32 px-2 py-2">Quantité</th>
          <th className="w-32 px-2 py-2">Prix H.T</th>
          <th className="w-32 px-2 py-2">Prix TTC</th>
          <th className="w-32 px-2 py-2">Sous Total</th>
          <th className="w-12 px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {bill.lines &&
          bill.lines.map((line: any, index: number) => (
            <BillLineTableLine disabled={disabled} key={index} tva={bill.tva} line={line} deleteLine={deleteLine(index)} setLine={setLine(index)} />
          ))}
      </tbody>
    </table>
  );
};

export default BillLineTable;
