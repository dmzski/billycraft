import { Button, Input, useToast } from "@billycraft/ui";
import { endOfMonth, format, formatRFC3339 } from "date-fns";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import OutgoingLinesTable from "./OutgoingLinesTable";
import { useI18n } from "@/i18n";
import {
	type OutgoingRequest,
	type OutgoingResponse,
	OutgoingsService,
} from "@/sdk";

type FormProps = {
	outgoing?: OutgoingResponse;
	onSubmitSuccess?: (res: OutgoingResponse) => void | Promise<void>;
	disabledFields?: string[];
};
const Form = ({ outgoing, onSubmitSuccess, disabledFields }: FormProps) => {
	const { t } = useI18n();
	const toast = useToast();
	const {
		handleSubmit,
		control,
		formState: { isSubmitting, isValid },
		reset,
	} = useForm<OutgoingRequest>({
		mode: "onChange",
	});

	const onSubmit = async ({ name, lines, startDate }: OutgoingRequest) => {
		const values = {
			lines: lines.map((line, index) => ({
				...line,
				line: index + 1,
				totalHT: Number(line.totalHT) || 0,
				vat: Number(line.vat) || 0,
			})),
			name,
			startDate: formatRFC3339(startDate ? Date.parse(startDate) : Date.now()),
			endDate: formatRFC3339(
				endOfMonth(startDate ? Date.parse(startDate) : Date.now()),
			),
		} as OutgoingRequest;
		try {
			const res = outgoing?.id
				? await OutgoingsService.patchOutgoingsById({
						path: { id: outgoing.id },
						body: values,
					}).then(({ data }) => data)
				: await OutgoingsService.postOutgoings({ body: values }).then(
						({ data }) => data,
					);
			toast.show(
				t(
					outgoing?.id
						? "accounting.outgoings.forms.add.submit.edit.success"
						: "accounting.outgoings.forms.add.submit.new.success",
				),
			);
			if (res) {
				onSubmitSuccess?.(res);
			}
		} catch {
			toast.destructive(t("genericFormError"));
		}
	};

	useEffect(() => {
		if (reset && outgoing) {
			reset({
				...outgoing,
				startDate: outgoing.startDate
					? format(Date.parse(outgoing.startDate), "yyyy-MM")
					: undefined,
			});
		}
	}, [reset, outgoing]);

	return (
		<form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
			<Controller
				name="name"
				rules={{ required: true }}
				control={control}
				render={({ field, fieldState: { invalid } }) => (
					<Input
						className="mb-4"
						value={field.value}
						onChange={field.onChange}
						onBlur={field.onBlur}
						ref={field.ref}
						error={invalid}
						required
						label={t("accounting.outgoings.forms.add.fields.name")}
					/>
				)}
			/>
			<Controller
				name="startDate"
				rules={{
					required: true,
					validate: async (value) => {
						if (disabledFields?.includes("startDate")) return undefined;

						const date = formatRFC3339(value ? Date.parse(value) : Date.now());
						try {
							await OutgoingsService.getOutgoingsFirst({ path: { date } });
							return t("accounting.outgoings.forms.add.error.alreadyExist");
						} catch {
							return undefined;
						}
					},
				}}
				control={control}
				render={({ field, fieldState: { error } }) => (
					<div className="flex flex-col mb-4">
						<Input
							value={field.value}
							onChange={field.onChange}
							onBlur={field.onBlur}
							ref={field.ref}
							error={!!error}
							required
							label={t("accounting.outgoings.forms.add.fields.period")}
							type="month"
							disabled={disabledFields?.includes(field.name)}
						/>
						{error ? (
							<span className="text-destructive text-xs">{error.message}</span>
						) : null}
					</div>
				)}
			/>
			<OutgoingLinesTable control={control} />
			<Button
				className="mt-4"
				disabled={isSubmitting || !isValid}
				type="submit"
			>
				{t("save")}
			</Button>
		</form>
	);
};

export default Form;
