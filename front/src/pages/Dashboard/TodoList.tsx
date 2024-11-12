import { Checkbox, useToast } from "@billycraft/ui";
import { TodoApi } from "@/api/TodoApi";
import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import { Todo } from "@/models/Todo";
import { useForm } from "react-hook-form";
import { useI18n } from "@/i18n";
import { Form } from "@/components/form/Form";
import { InputField } from "@/components/form/InputField";
import { Submit } from "@/components/form/Submit";

type TodoFormValues = { description: string };

type TodoListProps = {
	data?: Todo[];
	onSubmitSuccess?: () => Promise<void>;
};
const TodoList = ({ data, onSubmitSuccess }: TodoListProps) => {
	const { t } = useI18n();
	const toast = useToast();

	const methods = useForm<TodoFormValues>({
		mode: "onChange",
		values: {
			description: "",
		},
	});

	const handleDoneUndo = async (id: string, newState: boolean) => {
		try {
			if (newState) {
				await TodoApi.done(id);
			} else {
				await TodoApi.undo(id);
			}
			await onSubmitSuccess?.();
			toast.show(t("dashboard.todos.form.submit.edit.success"));
		} catch {
			toast.destructive(t("genericFormError"));
		}
	};

	const onSubmit = async (values: TodoFormValues) => {
		try {
			await TodoApi.create(values);
			await onSubmitSuccess?.();
			methods.reset({ description: "" });
			toast.show(t("dashboard.todos.form.submit.success"));
		} catch {
			toast.destructive(t("genericFormError"));
		}
	};

	return (
		<div className="flex flex-col">
			<Form methods={methods} onSubmit={onSubmit}>
				<div
					className="p-2 flex justify-between gap-4"
					onSubmit={methods.handleSubmit(onSubmit)}
				>
					<InputField
						control={methods.control}
						name="description"
						type="text"
						className="flex-grow"
						placeholder={t(
							"dashboard.todos.form.fields.description.placeholder",
						)}
						required
						minLength={3}
					/>
					<Submit>{t("add")}</Submit>
				</div>
			</Form>
			{data && data.length === 0 ? (
				<div className="p-4">{t("dashboard.todos.empty")}</div>
			) : null}
			{data && data.length > 0 ? (
				<div className="flex flex-col">
					{data?.map((todo) => (
						<div
							key={todo.id}
							data-done={!!todo.doneAt}
							className="flex gap-4 p-4 items-center data-[done=true]:line-through"
						>
							<Checkbox
								onCheckedChange={(newState) =>
									handleDoneUndo(todo.id, newState)
								}
								checked={!!todo.doneAt}
							/>
							<div className="flex flex-col">
								<div className="break-all">{todo.description}</div>
								<div className="min-w-fit text-xs text-muted-foreground">
									{formatRelative(new Date(todo.createdAt), Date.now(), {
										locale: fr,
									})}
								</div>
							</div>
						</div>
					))}
				</div>
			) : null}
		</div>
	);
};

export default TodoList;
