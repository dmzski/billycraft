import { useToast } from "@billycraft/ui";
import { useHistory } from "react-router-dom";
import { QuoteApi } from "@/api/QuoteApi";
import { ROUTES } from "@/routes";
import {
	QuoteFormContent,
	type QuoteFormValues,
} from "@/pages/Quotes/components/QuoteFormContent";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useI18n } from "@/i18n";
import { useForm } from "react-hook-form";
import { QuoteCreateRequest } from "@/models/dtos/QuoteCreateRequest";
import { RRLink } from "@/components/RRLink";
import { Form } from "@/components/form/Form";
import { Submit } from "@/components/form/Submit";
import { useUser } from "@/providers/UserProvider";
import { useMemo } from "react";
import { FormErrorAlert } from "@/components/FormErrorAlert";

const defaultQuote = {
	lines: [],
	tva: 0,
	title: "",
	customerId: "",
} as QuoteFormValues;

export const Create = () => {
	const { t } = useI18n();
	const toast = useToast();
	const { push } = useHistory();
	const { organization } = useUser();

	const initialValues = useMemo<QuoteFormValues>(
		() => ({
			...defaultQuote,
			tva: organization?.vatPercent ?? 0,
		}),
		[organization],
	);

	const methods = useForm({
		shouldFocusError: true,
		mode: "onChange",
		values: initialValues,
	});

	const onSubmit = async (data: QuoteFormValues) => {
		const tmp: QuoteCreateRequest = {
			...data,
			lines: data.lines.map((line, index: number) => ({
				...line,
				line: index + 1,
				price: line.price ? Number(`${line.price}`) : null,
				quantity: line.quantity ? Number(`${line.quantity}`) : null,
			})),
		};
		try {
			const { id } = await QuoteApi.create(tmp);
			toast.show(t("quotes.form.submit.success"));
			push(ROUTES.QUOTE_OVERVIEW.path({ id }));
		} catch {
			toast.destructive(t("genericFormError"));
		}
	};

	return (
		<div className="w-full px-4 flex flex-col gap-12">
			<RRLink className="gap-1 flex items-center" to={ROUTES.QUOTES.path()}>
				<ChevronLeftIcon className="w-5" /> {t("quotes.form.backTo")}
			</RRLink>
			<div className="flex items-center flex-wrap">
				<div className="flex items-center gap-4 flex-grow">
					<h1 className="text-3xl font-semibold">
						{t("quotes.form.title.new")}
					</h1>
				</div>
			</div>
			<Form methods={methods} onSubmit={onSubmit}>
				<div className="flex flex-col gap-12">
					<QuoteFormContent />
					<FormErrorAlert />
					<div className="flex justify-end">
						<Submit>{t("quotes.form.submit")}</Submit>
					</div>
				</div>
			</Form>
		</div>
	);
};
