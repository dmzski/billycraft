import { useI18n } from "@/i18n"
import { Alert, Button, Modal, useToast } from "@billycraft/ui"
import type { ComponentProps } from "react"
import { useForm } from "react-hook-form"
import { sendErrorToSentry } from "@/utils/errors"
import { Submit } from "@/components/form/Submit"
import { InputField } from "@/components/form/InputField"
import { Form } from "@/components/form/Form"
import { type ProductResponse, ProductsService } from "@/sdk"

type MultiDeleteProductModalProps = {
	onSubmitSuccess: () => Promise<void>
	disclosure: ComponentProps<typeof Modal>["disclosure"]
	productIds: ProductResponse["id"][]
}

type MultiDeleteProductFormProps = Omit<
	MultiDeleteProductModalProps,
	"disclosure"
> & {
	close: () => void
}

type ConfirmValues = {
	confirm: string
}

const MultiDeleteProductForm = ({
	productIds,
	onSubmitSuccess,
	close,
}: MultiDeleteProductFormProps) => {
	const { scopedT, t } = useI18n()
	const toast = useToast()
	const pageT = scopedT("products.modals.multiDelete")
	const confirmationString = t("forms.confirmation.delete.pattern")

	const methods = useForm<ConfirmValues>({
		mode: "onChange",
		defaultValues: {
			confirm: "",
		},
	})

	const onSubmit = async () => {
		try {
			await productIds.reduce(
				(promise, productId) =>
					promise.then(() =>
						ProductsService.deleteProductsById({ path: { id: productId } }),
					),
				Promise.resolve(),
			)
			toast.show(pageT("submit.success"))
			await onSubmitSuccess()
			close()
		} catch (err) {
			sendErrorToSentry(err)
			toast.destructive(t("genericFormError"))
		}
	}

	return (
		<Form methods={methods} onSubmit={onSubmit}>
			<div className="flex flex-col gap-8">
				<Modal.Title>{pageT("title")}</Modal.Title>
				<Alert variant="destructive">{pageT("description")}</Alert>
				<InputField
					control={methods.control}
					name="confirm"
					required
					label={t("forms.confirmation.delete.label")}
					autoComplete="off"
					rules={{
						required: true,
						pattern: new RegExp(confirmationString, "i"),
					}}
				/>
				<Modal.Actions>
					<Button variant="outline" onClick={close}>
						{t("cancel")}
					</Button>
					<Submit variant="destructive">{pageT("submit")}</Submit>
				</Modal.Actions>
			</div>
		</Form>
	)
}

export const MultiDeleteProductModal = ({
	productIds,
	onSubmitSuccess,
	disclosure,
}: MultiDeleteProductModalProps) => (
	<Modal disclosure={disclosure} size="sm">
		{({ close }) => (
			<MultiDeleteProductForm
				productIds={productIds}
				onSubmitSuccess={onSubmitSuccess}
				close={close}
			/>
		)}
	</Modal>
)
