import { TodoApi } from 'api/TodoApi';
import Loader from 'components/Loader';
import { useQuery } from 'react-query';
import TodoList from './List';

const TodoTab = (): JSX.Element => {
  const { data, isLoading } = useQuery('todos-done', TodoApi.findAllFinished);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader />
      </div>
    );
  }

  return <TodoList data={data ?? []} />;
}

export default TodoTab;
