import { Loader, useToast } from "@billycraft/ui";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/routes";
import { BillFormContent } from "@/pages/Bills/components/BillFormContent";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useI18n } from "@/i18n";
import { useBillByIdQuery } from "@/queries/useBillByIdQuery";
import type { BillFormValues } from "../components/BillFormContent";
import { useForm } from "react-hook-form";
import { calculatePriceTTC } from "@/utils/price";
import { useMemo } from "react";
import { RRLink } from "@/components/RRLink";
import { BillLabel } from "@/components/labels/BillLabel";
import { Form } from "@/components/form/Form";
import { Submit } from "@/components/form/Submit";
import { FormErrorAlert } from "@/components/FormErrorAlert";
import { type BillRequest, BillsService } from "@/sdk";

const defaultBill = {
	lines: [],
	tva: 0,
	title: "",
	customerId: "",
} as BillFormValues;

export const Edit = () => {
	const { t } = useI18n();
	const toast = useToast();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { data: bill, isLoading } = useBillByIdQuery(id ?? '', {
		enabled: !!id,
	});

	const onSubmit = async (data: BillFormValues) => {
		const tmp: BillRequest = {
			...data,
			lines: data.lines.map((line, index: number) => ({
				type: line.type,
				description: line.description ?? undefined,
				name: line.name,
				productId: line.productId ?? undefined,
				line: index + 1,
				price: line.price ? Number(`${line.price}`) : undefined,
				quantity: line.quantity ? Number(`${line.quantity}`) : undefined,
			})),
		};
		try {
			if (bill?.id) {
				await BillsService.patchBillsById({ path: { id: id ?? '' }, body: tmp });
				toast.show(t("bills.form.submit.success"));
				navigate(ROUTES.BILLS.routes.OVERVIEW.path({ id: bill.id }));
			}
		} catch {
			toast.destructive(t("genericFormError"));
		}
	};

	const initialValues = useMemo<BillFormValues>(
		() =>
			bill
				? {
						...bill,
						tva: bill.tva ?? 0,
						lines: bill.lines.map(({ price, ...rest }) => ({
							...rest,
							price,
							itPrice: calculatePriceTTC(price, bill.tva),
						})),
					}
				: defaultBill,
		[bill],
	);

	const methods = useForm<BillFormValues>({
		mode: "onChange",
		values: initialValues,
	});

	if (!bill && isLoading) {
		return <Loader />;
	}

	if (!bill) {
		return t("genericDataLoadError");
	}

	if (bill.status !== "DRAFT") {
		return <Navigate to={ROUTES.BILLS.routes.OVERVIEW.path({ id: bill.id })} />;
	}

	return (
		<div className="flex flex-col gap-12">
			<RRLink
				className="gap-2 flex items-center"
				to={ROUTES.BILLS.routes.OVERVIEW.path({ id: bill.id })}
			>
				<ChevronLeftIcon className="size-5" /> {t("bills.form.edit.backTo")}
			</RRLink>
			<div>
				<BillLabel bill={bill} size="lg" />
			</div>
			<Form methods={methods} onSubmit={onSubmit}>
				<div className="flex flex-col gap-12">
					<BillFormContent bill={bill} />
					<FormErrorAlert />
					<div className="flex justify-end">
						<Submit>{t("bills.form.submit")}</Submit>
					</div>
				</div>
			</Form>
		</div>
	);
};
