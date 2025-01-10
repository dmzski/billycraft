import { Button, Loader } from "@billycraft/ui";
import { Link, Navigate, useParams } from "react-router-dom";
import { OUTGOING_ROUTES } from "../constants";
import OutgoingDetail from "./OutgoingDetail";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useOutgoingByIdQuery } from "@/queries/useOutgoingByIdQuery";
import { useI18n } from "@/i18n";
import { ROUTES } from "@/routes";
import { RRLink } from "@/components/RRLink";

const Details = () => {
	const { t } = useI18n();
	const { id } = useParams<{ id: string }>();
	const { data: outgoing, isLoading } = useOutgoingByIdQuery(id ?? '', {
		enabled: !!id,
	});

	if (!outgoing && !isLoading) {
		return (
			<Navigate to={ROUTES.ACCOUNTINGS.routes.OUTGOINGS.routes.LIST.path()} />
		);
	}

	return (
		<div className="flex flex-col gap-12">
			<div className="flex justify-between items-center gap-4">
				<div>
					<RRLink
						className="inline-flex gap-1 items-center"
						to={OUTGOING_ROUTES.routes.LIST.path()}
					>
						<ChevronLeftIcon className="size-5" />
						{t("accounting.outgoings.details.backTo")}
					</RRLink>
				</div>
				{outgoing ? (
					<div>
						<Button asChild>
							<Link to={OUTGOING_ROUTES.routes.FORM.path({ id: outgoing.id })}>
								{t("update")}
							</Link>
						</Button>
					</div>
				) : null}
			</div>
			{isLoading ? (
				<div className="grid items-center justify-center flex-grow">
					<Loader />
				</div>
			) : null}
			{outgoing ? (
				<div className="flex flex-col gap-4">
					<h1 className="border-b text-2xl text-semibold mb-4">
						{t("accounting.outgoings.details.title")}
					</h1>
					<OutgoingDetail outgoing={outgoing} />
				</div>
			) : null}
		</div>
	);
};

export default Details;
