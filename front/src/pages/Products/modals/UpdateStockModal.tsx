import { useI18n } from "@/i18n";
import { Button, Input, Modal, Select } from "@coco-ui/core";
import {
	Controller,
	FormProvider,
	useFieldArray,
	useForm,
} from "react-hook-form";
import { useMemo, type ComponentProps } from "react";
import { QrCodeIcon, TrashIcon } from "@heroicons/react/24/solid";

type UpdateStockModalProps = {
	disclosure: ComponentProps<typeof Modal>["disclosure"];
	onSubmitSuccess: () => Promise<void>;
};

type UpdateStockFormProps = Omit<UpdateStockModalProps, "disclosure"> & {
	close: () => void;
};

type UpdateStockFormValues = {
	movements: {
		type: "in" | "out";
		code: string;
	}[];
};

const UpdateStockForm = ({ close, onSubmitSuccess }: UpdateStockFormProps) => {
	const { scopedT, t } = useI18n();

	const pageT = scopedT("products.modals.updateStocks");

	const methods = useForm<UpdateStockFormValues>({
		mode: "onChange",
		defaultValues: {
			movements: [{ type: "in", code: "" }],
		},
	});

	const movementsFieldArray = useFieldArray({
		control: methods.control,
		name: "movements",
	});

	const onSubmit = async (values: UpdateStockFormValues) => {
		console.log(values);
		close();
		onSubmitSuccess();
	};

	const movementTypeOptions = useMemo(
		(): ComponentProps<typeof Select>["options"] => [
			{ value: "in", label: pageT("fields.type.in") },
			{ value: "out", label: pageT("fields.type.out") },
		],
		[pageT],
	);

	const { formState } = methods;

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					methods.handleSubmit(onSubmit)(event);
				}}
				className="flex flex-col gap-10"
			>
				<h2 className="text-2xl">{pageT("title")}</h2>
				<div className="flex flex-col gap-4">
					<p>{pageT("description")}</p>
					<p className="text-lg">{pageT("fields.mouvements")}</p>
					{movementsFieldArray.fields.map((_, index) => (
						<div className="grid md:grid-cols-12 gap-2">
							<Controller
								control={methods.control}
								name={`movements.${index}.type`}
								rules={{
									required: true,
								}}
								render={({ field, fieldState }) => (
									<Select
										className="md:col-span-3"
										options={movementTypeOptions}
										value={field.value}
										onChange={field.onChange}
										variant="default"
										name={`movements.${index}.type`}
										required
										error={fieldState.invalid}
									/>
								)}
							/>
							<div className="flex md:col-span-9 gap-2">
								<Controller
									control={methods.control}
									name={`movements.${index}.code`}
									rules={{
										required: true,
										minLength: 3,
									}}
									render={({ field, fieldState }) => (
										<Input
											className="flex-grow"
											name={`movements.${index}.code`}
											onChange={field.onChange}
											onBlur={field.onBlur}
											error={fieldState.invalid}
											value={field.value}
											placeholder={pageT("fields.code.placeholder")}
											aria-label={pageT("fields.code.label")}
										/>
									)}
								/>
								<Button variant="primary" square disabled>
									<QrCodeIcon className="w-5" />
								</Button>
								{index !== 0 ? (
									<Button
										variant="error"
										outline
										square
										onClick={() => {
											movementsFieldArray.remove(index);
										}}
									>
										<TrashIcon className="w-5" />
									</Button>
								) : <div />}
							</div>
						</div>
					))}
					<Button
						type="button"
						onClick={() => {
							movementsFieldArray.append({ type: "in", code: "" });
						}}
					>
						{pageT("add")}
					</Button>
				</div>
				<div className="grid grid-cols-2 gap-2">
					<Button type="button" variant="default" outline onClick={close}>
						{t("cancel")}
					</Button>

					<Button
						type="submit"
						disabled={!formState.isValid || formState.isSubmitting}
						variant="primary"
					>
						{pageT("submit")}
					</Button>
				</div>
			</form>
		</FormProvider>
	);
};

export const UpdateStockModal = ({
	onSubmitSuccess,
	disclosure,
}: UpdateStockModalProps) => (
	<Modal disclosure={disclosure}>
		{({ close }) => (
			<UpdateStockForm onSubmitSuccess={onSubmitSuccess} close={close} />
		)}
	</Modal>
);
