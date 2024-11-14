import { useI18n } from "@/i18n";
import { useCustomerQuery } from "@/queries/useCustomerQuery";
import { type CustomerRouteProps, ROUTES } from "@/routes";
import { Alert, Button, Loader } from "@billycraft/ui";
import {
	ChevronLeftIcon,
	ClipboardIcon,
	PencilIcon,
} from "@heroicons/react/24/solid";
import { Link, useHistory, useParams } from "react-router-dom";
import { DeleteCustomerModal } from "../modals/DeleteCustomerModal";
import { RRLink } from "@/components/RRLink";
import { CustomerLabel } from "@/components/labels/CustomerLabel";

export const Overview = () => {
	const { scopedT, t } = useI18n();
	const { id } = useParams<CustomerRouteProps>();
	const { data: customer, isLoading } = useCustomerQuery(id, {
		enabled: !!id,
	});
	const { push } = useHistory();

	const pageT = scopedT("customers.details");

	const onSubmitSuccess = async () => {
		push(ROUTES.CUSTOMERS.path());
	};

	if (isLoading && !customer) {
		return (
			<div className="flex items-center justify-center">
				<Loader />
			</div>
		);
	}

	if (!customer) {
		return <Alert variant="destructive">{t("genericDataLoadError")}</Alert>;
	}

	return (
		<div className="flex flex-col gap-12">
			<div>
				<RRLink
					className="inline-flex gap-2 items-center"
					to={ROUTES.CUSTOMERS.path()}
				>
					<ChevronLeftIcon className="size-4" />
					{pageT("goBack")}
				</RRLink>
			</div>
			<div className="flex flex-col md:flex-row md:justify-between gap-4">
				<div className="flex flex-wrap truncate">
					<CustomerLabel size="lg" customer={customer} />
				</div>
				<Button asChild>
					<Link to={ROUTES.CUSTOMER_EDIT.path({ id: customer.id.toString() })}>
						<PencilIcon />
						<span>{t("edit")}</span>
					</Link>
				</Button>
			</div>
			<section>
				<h2 className="font-semibold text-lg">
					{pageT("sections.informations.title")}
				</h2>
				<div className="border rounded-md grid md:grid-cols-3 p-4 gap-4 [&_dt]:font-semibold">
					<dl>
						<dt>{pageT("sections.informations.name")}</dt>
						<dd>{customer.name}</dd>
					</dl>
					<dl>
						<dt>{pageT("sections.informations.contact")}</dt>
						<dd>{customer.contact || "-"}</dd>
					</dl>
					<dl>
						<dt>{pageT("sections.informations.email")}</dt>
						<dd className="flex gap-2 items-baseline">
							{customer.email || "-"}
							{customer.email?.length > 0 ? (
								<Button
									onClick={() => {
										navigator.clipboard
											.writeText(customer.email)
											.catch(() => null);
									}}
									title="Copy"
									variant="ghost"
									size="icon"
								>
									<ClipboardIcon />
								</Button>
							) : null}
						</dd>
					</dl>
					<dl className="md:col-span-4">
						<dt>{pageT("sections.informations.address")}</dt>
						<dd>{customer.address}</dd>
					</dl>
					<dl>
						<dt>{pageT("sections.informations.city")}</dt>
						<dd>{customer.city}</dd>
					</dl>
					<dl>
						<dt>{pageT("sections.informations.postalCode")}</dt>
						<dd>{customer.postalCode}</dd>
					</dl>
					<dl>
						<dt>{pageT("sections.informations.phoneNumber")}</dt>
						<dd>{customer.phoneNumber || "-"}</dd>
					</dl>
				</div>
			</section>
			{!customer.deleted ? (
				<section>
					<h2 className="text-xl font-semibold">
						{pageT("sections.delete.title")}
					</h2>
					<Alert variant="destructive">
						<div className="grid md:grid-cols-12 gap-4">
							<p className="md:col-span-10">
								{pageT("sections.delete.description")}
							</p>
							<div className="md:col-span-2 flex justify-end">
								<DeleteCustomerModal
									disclosure={
										<Button variant="destructive">{t("delete")}</Button>
									}
									customer={customer}
									onSubmitSuccess={onSubmitSuccess}
								/>
							</div>
						</div>
					</Alert>
				</section>
			) : null}
		</div>
	);
};
