import React from "react";
import { useMutation, useQueryCache } from "react-query";
import { ProductApi } from "../../api/ProductApi";
import { ProductGraphQL } from "../../graphql/ProductGraphQL";
import { Product } from "../../models/Product";
import { useToast } from "../../providers/ToastProvider";
import BaseInput from "../inputs/BaseInput";
import MultiLineInput from "../inputs/MultiLineInput";

type ProductTableLineProps = {
  product: Product;
};

const ProductTableLine: React.FC<ProductTableLineProps> = ({ product }) => {
  const [editMode, setEditMode] = React.useState(product.id ? false : true);
  const [newProduct, setNewProduct] = React.useState(product);
  const [deleteMode, setDeleteMode] = React.useState(false);
  const [saveProductMutation, saveProductMutationState] = useMutation(ProductGraphQL.saveProduct);
  const [deleteProductMutation, deleteProductMutationState] = useMutation(ProductApi.delete, {
    onSuccess: (data) => {
      toast.show({ message: "Article supprimé", variant: "success" });
      queryCache.invalidateQueries("products");
    },
    onError: (error) => {
      toast.show({ message: "Erreur lors de l'enregistrement", variant: "error" });
    },
  });
  const queryCache = useQueryCache();

  const toast = useToast();

  const toggleEditMode = (e: any) => {
    e.stopPropagation();
    setEditMode(!editMode);
  };

  const handleChange = (field: string) => (e: any) => {
    const tmp: any = { ...newProduct };
    tmp[field] = e.target.value;
    setNewProduct(tmp);
  };

  const onSubmit = async (e: any) => {
    e.stopPropagation();
    try {
      await saveProductMutation({ description: newProduct.description, price: parseFloat(newProduct.price + "") });
      toast.show({ message: product.id ? "Article modifié" : "Article ajouté", variant: "success" });
      queryCache.invalidateQueries("products");
      setEditMode(false);
    } catch (error) {
      toast.show({ message: "Erreur lors de l'enregistrement", variant: "error" });
    }
  };

  const toggleDeleteMode = (e: any) => {
    setDeleteMode(!deleteMode);
  };

  const onDelete = async (e: any) => {
    e.stopPropagation();
    try {
      const result = await deleteProductMutation(product.id!);
    } catch (error) {
      console.log("Error", error);
      toast.show({ message: "Erreur lors de la suppression", variant: "error" });
    }
  };

  React.useEffect(() => {
    setNewProduct(product || new Product());
  }, [editMode, product]);

  return (
    <tr className="hover-action">
      <td>
        <MultiLineInput
          className="flex multiline-input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={newProduct.description}
          disabled={!editMode}
          onChange={handleChange("description")}
        />
      </td>
      <td className="text-right">
        <div className="flex justify-center items-center">
          <BaseInput
            min={0}
            type="number"
            divClassName="flex w-full mr-1"
            step={0.1}
            className=" w-full text-right"
            value={newProduct.price}
            disabled={!editMode}
            onChange={handleChange("price")}
          />
          <span>€</span>
        </div>
        {deleteMode ? (
          <div className="actions">
            <span className="mr-2">Supprimer ? </span>
            <button
              type="button"
              disabled={deleteProductMutationState.isLoading}
              onClick={onDelete}
              className=" p-2 button success text-white rounded-full mr-2"
            >
              Oui
            </button>
            <button type="button" onClick={toggleDeleteMode} className=" p-2 button delete text-white rounded-full">
              Non
            </button>
          </div>
        ) : editMode ? (
          <div className="actions">
            <button
              type="button"
              disabled={saveProductMutationState.isLoading || !newProduct.price || !newProduct.description || newProduct.description.length < 3}
              onClick={onSubmit}
              className="material-icons p-2 button success text-white rounded-full mr-2"
            >
              check
            </button>
            {product.id && (
              <button type="button" onClick={toggleEditMode} className="material-icons p-2 button delete text-white rounded-full">
                clear
              </button>
            )}
          </div>
        ) : (
          <div className="actions">
            <button type="button" onClick={toggleEditMode} className="material-icons p-2 button info text-white rounded-full mr-2">
              edit
            </button>
            <button
              type="button"
              disabled={deleteProductMutationState.isLoading}
              onClick={toggleDeleteMode}
              className="material-icons p-2 button delete text-white rounded-full"
            >
              delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default ProductTableLine;
