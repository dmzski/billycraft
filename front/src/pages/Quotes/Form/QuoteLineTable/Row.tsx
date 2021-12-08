import { Icon, List, Select, Input, TextArea } from "@coco-ui/core";
import { LineTypeEnum } from "models/LineTypeEnum";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import { Control, Controller, useWatch } from "react-hook-form";
import { LINE_TYPE } from "../../../../constants/line";
import { calculatePriceTTC } from "../../../../utils/quote";
import React from "react";
import { ChangeEvent } from "react-router/node_modules/@types/react";

type QuoteLineTableLineProps = {
  deleteLine: () => void;
  disabled?: boolean;
  provided?: DraggableProvided;
  snapshot?: DraggableStateSnapshot;
  index: number;
  control: Control;
};
const QuoteLineTableLine = ({
  deleteLine,
  disabled,
  provided,
  index,
  control,
}: QuoteLineTableLineProps): JSX.Element => {
  const tva = useWatch({ control: control, name: "tva" });

  const price = useWatch({
    control,
    name: `lines.${index}.price`,
    defaultValue: 0,
  });
  const quantity = useWatch({
    control,
    name: `lines.${index}.quantity`,
    defaultValue: 0,
  });

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
          <Controller
            name={`lines.${index}.type`}
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { invalid } }) => (
              <Select
                disabled={disabled}
                tabIndex={0}
                error={invalid}
                value={field.value}
                onChange={(type) => field.onChange(type as LineTypeEnum)}
                ref={field.ref}
                options={Object.values(LINE_TYPE).map((type) => ({
                  value: type.enum,
                  label: type.name,
                }))}
                name={field.name}
                id={field.name + "-select"}
              />
            )}
          />
        </List.Cell>
        <List.Cell className="w-72">
          <Controller
            name={`lines.${index}.name`}
            rules={{ required: true }}
            control={control}
            render={({ field, fieldState: { invalid } }) => (
              <Input
                required
                placeholder="Nom"
                className="w-full"
                disabled={disabled}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={invalid}
              />
            )}
          />
        </List.Cell>
        <List.Cell className="w-full">
          <Controller
            name={`lines.${index}.description`}
            control={control}
            render={({ field }) => (
              <TextArea
                placeholder="Description"
                rows={3}
                className="w-full"
                disabled={disabled}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />
        </List.Cell>
        <List.Cell className="w-36">
          <Controller
            name={`lines.${index}.quantity`}
            control={control}
            render={({ field }) => (
              <Input
                disabled={disabled}
                className="text-right w-full"
                placeholder="Quantité"
                type="number"
                step="0.01"
                name={field.name}
                value={field.value}
                onChange={(event: ChangeEvent) =>
                  field.onChange(
                    Number((event.target as HTMLInputElement).value) || 0
                  )
                }
                onBlur={field.onBlur}
              />
            )}
          />
        </List.Cell>
        <List.Cell className="w-48">
          <Controller
            name={`lines.${index}.price`}
            control={control}
            render={({ field }) => (
              <Input
                disabled={disabled}
                className="text-right w-full"
                placeholder="Prix"
                type="number"
                step="0.01"
                value={field.value}
                onChange={(event: ChangeEvent) =>
                  field.onChange(
                    Number((event.target as HTMLInputElement).value) || 0
                  )
                }
                onBlur={field.onBlur}
              />
            )}
          />
        </List.Cell>
        <List.Cell className="w-48 py-2">
          {Math.round(calculatePriceTTC(price, tva) * 100) / 100 || 0}&nbsp;€
        </List.Cell>
        <List.Cell className="w-52 py-2">
          {Math.round(calculatePriceTTC(price, tva) * quantity * 100) / 100 ||
            0}
          &nbsp;€
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

export default QuoteLineTableLine;
