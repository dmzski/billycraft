import { List } from "@coco-ui/core";
import Quote, { QuoteLine } from "models/Quote";
import React from "react";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import QuoteLineTableLine from "./Row";

const reorderLines = (
  list: QuoteLine[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const QuoteLineTable = ({
  quote,
  setQuote,
  disabled,
}: {
  quote: Quote;
  setQuote: React.Dispatch<React.SetStateAction<Quote>>;
  disabled?: boolean;
}): JSX.Element => {
  function deleteLine(index: number) {
    return () => {
      const newLines = [...quote.lines];
      newLines.splice(index, 1);
      setQuote({ ...quote, lines: newLines });
    };
  }

  function setLine(index: number) {
    return (newLine: any) => {
      const newLines = [...quote.lines];
      newLines[index] = newLine;
      setQuote({ ...quote, lines: newLines });
    };
  }

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newLines = reorderLines(
      quote.lines,
      result.source.index,
      result.destination.index
    );

    setQuote({
      ...quote,
      lines: newLines,
    });
  };

  return (
    <List
      className="bg-white w-full"
      data={quote.lines}
      columns={[
        {
          name: "Type",
          className: "w-48 ml-4",
        },
        {
          name: "Nom",
          className: "w-72 pl-2",
        },
        {
          name: "Description",
          className: "w-full ml-2",
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
          className: "w-48",
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
                  >
                    {(provided) => (
                      <QuoteLineTableLine
                        provided={provided}
                        key={`line-${line.line}`}
                        disabled={disabled}
                        tva={quote.tva}
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

export default QuoteLineTable;
