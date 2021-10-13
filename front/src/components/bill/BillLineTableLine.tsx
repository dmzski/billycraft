import { Icon, Select, Table, TextInput } from "@coco-ui/core";
import React from "react";
import { LINE_TYPE } from "../../constants/line";
import { calculatePriceTTC } from "../../utils/bill";

type BillLineTableLineProps = {
  line: any;
  setLine: (newLine: any) => void;
  tva: number;
  deleteLine: () => void;
  disabled?: boolean;
};
const BillLineTableLine = ({
  line,
  setLine,
  tva,
  deleteLine,
  disabled,
}: BillLineTableLineProps): JSX.Element => {
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
      <Table.Cell className="pl-2 py-2">
        <Select
          disabled={disabled}
          tabIndex={0}
          value={line.type}
          onChange={(result) => setLine({ ...line, type: result })}
          options={Object.values(LINE_TYPE).map((type) => ({
            value: type.enum,
            label: type.name,
          }))}
          name={line.line + "-select"}
          id={line.line + "-select"}
        />
      </Table.Cell>
      <Table.Cell className="px-1">
        <TextInput
          placeholder="Nom"
          className="w-full"
          disabled={disabled}
          value={line.name}
          onChange={handleChange("name")}
          id={"line-" + line.line + "-name"}
          name={"line-" + line.line + "-name"}
        />
      </Table.Cell>
      <Table.Cell className="px-1">
        <TextInput
          placeholder="Description"
          className="w-full flex my-2"
          disabled={disabled}
          value={line.description}
          multiline
          autoResizeHeight
          onChange={handleChange("description")}
          id={"line-" + line.line + "-description"}
          name={"line-" + line.line + "-description"}
        />
      </Table.Cell>
      <Table.Cell className="px-1">
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
      <Table.Cell className="px-1">
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
      <Table.Cell className="px-1 text-right">
        {Math.round(calculatePriceTTC(line, tva) * 100) / 100 || 0} €
      </Table.Cell>
      <Table.Cell className="px-1 text-right">
        {Math.round(calculatePriceTTC(line, tva) * line.quantity * 100) / 100 ||
          0}{" "}
        €
      </Table.Cell>
      <Table.Cell className="px-1">
        {!disabled && (
          <button
            type="button"
            className="w-full flex justify-center items-center apperance-none"
            onClick={deleteLine}
          >
            <Icon
              name="trash"
              className="p-1 flex text-white rounded-full bg-error-600"
            />
          </button>
        )}
      </Table.Cell>
    </>
  );
};

export default BillLineTableLine;
