import { Icon, Select, Table, TextInput } from "@coco-ui/core";
import React from "react";
import { useQuery } from "react-query";
import { LINE_TYPE } from "../../constants/line";
import { ProductGraphQL } from "../../graphql/ProductGraphQL";
import { calculatePriceTTC } from "../../utils/bill";

type BillLineTableLineProps = {
  line: any;
  setLine: (newLine: any) => void;
  tva: number;
  deleteLine: () => void;
  disabled?: boolean;
};
const BillLineTableLine = ({ line, setLine, tva, deleteLine, disabled }: BillLineTableLineProps): JSX.Element => {
  const productsContainDescription = useQuery(["products-contain", line.description], ProductGraphQL.getAllProductsContains, {
    refetchOnWindowFocus: false,
    enabled: line.description && line.description.length >= 3,
    keepPreviousData: true,
  });
  const [productOptions, setProductOptions] = React.useState([]);

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

  React.useEffect(() => {
    if (!productsContainDescription.isPreviousData) {
      setProductOptions(productsContainDescription.data);
    }
  }, [productsContainDescription]);

  const typeOptions = Object.values(LINE_TYPE).map((value: any) => ({ label: value.name, value: value.enum }));

  return (
    <>
      <Table.Cell>
        <Select
          disabled={disabled}
          value={typeOptions.find((value) => value.value === line.type)}
          onChange={(result) => setLine({ ...line, type: result.value })}
          options={typeOptions}
          name={line.line + "-select"}
        />
      </Table.Cell>
      <Table.Cell>
        <Select
          placeholder="Description"
          className="w-full flex"
          disabled={disabled}
          value={line.description}
          onSearchChange={(str) => {
            if (str) {
              setLine({ ...line, description: str });
            }
          }}
          isMultiLine
          isSearchable
          isLoading={productsContainDescription.isLoading}
          options={productOptions}
          id={"line-" + line.line + "-description"}
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
      <Table.Cell className="text-center">
        {!disabled && (
          <button className="apperance-none">
            <Icon name="trash" className="p-1 flex text-white rounded-full bg-error-600" onClick={deleteLine} />
          </button>
        )}
      </Table.Cell>
    </>
  );
};

export default BillLineTableLine;
