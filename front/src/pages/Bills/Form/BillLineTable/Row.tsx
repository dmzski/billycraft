import { Icon, List, Select, TextInput } from "@coco-ui/core";
import { LineTypeEnum } from "models/LineTypeEnum";
import React from "react";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import { LINE_TYPE } from "constants/line";
import { calculatePriceTTC } from "utils/bill";

type BillLineTableLineProps = {
  line: any;
  setLine: (newLine: any) => void;
  tva: number;
  deleteLine: () => void;
  disabled?: boolean;
  provided?: DraggableProvided;
  snapshot?: DraggableStateSnapshot;
};
const BillLineTableLine = ({
  line,
  setLine,
  tva,
  deleteLine,
  disabled,
  provided,
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
    <div ref={provided?.innerRef} {...provided?.draggableProps}>
      <List.Row className="bg-background">
        <List.Cell
          {...provided?.dragHandleProps}
          className="w-12 items-center flex"
        >
          <Icon name="selector" size={12} />
        </List.Cell>
        <List.Cell className="w-48">
          <Select
            disabled={disabled}
            tabIndex={0}
            value={line.type}
            onChange={(type) =>
              setLine({ ...line, type: type as LineTypeEnum })
            }
            options={Object.values(LINE_TYPE).map((type) => ({
              value: type.enum,
              label: type.name,
            }))}
            name={line.line + "-select"}
            id={line.line + "-select"}
          />
        </List.Cell>
        <List.Cell className="w-72">
          <TextInput
            required
            placeholder="Nom"
            className="w-full"
            disabled={disabled}
            value={line.name}
            onChange={handleChange("name")}
            id={"line-" + line.line + "-name"}
            name={"line-" + line.line + "-name"}
          />
        </List.Cell>
        <List.Cell className="w-full">
          <TextInput
            placeholder="Description"
            className="w-full flex"
            disabled={disabled}
            value={line.description}
            multiline
            autoResizeHeight
            onChange={handleChange("description")}
            id={"line-" + line.line + "-description"}
            name={"line-" + line.line + "-description"}
          />
        </List.Cell>
        <List.Cell className="w-36">
          <TextInput
            disabled={disabled}
            className="text-right w-full"
            placeholder="Quantité"
            type="number"
            step="0.01"
            value={line.quantity || line.quantity === 0 ? line.quantity : ""}
            onChange={handleChange("quantity")}
          />
        </List.Cell>
        <List.Cell className="w-48">
          <TextInput
            disabled={disabled}
            className="text-right w-full"
            placeholder="Prix"
            type="number"
            step="0.01"
            value={line.price || line.price === 0 ? line.price : ""}
            onChange={handleChange("price")}
          />
        </List.Cell>
        <List.Cell className="w-48 py-2">
          {Math.round(calculatePriceTTC(line, tva) * 100) / 100 || 0} €
        </List.Cell>
        <List.Cell className="w-48 py-2">
          {Math.round(calculatePriceTTC(line, tva) * line.quantity * 100) /
            100 || 0}{" "}
          €
        </List.Cell>
        <List.Cell className="w-24 py-2">
          {!disabled ? (
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
          ) : null}
        </List.Cell>
      </List.Row>
    </div>
  );
};

export default BillLineTableLine;
