import { TodoApi } from '@/api/TodoApi'
import Loader from '@/components/Loader'
import TodoList from './List'
import { useDataLoader } from '@scaleway/use-dataloader'

const TodoTab = () => {
  const { data, isLoading } = useDataLoader('todos-done', () => TodoApi.findAllFinished())

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
