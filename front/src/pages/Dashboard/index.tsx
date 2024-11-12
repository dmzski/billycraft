import { Badge } from "@billycraft/ui";
import TodoList from "./TodoList";
import { ListBulletIcon } from "@heroicons/react/24/solid";
import { useAllTodosFinishedAfter } from "@/queries/useAllTodosFinishedAfter";
import { useI18n } from "@/i18n";
import { BillsOverdueSection } from "./BillsOverdueSection";
import { useMemo } from "react";
import { StockStatusSection } from "./StockStatusSection";

const DATE_OFFSET_TODOS = 24 * 60 * 60 * 1000 * 1; // 1 days

const Dashboard = () => {
	const { t } = useI18n();
	const dateOffset = useMemo(
		() => new Date(Date.now() - DATE_OFFSET_TODOS),
		[],
	);
	const { data: todos, reload } = useAllTodosFinishedAfter(dateOffset);

	const todoCount = todos?.filter(({ doneAt }) => !doneAt).length ?? 0;

	return (
		<div className="flex flex-col gap-12">
			<div className="flex flex-col md:flex-row flex-wrap justify-between items-center">
				<h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
				<div className="grid md:grid-cols-2 gap-2 justify-center items-center"></div>
			</div>
			<div className="flex flex-col gap-12">
				<section className="flex flex-col gap-4 border rounded-md p-4">
					<div className="flex items-center gap-2">
						<h2 className="text-xl gap-2 flex items-center font-semibold flex-grow">
							<ListBulletIcon className="size-6" />
							{t("dashboard.todos.title")}
						</h2>
						<Badge variant={todoCount > 0 ? "default" : "outline"}>
							{todoCount} {t("dashboard.todosBadge")}
						</Badge>
					</div>
					<TodoList data={todos} onSubmitSuccess={reload} />
				</section>
				<div className="grid md:grid-cols-2 gap-4">
					<BillsOverdueSection />
					<StockStatusSection />
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
