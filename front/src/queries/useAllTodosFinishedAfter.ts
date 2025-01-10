import { type GetTodosData, TodosService } from "@/sdk"
import { useDataLoader } from "@scaleway/use-dataloader"

export const useAllTodosFinishedAfter = (
	params: NonNullable<GetTodosData["query"]>["done_after"],
) => {
	const key = ["todos", "findAllFinishedAfter", params].flat()

	return useDataLoader(key, () =>
		TodosService.getTodos({ query: { done_after: params } }).then(
			({ data }) => data,
		),
	)
}
