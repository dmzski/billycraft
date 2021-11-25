import { List } from "@coco-ui/core";
import Bill, { BillLine } from "models/Bill";
import React from "react";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import Row from "./Row";

const reorderLines = (
  list: BillLine[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const BillLineTable = ({
  bill,
  setBill,
  disabled,
}: {
  bill: Bill;
  setBill: React.Dispatch<React.SetStateAction<Bill>>;
  disabled?: boolean;
}): JSX.Element => {
  function deleteLine(index: number) {
    return () => {
      const newLines = [...bill.lines];
      newLines.splice(index, 1);
      setBill({ ...bill, lines: newLines });
    };
  }

  function setLine(index: number) {
    return (newLine: any) => {
      const newLines = [...bill.lines];
      newLines[index] = newLine;
      setBill({ ...bill, lines: newLines });
    };
  }

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newLines = reorderLines(
      bill.lines,
      result.source.index,
      result.destination.index
    );

    setBill({
      ...bill,
      lines: newLines,
    });
  };

  return (
    <List
      className="bg-white w-full"
      data={bill.lines}
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
                {(data as BillLine[])?.map((line, index) => (
                  <Draggable
                    isDragDisabled={disabled}
                    key={`draggable-${line.line}`}
                    draggableId={line.line.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <Row
                        provided={provided}
                        key={`line-${line.line}`}
                        disabled={disabled}
                        tva={bill.tva}
                        line={line}
                        deleteLine={deleteLine(index)}
                        setLine={setLine(index)}
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
  );
};

export default BillLineTable;
