import { format } from "date-fns";
import React from "react";
import { QUOTE_STATUS } from "../../constants/quote";
import { calculatePriceTTC } from "../../utils/quote";

type QuoteLineTableLine = {
  line: any;
  setLine: (newLine: any) => void;
  tva: number;
  deleteLine: () => void;
};
const QuoteLineTableLine: React.FC<any> = ({ line, setLine, tva, deleteLine, disabled }) => {
  const handleChange = (field: string) => (e: any) => {
    const tmp = { ...line };
    let value: any;
    switch (field) {
      case "price":
      case "quantity":
        value = e.target.value;
        break;
      default:
        value = e.target.value;
    }
    tmp[field] = value;
    setLine(tmp);
  };

  return (
    <tr className={"quote-table-line low-py"}>
      <td>
        <div className={"line-input " + (disabled ? "disabled" : "")}>
          <input disabled={disabled} className="w-full" value={line.description} onChange={handleChange("description")} />
        </div>
      </td>
      <td>
        <div className={"line-input " + (disabled ? "disabled" : "")}>
          <input
            disabled={disabled}
            className="text-right"
            placeholder="Quantité"
            type="text"
            value={line.quantity || ""}
            onChange={handleChange("quantity")}
          />
        </div>
      </td>
      <td>
        <div className={"line-input " + (disabled ? "disabled" : "")}>
          <input disabled={disabled} className="text-right" placeholder="Prix" type="text" value={line.price || ""} onChange={handleChange("price")} />
        </div>
      </td>
      <td className="align-text-right">{Math.round(calculatePriceTTC(line, tva) * 100) / 100 || 0} €</td>
      <td className="align-text-right">{Math.round(calculatePriceTTC(line, tva) * line.quantity * 100) / 100 || 0} €</td>
      <td>
        {!disabled && (
          <button className="px-2" onClick={deleteLine}>
            <span className="material-icons">delete</span>
          </button>
        )}
      </td>
    </tr>
  );
};

export default QuoteLineTableLine;
