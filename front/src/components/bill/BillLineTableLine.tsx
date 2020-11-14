import React from "react";
import { useMutation, useQuery } from "react-query";
import { LINE_TYPE } from "../../constants/line";
import { ProductGraphQL } from "../../graphql/ProductGraphQL";
import { useToast } from "../../providers/ToastProvider";
import { calculatePriceTTC } from "../../utils/bill";
import BaseSelect from "../inputs/BaseSelect";
import MultiLineInput from "../inputs/MultiLineInput";
import MultiLineInputAutoComplete from "../inputs/MultiLineInputAutoComplete";

type BillLineTableLine = {
  line: any;
  setLine: (newLine: any) => void;
  tva: number;
  deleteLine: () => void;
};
const BillLineTableLine: React.FC<any> = ({ line, setLine, tva, deleteLine, disabled }) => {
  const toast = useToast();
  const productsContainDescription = useQuery(["products-contain", line.description], ProductGraphQL.getAllProductsContains, {
    refetchOnWindowFocus: false,
    enabled: line.description && line.description.length >= 3,
    keepPreviousData: true,
  });
  const [productOptions, setProductOptions] = React.useState([]);
  const [saveProductMutation, saveProductMutationState] = useMutation(ProductGraphQL.saveProduct);

  const onOptionClick = (event: any, value: any) => {
    const tmp = { ...line };
    tmp.description = value.description;
    tmp.price = value.price;
    setLine(tmp);
  };

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

  const saveAsModel = async (event: any) => {
    try {
      const result = await saveProductMutation({ description: line.description, price: line.price });
      toast.show({ message: "Modèle enregistré", variant: "success" });
    } catch (error) {
      toast.show({ message: "Erruer lors de l'enregistrement", variant: "error" });
    }
  };

  const isLineInProducts = React.useCallback(() => {
    if (productOptions) {
      return productOptions.some((product: any) => product.description === line.description && product.price === line.price);
    }
    return false;
  }, [line, productOptions]);

  React.useEffect(() => {
    if (!productsContainDescription.isPreviousData) {
      setProductOptions(productsContainDescription.data);
    }
  }, [productsContainDescription]);

  return (
    <tr className={"bill-table-line low-py"}>
      <td className="text-left">
        <BaseSelect
          disabled={disabled}
          value={line.type}
          onChange={handleChange("type")}
          options={Object.values(LINE_TYPE).map((value: any, index: any) => ({ name: value.name, id: value.enum }))}
          name={line.line + "-select"}
        />
      </td>
      <td className="text-left">
        <div className={"relative line-input " + (disabled ? "disabled" : "")}>
          <MultiLineInputAutoComplete
            placeholder="Description"
            className="w-full"
            disabled={disabled}
            value={line.description}
            onChange={handleChange("description")}
            wrap="hard"
            isLoading={productsContainDescription.isLoading}
            isError={productsContainDescription.isError}
            options={productOptions}
            id={"line-" + line.line + "-description"}
            onOptionClick={onOptionClick}
          />
          {line.description && line.description.length > 0 && !isLineInProducts() && (
            <div className="absolute right-0 flex justify-center items-center h-full pb-2">
              <button
                disabled={saveProductMutationState.isLoading}
                type="button"
                onClick={saveAsModel}
                className=" outline-none hover:bg-gray-200 h-12 w-12 p-2 rounded-full active:outline-none focus:outline-none material-icons text-primary-700"
                title="Sauvegarder comme modèle"
              >
                save
              </button>
            </div>
          )}
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
          <button className="px-2" type="button" onClick={deleteLine}>
            <span style={{ padding: 0 }} className="material-icons">
              delete
            </span>
          </button>
        )}
      </td>
    </tr>
  );
};

export default BillLineTableLine;
