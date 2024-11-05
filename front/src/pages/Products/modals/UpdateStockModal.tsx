import { useI18n } from "@/i18n";
import { Button, Input, Modal, Select, useToast } from "@coco-ui/core";
import {
	Controller,
	FormProvider,
	useFieldArray,
	useForm,
} from "react-hook-form";
import { useMemo, type ComponentProps } from "react";
import {
	ArrowDownOnSquareIcon,
	ArrowUpOnSquareIcon,
	QrCodeIcon,
	TrashIcon,
} from "@heroicons/react/24/solid";
import { useAllProductsQuery } from "@/queries/useAllProductsQuery";
import { type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { sendErrorToSentry } from "@/utils/errors";
import { ProductApi } from "@/api/ProductApi";
import { Submit } from "@/components/form/Submit";
import { SelectField } from "@/components/form/SelectField";
import { InputField } from "@/components/form/InputField";
import { ScanArticleCodeModal } from "@/modals/ScanArticleCodeModal";

type UpdateStockModalProps = {
	disclosure: ComponentProps<typeof Modal>["disclosure"];
	onSubmitSuccess: () => Promise<void>;
};

type UpdateStockFormProps = Omit<UpdateStockModalProps, "disclosure"> & {
	close: () => void;
};

type UpdateStockFormValues = {
	inMovements: {
		productId: string;
		quantity: number;
	}[];
	outMovements: {
		productId: string;
		quantity: number;
	}[];
};

const UpdateStockForm = ({ close, onSubmitSuccess }: UpdateStockFormProps) => {
	const toast = useToast();
	const { scopedT, t } = useI18n();

	const pageT = scopedT("products.modals.updateStocks");
	const { data: products } = useAllProductsQuery();

	const methods = useForm<UpdateStockFormValues>({
		mode: "onChange",
		defaultValues: {
			inMovements: [],
			outMovements: [],
		},
	});

	const inMovementsFieldArray = useFieldArray({
		control: methods.control,
		name: "inMovements",
		rules: {
			validate: (values, allValues) =>
				values.length !== 0 || allValues.outMovements.length !== 0
					? true
					: false,
		},
	});
	const outMovementsFieldArray = useFieldArray({
		control: methods.control,
		name: "outMovements",
		rules: {
			validate: (values, allValues) =>
				values.length !== 0 || allValues.inMovements.length !== 0
					? true
					: false,
		},
	});

	const onSubmit = async (values: UpdateStockFormValues) => {
		try {
			await ProductApi.updateStocks({
				in: values.inMovements,
				out: values.outMovements,
			});
			close();
			toast.show(pageT("submit.success"));
			onSubmitSuccess();
		} catch (error) {
			sendErrorToSentry(error);
			toast.destructive(t("genericFormError"));
		}
	};

	const productOptions = useMemo(
		(): ComponentProps<typeof Select>["options"] =>
			products
				?.filter(({ type }) => type === "ARTICLE")
				.map((product) => ({
					value: product.id,
					label: product.name,
					searchText: product.name,
				})) ?? [],
		[products],
	);

	const onScannedBarCode = (
		barcodes: IDetectedBarcode[],
		direction: "in" | "out",
	) => {
		if (products) {
			const codes = barcodes.map(({ rawValue }) => rawValue);
			const productFound = products
				.filter(({ code }) => !!code)
				.find(({ code }) => (code ? codes.includes(code) : false));
			if (productFound) {
				direction === "in"
					? inMovementsFieldArray.append(
							{
								productId: productFound.id,
								quantity: 1,
							},
							{ shouldFocus: false },
						)
					: outMovementsFieldArray.append(
							{
								productId: productFound.id,
								quantity: 1,
							},
							{ shouldFocus: false },
						);
			} else {
				toast.destructive(pageT("errors.noMatchingProduct"));
			}
		}
	};

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					methods.handleSubmit(onSubmit)(event);
				}}
				className="flex flex-col gap-12"
			>
				<Modal.Title>{pageT("title")}</Modal.Title>
				<div className="flex flex-col gap-4">
					<div className="shadow border rounded p-4 flex flex-col gap-8">
						<p className="font-bold">{pageT("fields.type.in.header")}</p>
						<div className="flex flex-col gap-4">
							{inMovementsFieldArray.fields.length > 0 ? (
								inMovementsFieldArray.fields.map((aMovement, index) => (
									<div
										key={aMovement.id}
										className="grid md:grid-cols-12 gap-2 border-b pb-2 md:border-b-0 md:pb-0"
									>
										<div className="md:col-span-7 flex gap-2 min-w-0">
											<SelectField
												control={methods.control}
												name={`inMovements.${index}.productId`}
												className="flex-grow min-w-0"
												options={productOptions}
												isSearchable
												required
												placeholder={pageT("fields.code.placeholder")}
												aria-label={pageT("fields.code.label")}
											/>
										</div>
										<InputField
											control={methods.control}
											min={1}
											required
											asNumber
											name={`inMovements.${index}.quantity`}
											className="md:col-span-3"
											type="number"
											step={0.01}
										/>
										<Button
											variant="destructive"
											className="md:grid-cols-2"
											size="icon"
											onClick={() => {
												inMovementsFieldArray.remove(index);
											}}
										>
											<TrashIcon />
										</Button>
									</div>
								))
							) : (
								<p>{pageT("empty.noIn")}</p>
							)}
						</div>
						<div className="grid md:grid-cols-2 gap-2">
							<ScanArticleCodeModal
								disclosure={
									<Button>
										<QrCodeIcon />
										{pageT("fields.inMovements.scan")}
									</Button>
								}
								onScan={(result) => {
									onScannedBarCode(result, "in");
								}}
							/>
							<Button
								onClick={() => {
									inMovementsFieldArray.append({
										productId: "",
										quantity: 1,
									});
								}}
								variant="ghost"
							>
								<ArrowDownOnSquareIcon />
								{pageT("addIn")}
							</Button>
						</div>
					</div>
					<div className="shadow p-4 border rounded flex flex-col gap-8">
						<p className="font-bold">{pageT("fields.type.out.header")}</p>
						<div className="flex flex-col gap-4">
							{outMovementsFieldArray.fields.length > 0 ? (
								outMovementsFieldArray.fields.map((aMovement, index) => (
									<div
										key={aMovement.id}
										className="grid md:grid-cols-12 gap-2"
									>
										<div className="flex md:col-span-7 gap-2 min-w-0">
											<SelectField
												className="flex-grow min-w-0"
												name={`outMovements.${index}.productId`}
												options={productOptions}
												isSearchable
												required
												placeholder={pageT("fields.code.placeholder")}
												aria-label={pageT("fields.code.label")}
											/>
										</div>
										<Controller
											control={methods.control}
											name={`outMovements.${index}.quantity`}
											rules={{
												required: true,
												min: 1,
											}}
											render={({ field, fieldState }) => (
												<Input
													type="number"
													className="md:col-span-3"
													step={0.01}
													name={field.name}
													error={fieldState.invalid}
													value={field.value}
													onChange={field.onChange}
													onBlur={(event) => {
														const newStock = Number(event.target.value) || 1;
														field.onChange(newStock);
													}}
													ref={field.ref}
												/>
											)}
										/>
										<Button
											variant="destructive"
											size="icon"
											className="md:col-span-2"
											onClick={() => {
												outMovementsFieldArray.remove(index);
											}}
										>
											<TrashIcon />
										</Button>
									</div>
								))
							) : (
								<p>{pageT("empty.noOut")}</p>
							)}
						</div>
						<div className="grid md:grid-cols-2 gap-2">
							<ScanArticleCodeModal
								disclosure={
									<Button>
										<QrCodeIcon />
										{pageT("fields.outMovements.scan")}
									</Button>
								}
								onScan={(result) => {
									onScannedBarCode(result, "out");
								}}
							/>
							<Button
								onClick={() => {
									outMovementsFieldArray.append(
										{
											productId: "",
											quantity: 1,
										},
										{ shouldFocus: false },
									);
								}}
								variant="ghost"
							>
								<ArrowUpOnSquareIcon />
								{pageT("addOut")}
							</Button>
						</div>
					</div>
				</div>
				<Modal.Actions>
					<Button variant="outline" onClick={close}>
						{t("cancel")}
					</Button>

					<Submit>{pageT("submit")}</Submit>
				</Modal.Actions>
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
