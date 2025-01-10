import { Button, Loader } from "@billycraft/ui";
import { useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/routes";
import type { OutgoingResponse } from "@/sdk";
import OutgoingForm from "./Form";
import { useI18n } from "@/i18n";
import { useOutgoingByIdQuery } from "@/queries/useOutgoingByIdQuery";

const { routes } = ROUTES.ACCOUNTINGS.routes.OUTGOINGS;

const FormPage = () => {
	const { id } = useParams<{ id: string }>();
	const { t } = useI18n();
	const navigate = useNavigate();
	const { data, isLoading } = useOutgoingByIdQuery(id ?? '', {
		enabled: id !== "new",
	});

	const onSubmitSuccess = useCallback(
		(res: OutgoingResponse) => {
			navigate(routes.DETAILS.path({ id: res.id }));
		},
		[navigate],
	);

	return (
		<div>
			<Link to={routes.LIST.path()}>
				<Button type="button" variant="ghost">
					{t("accounting.outgoings.pages.form.goBack")}
				</Button>
			</Link>
			<div className="border-b py-2 my-4">
				<h1 className="text-2xl">
					{t(
						id !== "new"
							? "accounting.outgoings.pages.form.edit.title"
							: "accounting.outgoings.pages.form.create.title",
					)}
				</h1>
			</div>
			{isLoading ? (
				<div className="flex justify-center">
					<Loader />
				</div>
			) : (
				<OutgoingForm
					onSubmitSuccess={onSubmitSuccess}
					disabledFields={id !== "new" ? ["startDate"] : undefined}
					outgoing={data}
				/>
			)}
		</div>
	);
};

export default FormPage;
