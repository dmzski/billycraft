import { Button, Input, Select } from "@coco-ui/core";
import { OutgoingRequest } from "@/models/Outgoing";
import { useMemo } from "react";
import { Control, useController, useWatch } from "react-hook-form";
import SelectBillModal from "./modals/SelectBillModal";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useAllSuppliersQuery } from "@/queries/useAllSuppliersQuery";
import { calculatePriceTTC } from "@/utils/price";
import { useAllBillsQuery } from "@/queries/useAllBillsQuery";

type RowProps = {
	control: Control<OutgoingRequest>;
	index: number;
	onDelete: () => void;
	disabled?: boolean;
};
const Row = ({ control, index, onDelete, disabled }: RowProps) => {
	const vatController = useController({
		name: `lines.${index}.vat`,
		control,
		defaultValue: 0,
		rules: {
			min: 0,
			max: 100,
			required: true,
		},
	});

	const { data: suppliers } = useAllSuppliersQuery();
	const { data: bills } = useAllBillsQuery();

	const [totalHT, vat] = useWatch({
		name: [`lines.${index}.totalHT`, `lines.${index}.vat`],
		control,
	});

	const totalTTC = useMemo(
		() =>
			!Number.isNaN(totalHT) && !Number.isNaN(vat)
				? calculatePriceTTC(totalHT, vat)
				: 0,
		[totalHT, vat],
	);

	const supplierOptions = useMemo(
		() =>
			suppliers
				? suppliers.map(({ id, name, color }) => ({
						value: id,
						label: name,
						render: color ? (
							<span className="inline-flex gap-2 items-center">
								<span
									className="size-4 rounded-full"
									style={{ backgroundColor: color }}
								/>
								<span>{name}</span>
							</span>
						) : undefined,
					}))
				: [],
		[suppliers],
	);

	const { field: supplierIdField, fieldState: supplierIdFieldState } =
		useController({
			control,
			name: `lines.${index}.supplierId`,
			rules: { required: true },
		});
	const {
		field: supplierBillReferenceField,
		fieldState: supplierBillReferenceFieldState,
	} = useController({ control, name: `lines.${index}.supplierBillReference` });
	const { field: billIdField, fieldState: billIdFieldState } = useController({
		control,
		name: `lines.${index}.billId`,
	});
	const { field: etTotalField, fieldState: etTotalFieldState } = useController({
		control,
		name: `lines.${index}.totalHT`,
		rules: { required: true },
	});

	return (
		<div className="px-4 py-2 grid md:grid-cols-12 items-center gap-4">
			<div className="md:col-span-2">
				<Select
					required
					className="w-full"
					name={supplierIdField.name}
					value={supplierIdField.value}
					onChange={(value) => {
						supplierIdField.onChange(value);
						const vatFound = suppliers?.find(({ id }) => id === value)?.vat;
						vatController.field.onChange(vatFound ?? 0);
					}}
					options={supplierOptions}
					ref={supplierIdField.ref}
					error={supplierIdFieldState.invalid}
					disabled={disabled}
					isSearchable
				/>
			</div>
			<div className="md:col-span-2">
				<Input
					name={supplierBillReferenceField.name}
					value={supplierBillReferenceField.value}
					onChange={supplierBillReferenceField.onChange}
					ref={supplierBillReferenceField.ref}
					error={supplierBillReferenceFieldState.invalid}
					disabled={disabled}
				/>
			</div>
			<div className="md:col-span-2 relative">
				<SelectBillModal
					onSubmit={billIdField.onChange}
					disclosure={
						<Input
							name={billIdField.name}
							value={
								bills?.find(({ id }) => id === billIdField.value)?.name ??
								billIdField.value
							}
							readOnly
							ref={billIdField.ref}
							error={billIdFieldState.invalid}
							disabled={disabled}
							suffix={
								billIdField.value ? (
									<Button
										size="icon"
										variant="ghost"
										onClick={() => billIdField.onChange("")}
									>
										<XMarkIcon />
									</Button>
								) : null
							}
						/>
					}
				/>
			</div>
			<div className="md:col-span-2">
				<Input
					required
					name={etTotalField.name}
					onBlur={(event) => {
						etTotalField.onChange(Number(event.target.value));
						etTotalField.onBlur();
					}}
					type="number"
					onChange={etTotalField.onChange}
					value={etTotalField.value}
					step={0.01}
					ref={etTotalField.ref}
					error={etTotalFieldState.invalid}
					disabled={disabled}
					suffix={<span className="px-2">€</span>}
				/>
			</div>
			<div className="md:col-span-1">
				<Input
					type="number"
					step={1}
					min={0}
					max={100}
					name={vatController.field.name}
					onChange={vatController.field.onChange}
					value={vatController.field.value}
					onBlur={(event) => {
						vatController.field.onChange(Number(event.target.value));
						vatController.field.onBlur();
					}}
					ref={vatController.field.ref}
					error={vatController.fieldState.invalid}
					disabled={disabled}
					required
					suffix={<span className="px-2">%</span>}
				/>
			</div>
			<div className="md:col-span-2">
				<Input
					className="w-full"
					type="number"
					value={totalTTC}
					readOnly
					suffix={<span className="px-2">€</span>}
				/>
			</div>
			<div className="flex justify-end">
				<Button
					variant="destructive"
					size="icon"
					onClick={onDelete}
					type="button"
				>
					<TrashIcon />
				</Button>
			</div>
		</div>
	);
};

export default Row;
