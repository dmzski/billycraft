import { format } from "date-fns";
import React from "react";
import { LINE_TYPE } from "../../constants/line";
import { QUOTE_STATUS } from "../../constants/quote";
import { calculatePriceTTC } from "../../utils/quote";
import BaseSelect from "../inputs/BaseSelect";
import MultiLineInput from "../inputs/MultiLineInput";

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
        value = parseFloat(e.target.value) || e.target.value;
        break;
      default:
        value = e.target.value;
    }
    tmp[field] = value;
    setLine(tmp);
  };

  return (
    <tr id={"quote-table-line-" + line.line} className={"quote-table-line low-py"}>
      <td className="text-left">
        <BaseSelect
          disabled={disabled}
          value={line.type}
          onChange={handleChange("type")}
          options={Object.values(LINE_TYPE).map((value: any, index: any) => ({ name: value.name, id: value.enum }))}
          name={line.line + "-select"}
          id={line.line + "-select"}
        />
      </td>
      <td className="text-left">
        <div className={"line-input " + (disabled ? "disabled" : "")}>
          <MultiLineInput
            placeholder="Description"
            className="w-full"
            disabled={disabled}
            value={line.description}
            onChange={handleChange("description")}
            wrap="hard"
          />
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
            <span style={{ padding: 0 }} className="material-icons">
              delete
            </span>
          </button>
        )}
      </td>
    </tr>
  );
};

export default QuoteLineTableLine;
