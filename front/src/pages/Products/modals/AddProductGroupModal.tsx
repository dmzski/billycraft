import { InputField } from "@/components/form/InputField"
import { Submit } from "@/components/form/Submit"
import { useI18n } from "@/i18n"
import { ProductGroupsService } from "@/sdk"
import { sendErrorToSentry } from "@/utils/errors"
import { Button, Modal, useToast } from "@billycraft/ui"
import type { ComponentProps } from "react"
import { FormProvider, useForm } from "react-hook-form"

type AddProductGroupModalProps = {
	disclosure: ComponentProps<typeof Modal>["disclosure"]
	onSubmitSuccess: () => Promise<void>
}

type AddProductGroupFormProps = Omit<
	AddProductGroupModalProps,
	"disclosure"
> & {
	close: () => void
}

type AddProductGroupFormValues = {
	name: string
}

const AddProductGroupForm = ({
	close,
	onSubmitSuccess,
}: AddProductGroupFormProps) => {
	const { scopedT, t } = useI18n()
	const pageT = scopedT("products.modals.addGroup")
	const toast = useToast()
	const methods = useForm({
		mode: "onChange",
		defaultValues: {
			name: "",
		},
	})

	const handleSubmit = async ({ name }: AddProductGroupFormValues) => {
		try {
			await ProductGroupsService.postProductGroups({ body: { name } })
			toast.show(pageT("submit.success"))
			await onSubmitSuccess()
			close()
		} catch (error) {
			sendErrorToSentry(error)
			toast.destructive(t("genericFormError"))
		}
	}

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(handleSubmit)}
				className="flex flex-col gap-12"
			>
				<Modal.Title>{pageT("title")}</Modal.Title>
				<div>
					<InputField
						label={pageT("fields.name.label")}
						control={methods.control}
						name="name"
						required
					/>
				</div>
				<Modal.Actions>
					<Button variant="outline" onClick={close}>
						{t("cancel")}
					</Button>
					<Submit>{pageT("submit")}</Submit>
				</Modal.Actions>
			</form>
		</FormProvider>
	)
}

export const AddProductGroupModal = ({
	onSubmitSuccess,
	disclosure,
}: AddProductGroupModalProps) => (
	<Modal disclosure={disclosure}>
		{({ close }) => (
			<AddProductGroupForm close={close} onSubmitSuccess={onSubmitSuccess} />
		)}
	</Modal>
)
