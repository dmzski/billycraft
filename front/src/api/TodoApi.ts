import { formatRFC3339 } from "date-fns";
import { Todo, TodoRequest } from "models/Todo";
import { API_URL } from "../constants/global";
import { HttpClient } from "./HttpClient";

export const TODO_URL = API_URL + "/todos";

export const TodoApi = {
  delete: async (id: number): Promise<undefined> =>
    HttpClient.DELETE(`${TODO_URL}/${id}`, {}),
  findAll: (): Promise<Todo[]> => HttpClient.GET<Todo[]>(`${TODO_URL}`),
  findAllFinishedAfter: (date: Date): Promise<Todo[]> =>
    HttpClient.GET<Todo[]>(
      `${TODO_URL}?${new URLSearchParams({
        done_after: formatRFC3339(date),
      })}`
    ),
  create: (request: TodoRequest): Promise<Todo> =>
    HttpClient.POST(`${TODO_URL}`, request),
  update: (id: number, request: TodoRequest): Promise<Todo> =>
    HttpClient.PATCH(`${TODO_URL}/${id}`, request),
  done: (id: number): Promise<Todo> =>
    HttpClient.POST(`${TODO_URL}/${id}/done`, {}),
};
