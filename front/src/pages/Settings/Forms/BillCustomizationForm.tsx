import { Button, Input, Switch, TextArea, useToast } from "@billycraft/ui";
import { type ChangeEvent, useEffect, useState } from "react";
import { useI18n } from "@/i18n";
import { type BillCustomizationResponse, BillCustomizationService } from "@/sdk";

type BillCustomizationFormProps = {
	billCustomization: BillCustomizationResponse;
};

const BillCustomizationForm = ({
	billCustomization,
}: BillCustomizationFormProps) => {
	const { t } = useI18n();
	const [newBillCustomization, setNewBillCustomization] = useState(
		{} as BillCustomizationResponse,
	);
	const toast = useToast();

	const handleToggle = (property: keyof BillCustomizationResponse) => () => {
		setNewBillCustomization((current) => ({
			...current,
			[property]: !current[property],
		}));
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		newBillCustomization.id
			? await BillCustomizationService.patchBillCustomizationById({
					path: { id: newBillCustomization.id },
					body: newBillCustomization,
				})
			: await BillCustomizationService.postBillCustomization({
					body: newBillCustomization,
				});
		toast.show(t("settings.forms.billCustomization.submit.success"));
	};

	useEffect(() => {
		if (billCustomization) {
			setNewBillCustomization(billCustomization);
		}
	}, [billCustomization]);

	return (
		<form onSubmit={onSubmit} className="w-full flex flex-col gap-8">
			<h2 className="text-2xl">
				{t("settings.forms.billCustomization.title")}
			</h2>
			<div className="ml-4 flex flex-col gap-8">
				<div className="flex w-full items-center gap-4">
					<div
						className="w-10 h-10 border-2 border-base-300"
						style={{
							backgroundColor: newBillCustomization.mainColor || "white",
						}}
					/>
					<Input
						id="mainColor"
						value={newBillCustomization.mainColor}
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							setNewBillCustomization({
								...newBillCustomization,
								mainColor: e.target.value,
							});
						}}
						label={t("settings.forms.billCustomization.mainColor.label")}
						placeholder={t(
							"settings.forms.billCustomization.mainColor.placeholder",
						)}
						className="w-full"
					/>
				</div>
				<div className="flex">
					<div className="flex flex-grow flex-col gap-2 items-start">
						<h3>{t("customer information")}</h3>
						<Switch
							checked={newBillCustomization.displayCustomerEmail}
							id="displayCustomerEmail"
							onCheckedChange={handleToggle("displayCustomerEmail")}
							label={t("display customer email")}
						/>
						<Switch
							checked={newBillCustomization.displayCustomerPhoneNumber}
							id="displayCustomerPhoneNumber"
							onCheckedChange={handleToggle("displayCustomerPhoneNumber")}
							label={t("display customer phonenumber")}
						/>
					</div>
					<div className="flex flex-grow flex-col gap-2 items-start">
						<h3>{t("compagny informations")}</h3>
						<Switch
							checked={newBillCustomization.displayCompanyEmail}
							id="displayCompanyEmail"
							onCheckedChange={handleToggle("displayCompanyEmail")}
							label={t("display compagny email")}
						/>
						<Switch
							checked={newBillCustomization.displayCompanyPhoneNumber}
							id="displayCompanyPhoneNumber"
							onCheckedChange={handleToggle("displayCompanyPhoneNumber")}
							label={t("display compagny phonenumber")}
						/>
					</div>
				</div>
				<TextArea
					id="afterTable"
					label={t("settings.forms.billCustomization.afterTable.label")}
					rows={5}
					placeholder={t("settings.forms.billCustomization.afterTable.label")}
					value={newBillCustomization.afterTable}
					className="w-full"
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
						setNewBillCustomization({
							...newBillCustomization,
							afterTable: e.target.value,
						})
					}
				/>
				<TextArea
					label={t("settings.forms.billCustomization.footer.label")}
					id="footer"
					rows={6}
					className="w-full"
					placeholder={t("settings.forms.billCustomization.footer.placeholder")}
					value={newBillCustomization.footer}
					onChange={(e) =>
						setNewBillCustomization({
							...newBillCustomization,
							footer: e.target.value,
						})
					}
					helper={t("settings.forms.billCustomization.footer.helper")}
				/>
				<Button type="submit" onClick={onSubmit}>
					{t("settings.forms.billCustomization.submit")}
				</Button>
			</div>
		</form>
	);
};

export default BillCustomizationForm;
