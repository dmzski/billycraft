import { Table } from '@coco-ui/core'
import { formatISO9075 } from 'date-fns'
import { Todo } from '@/models/Todo'
import { useI18n } from '@/i18n'

type TodoListProps = {
  data: Todo[]
}

const List = ({ data }: TodoListProps) => {
  const { t } = useI18n()

  return (
    <Table className="w-full table-fixed">
      <Table.Head>
        <Table.Row>
          <Table.HeadCell className="w-48">{t('history.tabs.todo.list.headers.createdAt')}</Table.HeadCell>
          <Table.HeadCell className="w-56">{t('history.tabs.todo.list.headers.createdBy')}</Table.HeadCell>
          <Table.HeadCell className="w-full">{t('history.tabs.todo.list.headers.description')}</Table.HeadCell>
          <Table.HeadCell className="w-48">{t('history.tabs.todo.list.headers.doneAt')}</Table.HeadCell>
          <Table.HeadCell className="w-56">{t('history.tabs.todo.list.headers.doneBy')}</Table.HeadCell>
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
}

export default List
