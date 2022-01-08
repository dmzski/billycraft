import { TodoApi } from 'api/TodoApi'
import Loader from 'components/Loader'
import { useQuery } from 'react-query'
import TodoList from './List'

const TodoTab = (): JSX.Element => {
  const { data, isLoading } = useQuery('todos-done', TodoApi.findAllFinished)

  return (
    <>
      <h1 className="text-2xl mb-4">Historique des tâches</h1>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <TodoList data={data ?? []} />
      )}
    </>
  )
}

export default TodoTab
