import { Table } from "@coco-ui/core";
import { formatISO9075 } from "date-fns";
import { Todo } from "models/Todo";
import React from "react";

type TodoListProps = {
  data: Todo[];
};

const TodoList = ({ data }: TodoListProps): JSX.Element => (
  <Table>
    <Table.Head>
      <Table.Row>
        <Table.HeadCell className="w-48">Crée le</Table.HeadCell>
        <Table.HeadCell className="w-72">Crée par</Table.HeadCell>
        <Table.HeadCell>Description</Table.HeadCell>
        <Table.HeadCell className="w-48">Fait le</Table.HeadCell>
        <Table.HeadCell className="w-72">Fait par</Table.HeadCell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {data.map((todo) => (
        <Table.Row key={todo.id}>
          <Table.Cell>{formatISO9075(new Date(todo.createdAt))}</Table.Cell>
          <Table.Cell>{todo.createdBy}</Table.Cell>
          <Table.Cell className="truncate">{todo.description}</Table.Cell>
          <Table.Cell>
            {todo.doneAt ? formatISO9075(new Date(todo.doneAt)) : ""}
          </Table.Cell>
          <Table.Cell>{todo.doneBy}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

export default TodoList;
