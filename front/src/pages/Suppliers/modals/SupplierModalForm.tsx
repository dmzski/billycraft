import { Form } from "@/components/form/Form"
import { InputField } from "@/components/form/InputField"
import { Submit } from "@/components/form/Submit"
import { useI18n } from "@/i18n"
import {
	type SupplierRequest,
	type SupplierResponse,
	SuppliersService,
} from "@/sdk"
import { Button, Modal, useToast } from "@billycraft/ui"
import { TrashIcon } from "@heroicons/react/24/solid"
import { ComponentProps } from "react"
import { useController, useForm } from "react-hook-form"

type SupplierModalFormProps = {
	supplier?: SupplierResponse
	onSubmitSuccess?: () => void | Promise<void>
	disclosure: ComponentProps<typeof Modal>['disclosure']
}

const defaultSupplier = {
	name: "",
	color: "#000000",
	vat: 0,
} as SupplierRequest

type SupplierFormProps = Omit<SupplierModalFormProps, "disclosure">

const SupplierForm = ({ supplier, onSubmitSuccess }: SupplierFormProps) => {
	const { t } = useI18n()
	const toast = useToast()
	const methods = useForm<SupplierRequest>({
		mode: "onChange",
		defaultValues: supplier ?? defaultSupplier,
	})

	const onSubmit = async (values: SupplierRequest) => {
		const data = {
			...values,
			vat: Number(values.vat) || 0,
		}
		try {
			await (supplier?.id
				? SuppliersService.patchSuppliersById({
						path: { id: supplier.id },
						body: data,
					})
				: SuppliersService.postSuppliers({ body: data }))
			toast.show(t("suppliers.modals.form.submit.success"))
			await onSubmitSuccess?.()
		} catch {
			toast.destructive(t("genericFormError"))
		}
	}

	const handleDelete = async () => {
		if (supplier?.id) {
			try {
				await SuppliersService.deleteSuppliersById({
					path: { id: supplier.id },
				})
				toast.show(t("suppliers.modals.form.delete.success"))
				onSubmitSuccess?.()
			} catch {
				toast.destructive(t("genericFormError"))
			}
		}
	}

	const { field: colorField } = useController({
		control: methods.control,
		name: "color",
		rules: { required: true },
	})

	return (
		<div className="w-full pb-2 flex flex-col gap-4">
			<div className="flex items-center gap-4">
				<h3 className="text-xl font-semibold flex-grow">
					{supplier?.id
						? t("suppliers.modals.form.title.edit")
						: t("suppliers.modals.form.title.create")}
				</h3>
				{supplier?.id ? (
					<Button variant="destructive" onClick={handleDelete}>
						<TrashIcon />
						<span>{t("delete")}</span>
					</Button>
				) : null}
			</div>
			<Form methods={methods} onSubmit={onSubmit}>
				<div className="flex flex-col gap-4">
					<InputField
						required
						control={methods.control}
						name="name"
						label={t("suppliers.modals.form.field.name.label")}
						placeholder={t("suppliers.modals.form.field.name.label")}
						minLength={2}
					/>
					<InputField
						required
						asNumber
						control={methods.control}
						name="vat"
						label={t("suppliers.modals.form.field.vat.label")}
						type="number"
						min={0}
						max={100}
					/>
					<div className="flex items-end gap-2">
						<InputField
							prefix={
								<input
									className="size-10 rounded-l-md"
									type="color"
									value={colorField.value}
									onChange={colorField.onChange}
									onBlur={colorField.onBlur}
								/>
							}
							control={methods.control}
							name="color"
							required
							className="flex-grow"
							label={t("suppliers.modals.form.field.color.label")}
						/>
					</div>
					<Modal.Actions>
						<Submit type="submit">{t("save")}</Submit>
					</Modal.Actions>
				</div>
			</Form>
		</div>
	)
}
const SupplierModalForm = ({
	disclosure,
	supplier,
	onSubmitSuccess,
}: SupplierModalFormProps) => (
	<Modal hideOnClickOutside disclosure={disclosure}>
		{({ close }) => (
			<SupplierForm
				supplier={supplier}
				onSubmitSuccess={async () => {
					await onSubmitSuccess?.()
					close()
				}}
			/>
		)}
	</Modal>
)

export default SupplierModalForm
