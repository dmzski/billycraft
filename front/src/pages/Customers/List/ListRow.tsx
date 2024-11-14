import { CustomerLabel } from "@/components/labels/CustomerLabel";
import { useI18n } from "@/i18n";
import type { CustomerResponse } from "@/sdk";
import { ROUTES } from "@/routes";
import { Button, Collapsible } from "@billycraft/ui";
import {
	ChevronDownIcon,
	ChevronUpIcon,
	ClipboardIcon,
} from "@heroicons/react/24/solid";
import { useReducer } from "react";

type ListRowProps = {
	customer: CustomerResponse;
};

export const ListRow = ({ customer }: ListRowProps) => {
	const [open, toggleOpen] = useReducer((state) => !state, false);
	const { scopedT } = useI18n();
	const pageT = scopedT("customers.details");

	return (
		<div className="border rounded-md">
			<Collapsible
				open={open}
				key={customer.id}
				disclosure={
					<div className="grid md:grid-cols-12 p-2 gap-4 md:h-16 items-center">
						<div className="flex items-center md:col-span-6 gap-2 overflow-hidden text-ellipsis">
							<div>
								<Button onClick={toggleOpen} variant="ghost" size="icon">
									{open ? <ChevronUpIcon /> : <ChevronDownIcon />}
								</Button>
							</div>
							<CustomerLabel
								customer={customer}
								to={ROUTES.CUSTOMER_OVERVIEW.path({
									id: customer.id.toString(),
								})}
							/>
						</div>
						<div className="hidden md:flex items-center md:col-span-2">
							<span className="truncate">{customer.contact || "-"}</span>
						</div>
						<div className="hidden md:flex items-center md:col-span-2">
							{customer.phoneNumber || "-"}
						</div>
						<div className="hidden md:flex items-center gap-2 md:col-span-2">
							<span className="truncate">{customer.email || "-"}</span>
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
						</div>
					</div>
				}
			>
				<div className="border-t grid md:grid-cols-3 p-4 gap-4 [&_dt]:font-semibold">
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
							{customer.email}
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
						</dd>
					</dl>
					<dl className="md:col-span-3">
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
						<dd>{customer.phoneNumber}</dd>
					</dl>
				</div>
			</Collapsible>
		</div>
	);
};
