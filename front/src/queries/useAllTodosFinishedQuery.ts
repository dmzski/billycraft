import { type TodoResponse, TodosService } from "@/sdk";
import { type UseDataLoaderConfig, useDataLoader } from "@scaleway/use-dataloader";

export const useAllTodosFinishedQuery = (
	config?: UseDataLoaderConfig<TodoResponse[], Error>,
) => {
	const key = ["todos", "all", "finished"];

	return useDataLoader(
		key,
		() =>
			TodosService.getTodos({ query: { status: "done" } }).then(
				({ data }) => data,
			),
		config,
	);
};
