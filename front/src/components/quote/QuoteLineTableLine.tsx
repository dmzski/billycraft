import { Icon, Select, Table, TextInput } from "@coco-ui/core";
import React from "react";
import { LINE_TYPE } from "../../constants/line";
import { calculatePriceTTC } from "../../utils/quote";

type QuoteLineTableLineProps = {
  line: any;
  setLine: (newLine: any) => void;
  tva: number;
  deleteLine: () => void;
  disabled?: boolean;
};
const QuoteLineTableLine = ({ line, setLine, tva, deleteLine, disabled }: QuoteLineTableLineProps): JSX.Element => {
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
    <>
      <Table.Cell>
        <Select
          disabled={disabled}
          value={line.type}
          onChange={(result) => setLine({ ...line, type: result.enum })}
          textKey="name"
          valueKey="enum"
          options={Object.values(LINE_TYPE)}
          name={line.line + "-select"}
          id={line.line + "-select"}
        />
      </Table.Cell>
      <Table.Cell>
        <TextInput
          placeholder="Description"
          className="w-full flex"
          disabled={disabled}
          value={line.description}
          multiline
          onChange={handleChange("description")}
          id={"line-" + line.line + "-description"}
          name={"line-" + line.line + "-description"}
        />
      </Table.Cell>
      <Table.Cell>
        <TextInput
          disabled={disabled}
          className="text-right w-full"
          placeholder="Quantité"
          type="number"
          step="0.01"
          value={line.quantity || line.quantity === 0 ? line.quantity : ""}
          onChange={handleChange("quantity")}
        />
      </Table.Cell>
      <Table.Cell>
        <TextInput
          disabled={disabled}
          className="text-right w-full"
          placeholder="Prix"
          type="number"
          step="0.01"
          value={line.price || line.price === 0 ? line.price : ""}
          onChange={handleChange("price")}
        />
      </Table.Cell>
      <Table.Cell>{Math.round(calculatePriceTTC(line, tva) * 100) / 100 || 0} €</Table.Cell>
      <Table.Cell>{Math.round(calculatePriceTTC(line, tva) * line.quantity * 100) / 100 || 0} €</Table.Cell>
      <Table.Cell className="pr-1">
        {!disabled && (
          <button className="apperance-none">
            <Icon name="trash" className="p-1 flex text-white rounded-full bg-error-600" onClick={deleteLine} />
          </button>
        )}
      </Table.Cell>
    </>
  );
};

export default QuoteLineTableLine;
