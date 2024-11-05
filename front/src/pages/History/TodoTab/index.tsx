import Loader from "@/components/Loader";
import TodoList from "./List";
import { useAllTodosFinishedQuery } from "@/queries/useAllTodosFinishedQuery";
import { useI18n } from "@/i18n";

const TodoTab = () => {
	const { t } = useI18n();
	const { data, isLoading } = useAllTodosFinishedQuery();

	return (
		<>
			<h1 className="text-2xl mb-4">{t("history.tabs.todo.list.title")}</h1>
			<TodoList data={data ?? []} />
			{isLoading && !data ? (
				<div className="flex justify-center">
					<Loader />
				</div>
			) : null}
		</>
	);
};

export default TodoTab;
