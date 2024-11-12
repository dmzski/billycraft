import { Modal } from "@billycraft/ui";
import useCustomers from "@/hooks/useCustomers";
import { ComponentProps, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useI18n } from "@/i18n";
import { useAllBillsQuery } from "@/queries/useAllBillsQuery";
import { SelectField } from "@/components/form/SelectField";
import { Submit } from "@/components/form/Submit";

type SelectBillModalProps = {
	onSubmit: (billId: string) => void | Promise<void>;
	disclosure: ComponentProps<typeof Modal>["disclosure"];
};

type SelectBillFormProps = Omit<SelectBillModalProps, "disclosure"> & {
	close: () => void;
};

type SelectBillModalFormValues = {
	customerId?: string;
	title?: string;
	billId?: string;
};
const SelectBillForm = ({ onSubmit, close }: SelectBillFormProps) => {
	const { t } = useI18n();
	const { data: bills } = useAllBillsQuery();
	const customers = useCustomers();

	const methods = useForm<SelectBillModalFormValues>({
		mode: "onChange",
	});

	const customerOptions = useMemo(
		() => customers?.map(({ id, name }) => ({ value: id, label: name })) ?? [],
		[customers],
	);

	const selectedCustomerId = methods.watch("customerId");

	const billOptions = useMemo(
		() =>
			bills
				?.filter(({ customerId }) =>
					selectedCustomerId ? selectedCustomerId === customerId : true,
				)
				?.map(({ id, title, name }) => ({
					value: id,
					label: `${name} - ${title}`,
				})) ?? [],
		[bills, selectedCustomerId],
	);

	const onFormSubmit = ({ billId }: SelectBillModalFormValues) => {
		if (billId) {
			onSubmit?.(billId);
			close();
		}
	};

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={(event) => {
					event.stopPropagation();
					methods.handleSubmit(onFormSubmit)(event);
				}}
				className="flex flex-col gap-10"
			>
				<h2 className="text-xl">
					{t("accounting.outgoings.modals.selectBill.title")}
				</h2>
				<SelectField
					options={customerOptions}
					control={methods.control}
					name="customerId"
					onChange={() => {
						methods.setValue("billId", undefined, { shouldValidate: true });
					}}
					label={t("customer")}
					isSearchable
				/>
				<SelectField
					options={billOptions}
					control={methods.control}
					name="billId"
					label={t("bill")}
					isSearchable
					required
				/>
				<Modal.Actions>
					<Submit>{t("select")}</Submit>
				</Modal.Actions>
			</form>
		</FormProvider>
	);
};

const SelectBillModal = ({ onSubmit, disclosure }: SelectBillModalProps) => (
	<Modal disclosure={disclosure}>
		{({ close }) => <SelectBillForm close={close} onSubmit={onSubmit} />}
	</Modal>
);

export default SelectBillModal;
