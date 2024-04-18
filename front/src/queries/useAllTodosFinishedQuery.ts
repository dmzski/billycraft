import { TodoApi } from '@/api/TodoApi'
import { Todo } from '@/models/Todo'
import { UseDataLoaderConfig, useDataLoader } from '@scaleway/use-dataloader'

export const useAllTodosFinishedQuery = (config?: UseDataLoaderConfig<Todo[], Error>) => {
  const key = ['todos', 'all', 'finished']

  return useDataLoader(key, () => TodoApi.findAllFinished(), config)
}
