import React from "react";
import { calculatePriceTTC } from "../../utils/bill";

type BillLineTableLine = {
  line: any;
  setLine: (newLine: any) => void;
  tva: number;
  deleteLine: () => void;
};
const BillLineTableLine: React.FC<any> = ({ line, setLine, tva, deleteLine, disabled }) => {
  const handleChange = (field: string) => (e: any) => {
    const tmp = { ...line };
    let value: any;
    switch (field) {
      case "price":
      case "quantity":
        value = parseFloat(e.target.value);
        break;
      default:
        value = e.target.value;
    }
    tmp[field] = value;
    setLine(tmp);
  };

  return (
    <tr className={"bill-table-line low-py"}>
      <td className="text-left">
        <div className={"line-input " + (disabled ? "disabled" : "")}>
          <input disabled={disabled} className="w-full" value={line.description} onChange={handleChange("description")} />
        </div>
      </td>
      <td className="text-center">
        <div className={"line-input " + (disabled ? "disabled" : "")}>
          <input
            disabled={disabled}
            className="text-right"
            placeholder="Quantité"
            type="number"
            step="0.01"
            value={line.quantity || ""}
            onChange={handleChange("quantity")}
          />
        </div>
      </td>
      <td className="text-center">
        <div className={"line-input " + (disabled ? "disabled" : "")}>
          <input
            disabled={disabled}
            className="text-right"
            placeholder="Prix"
            type="number"
            step="0.01"
            value={line.price || ""}
            onChange={handleChange("price")}
          />
        </div>
      </td>
      <td className="align-text-right">{Math.round(calculatePriceTTC(line, tva) * 100) / 100 || 0} €</td>
      <td className="align-text-right">{Math.round(calculatePriceTTC(line, tva) * line.quantity * 100) / 100 || 0} €</td>
      <td className="text-center">
        {!disabled && (
          <button className="px-2" onClick={deleteLine}>
            <span className="material-icons">delete</span>
          </button>
        )}
      </td>
    </tr>
  );
};

export default BillLineTableLine;
