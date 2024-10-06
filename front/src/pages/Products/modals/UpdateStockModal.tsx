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
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { sendErrorToSentry } from "@/utils/errors";
import { SCANNER_COMPONENTS, SCANNER_FORMATS } from "../constants";
import { ProductApi } from "@/api/ProductApi";

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
		console.log(values);
    try {

      await ProductApi.updateStocks({
        in: values.inMovements,
        out: values.outMovements
      })
      close();
      toast.success(pageT("submit.success"));
      onSubmitSuccess();
    } catch (error) {
      sendErrorToSentry(error)
      toast.error(t('genericFormError'))
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
					? inMovementsFieldArray.append({
							productId: productFound.id,
							quantity: 1,
						})
					: outMovementsFieldArray.append({
							productId: productFound.id,
							quantity: 1,
						});
			} else {
				toast.error(pageT("errors.noMatchingProduct"));
			}
		}
	};

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
					<div className="shadow border rounded p-4 flex flex-col gap-8">
						<p className="text-xl">{pageT("fields.type.in.header")}</p>
						<div className="flex flex-col gap-4">
							{inMovementsFieldArray.fields.length > 0 ? (
								inMovementsFieldArray.fields.map((aMovement, index) => (
									<div
										key={aMovement.id}
										className="grid md:grid-cols-12 gap-2 border-b pb-2 md:border-b-0 md:pb-0"
									>
										<div className="md:col-span-7 flex gap-2 min-w-0">
											<Controller
												control={methods.control}
												name={`inMovements.${index}.productId`}
												rules={{
													required: true,
													minLength: 3,
												}}
												render={({ field, fieldState }) => (
													<Select
														name={`inMovements.${index}.code`}
														className="flex-grow min-w-0"
														onChange={field.onChange}
														options={productOptions}
														isSearchable
														error={fieldState.invalid}
														value={field.value}
														placeholder={pageT("fields.code.placeholder")}
														aria-label={pageT("fields.code.label")}
														ref={field.ref}
													/>
												)}
											/>
										</div>
										<Controller
											control={methods.control}
											name={`inMovements.${index}.quantity`}
											rules={{
												required: true,
												min: 1,
											}}
											render={({ field, fieldState }) => (
												<Input
													className="md:col-span-3"
													type="number"
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
											variant="error"
											className="md:grid-cols-2"
											outline
											square
											onClick={() => {
												inMovementsFieldArray.remove(index);
											}}
										>
											<TrashIcon className="w-5" />
										</Button>
									</div>
								))
							) : (
								<p>{pageT("empty.noIn")}</p>
							)}
						</div>
						<div className="grid md:grid-cols-2 gap-2">
							<Modal
								disclosure={
									<Button
										type="button"
										variant="primary"
										outline
										className="gap-2"
									>
										<QrCodeIcon className="w-5" />
										{pageT("fields.inMovements.scan")}
									</Button>
								}
								hideOnClickOutside
							>
								{({ close }) => (
									<div className="pt-6">
										<Scanner
											onScan={(result) => {
												onScannedBarCode(result, "in");
												close();
											}}
											classNames={{
												container: "scanner",
											}}
											formats={SCANNER_FORMATS}
											components={SCANNER_COMPONENTS}
											scanDelay={500}
											allowMultiple
											onError={(err) => {
												sendErrorToSentry(err);
											}}
										/>
									</div>
								)}
							</Modal>
							<Button
								onClick={() => {
									inMovementsFieldArray.append({
										productId: "",
										quantity: 1,
									});
								}}
								className="gap-2"
								variant="ghost"
							>
								<ArrowDownOnSquareIcon className="w-5" />
								{pageT("addIn")}
							</Button>
						</div>
					</div>
					<div className="shadow p-4 border rounded flex flex-col gap-8">
						<p className="text-xl">{pageT("fields.type.out.header")}</p>
						<div className="flex flex-col gap-4">
							{outMovementsFieldArray.fields.length > 0 ? (
								outMovementsFieldArray.fields.map((aMovement, index) => (
									<div
										key={aMovement.id}
										className="grid md:grid-cols-12 gap-2"
									>
										<div className="flex md:col-span-7 gap-2 min-w-0">
											<Controller
												control={methods.control}
												name={`outMovements.${index}.productId`}
												rules={{
													required: true,
													minLength: 3,
												}}
												render={({ field, fieldState }) => (
													<Select
														className="flex-grow min-w-0"
														name={`outMovements.${index}.code`}
														onChange={field.onChange}
														options={productOptions}
														isSearchable
														error={fieldState.invalid}
														value={field.value}
														placeholder={pageT("fields.code.placeholder")}
														aria-label={pageT("fields.code.label")}
														ref={field.ref}
													/>
												)}
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
											variant="error"
											outline
											square
											className="md:col-span-2"
											onClick={() => {
												outMovementsFieldArray.remove(index);
											}}
										>
											<TrashIcon className="w-5" />
										</Button>
									</div>
								))
							) : (
								<p>{pageT("empty.noOut")}</p>
							)}
						</div>
						<div className="grid md:grid-cols-2 gap-2">
							<Modal
								disclosure={
									<Button
										type="button"
										variant="primary"
										outline
										className="gap-2"
									>
										<QrCodeIcon className="w-5" />
										{pageT("fields.outMovements.scan")}
									</Button>
								}
								hideOnClickOutside
							>
								{({ close }) => (
									<div className="pt-6">
										<Scanner
											onScan={(result) => {
												onScannedBarCode(result, "out");
												close();
											}}
											classNames={{
												container: "scanner",
											}}
											formats={SCANNER_FORMATS}
											components={SCANNER_COMPONENTS}
											scanDelay={500}
											allowMultiple
											onError={(err) => {
												sendErrorToSentry(err);
											}}
										/>
									</div>
								)}
							</Modal>
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
								className="gap-2"
								variant="ghost"
							>
								<ArrowUpOnSquareIcon className="w-5" />
								{pageT("addOut")}
							</Button>
						</div>
					</div>
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
