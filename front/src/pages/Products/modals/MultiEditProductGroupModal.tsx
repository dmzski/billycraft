import { Form } from "@/components/form/Form";
import { useI18n } from "@/i18n";
import Product from "@/models/Product";
import { Button, Modal, useToast } from "@coco-ui/core";
import { ComponentProps, useMemo } from "react";
import { useForm } from "react-hook-form";
import { FormErrorAlert } from "@/components/FormErrorAlert";
import { Submit } from "@/components/form/Submit";
import { ProductApi } from "@/api/ProductApi";
import { sendErrorToSentry } from "@/utils/errors";
import { SelectField } from "@/components/form/SelectField";
import { useAllProductGroupsQuery } from "@/queries/useAllProductGroupsQuery";

type MultiEditProductGroupModalProps = {
	products: Product[];
	onSubmitSuccess: () => Promise<void>;
	disclosure: ComponentProps<typeof Modal>["disclosure"];
};

type MultiEditProductGroupFormProps = Omit<
	MultiEditProductGroupModalProps,
	"disclosure"
> & {
	close: () => void;
};

type MultiEditProductGroupFormValues = {
	groupId: string | null;
};

export const MultiEditProductGroupForm = ({
	products,
	close,
	onSubmitSuccess,
}: MultiEditProductGroupFormProps) => {
	const { data: groups } = useAllProductGroupsQuery();
	const { scopedT, t } = useI18n();
	const toast = useToast();
	const pageT = scopedT("products.modals.multiEditProductGroup");
	const methods = useForm<MultiEditProductGroupFormValues>({
		mode: "onChange",
		defaultValues: {
			groupId: null,
		},
	});

	const options = useMemo<ComponentProps<typeof SelectField>["options"]>(
		() =>
			groups?.map(({ id, name }) => ({
				value: id,
				label: name,
			})) ?? [],
		[groups],
	);

	const handleSubmit = async ({ groupId }: MultiEditProductGroupFormValues) => {
		let hasError = false;
		try {
			const finalPromise = products.reduce(
				(promise, product) =>
					promise
						.catch(() => {
							hasError = true;
						})
						.then(() => ProductApi.update({ ...product, groupId })),
				Promise.resolve(),
			);

			await finalPromise;

			if (hasError) {
				toast.destructive(pageT("submit.error"));
			} else {
				toast.show(pageT("submit.success"));
			}
			await onSubmitSuccess();
			close();
		} catch (error) {
			sendErrorToSentry(error);

			return t("genericFormError");
		}
	};

	return (
		<Form methods={methods} onSubmit={handleSubmit}>
			<div className="flex flex-col gap-8">
				<Modal.Title>{pageT("title")}</Modal.Title>
				<p>{pageT("description")}</p>
				<SelectField
					control={methods.control}
					name="groupId"
					options={options}
					isSearchable
					placeholder={pageT("fields.groupId.placeholder")}
					label={pageT("fields.groupId.label")}
				/>
				<FormErrorAlert />
				<Modal.Actions>
					<Button variant="outline" onClick={close}>
						{t("cancel")}
					</Button>
					<Submit>{pageT("submit")}</Submit>
				</Modal.Actions>
			</div>
		</Form>
	);
};
export const MultiEditProductGroupModal = ({
	disclosure,
	products,
	onSubmitSuccess,
}: MultiEditProductGroupModalProps) => (
	<Modal disclosure={disclosure} size="sm">
		{({ close }) => (
			<MultiEditProductGroupForm
				close={close}
				products={products}
				onSubmitSuccess={onSubmitSuccess}
			/>
		)}
	</Modal>
);
