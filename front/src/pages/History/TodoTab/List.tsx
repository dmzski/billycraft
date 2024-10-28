import { formatISO9075 } from 'date-fns'
import { Todo } from '@/models/Todo'
import { useI18n } from '@/i18n'

type TodoListProps = {
  data: Todo[]
}

const List = ({ data }: TodoListProps) => {
  const { t } = useI18n()

  return (
    <div className="flex flex-col border rounded-t-lg">
      <div className="grid grid-cols-5 gap-2 bg-accent text-accent-foreground p-4 rounded-t-md">
        <div>{t('history.tabs.todo.list.headers.createdAt')}</div>
        <div>{t('history.tabs.todo.list.headers.createdBy')}</div>
        <div>{t('history.tabs.todo.list.headers.description')}</div>
        <div>{t('history.tabs.todo.list.headers.doneAt')}</div>
        <div>{t('history.tabs.todo.list.headers.doneBy')}</div>
      </div>
      <div className="flex flex-col gap-2">
        {data.map(todo => (
          <div className="grid grid-cols-5 gap-2 px-4 py-2 [&:not(first)]:border-t" key={todo.id}>
            <div>{formatISO9075(new Date(todo.createdAt))}</div>
            <div className="truncate">{todo.createdBy}</div>
            <div className="truncate">{todo.description}</div>
            <div>{todo.doneAt ? formatISO9075(new Date(todo.doneAt)) : ''}</div>
            <div className="truncate">{todo.doneBy}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default List
