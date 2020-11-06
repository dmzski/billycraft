import React from "react";
import QuoteLineTableLine from "../../components/quote/QuoteLineTableLine";

const QuoteLineTable: React.FC<any> = ({ quote, setQuote, disabled }) => {
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
    <table className="table-fixed quote-table w-auto">
      <thead>
        <tr>
          <th className="w-1/3 px-4 py-2">Description</th>
          <th className="w-1/6 px-4 py-2">Quantité</th>
          <th className="w-1/6 px-4 py-2">Prix H.T</th>
          <th className="w-1/6 px-4 py-2">Prix TTC</th>
          <th className="w-1/6 px-4 py-2">Sous Total</th>
          <th className="w-1/12 px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {quote.lines &&
          quote.lines.map((line: any, index: number) => (
            <QuoteLineTableLine disabled={disabled} key={index} tva={quote.tva} line={line} deleteLine={deleteLine(index)} setLine={setLine(index)} />
          ))}
      </tbody>
    </table>
  );
};

export default QuoteLineTable;
