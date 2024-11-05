import { TodoApi } from "@/api/TodoApi";
import { useDataLoader } from "@scaleway/use-dataloader";

export const useAllTodosFinishedAfter = (
	params: Parameters<(typeof TodoApi)["findAllFinishedAfter"]>[0],
) => {
	const key = ["todos", "findAllFinishedAfter", Object.values(params)].flat();

	return useDataLoader(key, () => TodoApi.findAllFinishedAfter(params));
};
