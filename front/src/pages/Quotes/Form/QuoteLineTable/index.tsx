import { Button, List, Select } from "@coco-ui/core";
import { ValueType } from "@coco-ui/core/dist/components/Select";
import { ProductApi } from "api/ProductApi";
import { LineTypeEnum } from "models/LineTypeEnum";
import { QuoteLine } from "models/Quote";
import React, { useCallback } from "react";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { Control, useFieldArray } from "react-hook-form";
import { useQuery } from "react-query";
import QuoteLineTableLine from "./Row";

const defaultLine = {
  description: "",
  name: "",
  price: 0,
  quantity: 0,
  type: LineTypeEnum.ARTICLE,
};

const QuoteLineTable = ({
  disabled,
  control,
}: {
  disabled?: boolean;
  control: Control;
}): JSX.Element => {
  const productsQuery = useQuery("products", ProductApi.findAll, {
    refetchOnWindowFocus: false,
  });
  const [productIdSelected, setProductIdSelected] = React.useState<number>();
  const onProductSelectedChange = React.useCallback((option: ValueType) => {
    setProductIdSelected(Number(option));
  }, []);

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "lines",
    keyName: "line",
  });

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }

      move(result.source.index, result.destination.index);
    },
    [move]
  );

  const addLine = React.useCallback(
    (newLine = defaultLine) => {
      append({ ...newLine, line: (fields || []).length + 1 });
    },
    [append, fields]
  );

  const productOptions = React.useMemo(() => {
    if (productsQuery.data) {
      return productsQuery.data.map((product) => ({
        value: product.id,
        label: product.name,
      }));
    }
    return [];
  }, [productsQuery.data]);

  const addExistingProductSelected = () => {
    if (productIdSelected && productsQuery.data) {
      addLine(
        productsQuery.data.find((product) => product.id === productIdSelected)
      );
      setProductIdSelected(undefined);
      window.scrollTo({
        behavior: "smooth",
        top: document.body.scrollHeight,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey && e.key === "Enter" && !disabled) {
      e.stopPropagation();
      addLine();
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      <List
        className="bg-white w-full"
        data={fields}
        columns={[
          {
            name: "Type",
            className: "pl-12 w-48",
          },
          {
            name: "Nom",
            className: "w-72 pl-6",
          },
          {
            name: "Description",
            className: "w-full pl-4",
          },
          {
            name: "Quantité",
            className: "w-36",
          },
          {
            name: "Prix HT",
            className: "w-48",
          },
          {
            name: "Prix TTC",
            className: "w-48",
          },
          {
            name: "Sous Total",
            className: "w-52",
          },
          {
            name: "",
            className: "w-24",
          },
        ]}
      >
        {({ data }) => (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lines">
              {(droppableProvided) => (
                <div
                  {...droppableProvided.droppableProps}
                  ref={droppableProvided.innerRef}
                >
                  {(data as QuoteLine[])?.map((line, index) => (
                    <Draggable
                      key={`draggable-${line.line}`}
                      draggableId={line.line.toString()}
                      index={index}
                      isDragDisabled={disabled}
                    >
                      {(provided) => (
                        <QuoteLineTableLine
                          provided={provided}
                          key={`${line.line}`}
                          disabled={disabled}
                          index={index}
                          control={control}
                          deleteLine={() => remove(index)}
                        />
                      )}
                    </Draggable>
                  ))}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </List>
      {!disabled ? (
        <>
          <Button
            type="button"
            variant="secondary"
            className="w-full mt-4"
            size="sm"
            onClick={addLine}
            disabled={disabled}
            icon="plus"
          >
            Ajouter une ligne
          </Button>
          <div className="my-4 flex items-end">
            <Select
              label="Ajouter un produit existant"
              tabIndex={0}
              containerClassName="flex-grow"
              name="existing-product"
              id="existing-product"
              inputProps={{
                autoComplete: "off",
              }}
              options={productOptions}
              isLoading={productsQuery.isLoading}
              isSearchable
              placeholder="Nom du produit"
              value={productIdSelected}
              onChange={onProductSelectedChange}
            />
            <Button
              onClick={addExistingProductSelected}
              type="button"
              className="py-2 ml-4 w-1/6"
              variant="secondary"
            >
              Ajouter
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default QuoteLineTable;
