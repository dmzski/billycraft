import { FormErrorAlert } from "@/components/FormErrorAlert"
import { RRLink } from "@/components/RRLink"
import { Form } from "@/components/form/Form"
import { Submit } from "@/components/form/Submit"
import { useI18n } from "@/i18n"
import {
	BillFormContent,
	type BillFormValues,
} from "@/pages/Bills/components/BillFormContent"
import { useOrganization } from "@/providers/OrganizationProvider"
import { ROUTES } from "@/routes"
import { type BillRequest, BillsService } from "@/sdk"
import { useToast } from "@billycraft/ui"
import { ChevronLeftIcon } from "@heroicons/react/24/solid"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

const defaultBill = {
	lines: [],
	tva: 0,
	title: "",
	customerId: "",
} as BillFormValues

export const Create = () => {
	const { t } = useI18n()
	const toast = useToast()
	const navigate = useNavigate()
	const { organization } = useOrganization()

	const initialValues = useMemo<BillFormValues>(
		() => ({
			...defaultBill,
			tva: organization?.vatPercent ?? 0,
		}),
		[organization?.vatPercent],
	)

	const methods = useForm<BillFormValues>({
		mode: "onChange",
		values: initialValues,
	})

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
		}
		try {
			const newBill = await BillsService.postBills({ body: tmp }).then(
				({ data }) => data,
			)
			toast.show(t("bills.form.submit.success"))
			navigate(
				newBill?.id
					? ROUTES.BILLS.routes.OVERVIEW.path({ id: newBill.id })
					: ROUTES.BILLS.routes.INDEX.path(),
			)
		} catch {
			toast.destructive(t("genericFormError"))
		}
	}

	return (
		<div className="w-full px-4 flex flex-col gap-12">
			<RRLink
				className="gap-2 flex items-center"
				to={ROUTES.BILLS.routes.INDEX.path()}
			>
				<ChevronLeftIcon className="size-5" />
				<span>{t("bills.form.backTo")}</span>
			</RRLink>
			<h1 className="text-3xl font-semibold">{t("bills.form.title.new")}</h1>
			<Form methods={methods} onSubmit={onSubmit}>
				<div className="flex flex-col gap-12">
					<BillFormContent />
					<FormErrorAlert />
					<div className="flex justify-end">
						<Submit>{t("bills.form.submit")}</Submit>
					</div>
				</div>
			</Form>
		</div>
	)
}
