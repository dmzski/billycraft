import { Table } from '@coco-ui/core'
import { formatISO9075 } from 'date-fns'
import { Todo } from '@/models/Todo'

type TodoListProps = {
  data: Todo[]
}

const TodoList = ({ data }: TodoListProps) => (
  <Table className="w-full table-fixed">
    <Table.Head>
      <Table.Row>
        <Table.HeadCell className="w-48">Crée le</Table.HeadCell>
        <Table.HeadCell className="w-56">Crée par</Table.HeadCell>
        <Table.HeadCell className="w-full">Description</Table.HeadCell>
        <Table.HeadCell className="w-48">Fait le</Table.HeadCell>
        <Table.HeadCell className="w-56">Fait par</Table.HeadCell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {data.map(todo => (
        <Table.Row key={todo.id}>
          <Table.Cell>{formatISO9075(new Date(todo.createdAt))}</Table.Cell>
          <Table.Cell className="truncate">{todo.createdBy}</Table.Cell>
          <Table.Cell className="truncate">{todo.description}</Table.Cell>
          <Table.Cell>{todo.doneAt ? formatISO9075(new Date(todo.doneAt)) : ''}</Table.Cell>
          <Table.Cell className="truncate">{todo.doneBy}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
)

export default TodoList
