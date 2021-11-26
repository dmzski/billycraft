import { Icon, Select, Table, TextInput } from "@coco-ui/core";
import React from "react";
import {
  CheckIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/solid";
import { useMutation, useQueryCache } from "react-query";
import { ProductApi } from "../../api/ProductApi";
import Product from "../../models/Product";
import { useToast } from "../../providers/ToastProvider";
import { LINE_TYPE } from "constants/line";
import { LineTypeEnum } from "models/LineTypeEnum";

type ProductTableLineProps = {
  product: Product;
};

const ProductTableLine = ({ product }: ProductTableLineProps): JSX.Element => {
  const [editMode, setEditMode] = React.useState(product.id ? false : true);
  const [newProduct, setNewProduct] = React.useState(product);
  const [deleteMode, setDeleteMode] = React.useState(false);
  const [saveProductMutation, saveProductMutationState] = useMutation(
    ProductApi.createOrUpdate
  );
  const [deleteProductMutation, deleteProductMutationState] = useMutation(
    ProductApi.delete,
    {
      onSuccess: () => {
        toast.show({ message: "Article supprimé", variant: "success" });
        queryCache.invalidateQueries("products");
      },
      onError: () => {
        toast.show({
          message: "Erreur lors de l'enregistrement",
          variant: "error",
        });
      },
    }
  );
  const queryCache = useQueryCache();

  const toast = useToast();

  const toggleEditMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditMode(!editMode);
  };

  const handleChange = (field: keyof Product) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewProduct((current) => ({
      ...current,
      [field]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.stopPropagation();
    try {
      await saveProductMutation({
        id: product.id,
        description: newProduct.description,
        price:
          `${newProduct.price}` !== ""
            ? parseFloat(`${newProduct.price}`)
            : null,
        type: newProduct.type,
        name: newProduct.name,
      });
      toast.show({
        message: product.id ? "Article modifié" : "Article ajouté",
        variant: "success",
      });
      setEditMode(false);
      queryCache.invalidateQueries("products");
    } catch (error) {
      toast.show({
        message: "Erreur lors de l'enregistrement",
        variant: "error",
      });
    }
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const onDelete = async () => {
    try {
      await deleteProductMutation(product.id);
    } catch (error) {
      console.error("Error", error);
      toast.show({
        message: "Erreur lors de la suppression",
        variant: "error",
      });
    }
  };

  React.useEffect(() => {
    setNewProduct(
      product || {
        type: LineTypeEnum.ARTICLE,
        name: "",
        description: "",
        price: 0,
      }
    );
  }, [editMode, product]);

  return (
    <Table.Row>
      <Table.Cell className="px-1">
        <Select
          className="w-full"
          disabled={!editMode}
          value={newProduct.type}
          onChange={(type) => {
            setNewProduct({ ...newProduct, type: type as LineTypeEnum });
          }}
          options={Object.values(LINE_TYPE).map((type) => ({
            value: type.enum,
            label: type.name,
          }))}
          name={newProduct.id + "-select"}
          id={newProduct.id + "-select"}
        />
      </Table.Cell>
      <Table.Cell className="px-1">
        <div className="flex">
          <TextInput
            className="w-full"
            value={newProduct.name}
            disabled={!editMode}
            onChange={handleChange("name")}
          />
        </div>
      </Table.Cell>
      <Table.Cell className="px-1 py-2">
        <div className="flex">
          <TextInput
            autoResizeHeight
            multiline
            className="w-full"
            value={newProduct.description ?? ""}
            disabled={!editMode}
            onChange={handleChange("description")}
          />
        </div>
      </Table.Cell>
      <Table.Cell className="px-1 w-48">
        <div className="w-full flex mr-1">
          <TextInput
            containerClassName="w-full"
            min={0}
            type="number"
            step={0.1}
            className="w-full text-right"
            value={newProduct.price ?? ""}
            disabled={!editMode}
            onChange={handleChange("price")}
          />
          <span className="mx-2">€</span>
        </div>
      </Table.Cell>
      <Table.Cell className="w-20">
        {deleteMode ? (
          <div className="flex">
            <span className="mr-2">Supprimer ? </span>
            <Icon
              name="check"
              onClick={onDelete}
              className="rounded-full w-8 h-8 p-2 text-white bg-success-600 hover:bg-success-700 mr-1"
            />
            <Icon
              name="x"
              onClick={toggleDeleteMode}
              className="rounded-full text-white bg-error-600 hover:bg-error-700 w-8 h-8 p-2"
            />
          </div>
        ) : editMode ? (
          <div className="flex">
            <button
              onClick={onSubmit}
              disabled={saveProductMutationState.isLoading || !newProduct.name}
              className="appearance-none focus:outline-none"
            >
              <CheckIcon className="rounded-full p-2 w-8 text-white bg-success-600 hover:bg-success-700" />
            </button>
            {product.id && (
              <button
                type="button"
                onClick={toggleEditMode}
                className="ml-1 appearance-none focus:outline-none"
              >
                <XIcon className="rounded-full p-2 text-white bg-error-600 hover:bg-error-700 w-8" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex">
            <button
              type="button"
              onClick={toggleEditMode}
              className="appearance-none focus:outline-none mr-1"
            >
              <PencilIcon className="rounded-full p-2 text-white bg-info-600 hover:bg-info-700 w-8" />
            </button>
            <button
              type="button"
              disabled={deleteProductMutationState.isLoading}
              onClick={toggleDeleteMode}
              className="appearance-none focus:outline-none"
            >
              <TrashIcon className="rounded-full text-white p-2 bg-error-600 hover:bg-error-700 w-8" />
            </button>
          </div>
        )}
      </Table.Cell>
    </Table.Row>
  );
};

export default ProductTableLine;
