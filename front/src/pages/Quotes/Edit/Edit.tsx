import { Loader, useToast } from "@billycraft/ui";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { QuoteApi } from "@/api/QuoteApi";
import { QuoteRouteProps, ROUTES } from "@/routes";
import { QuoteFormContent } from "@/pages/Quotes/components/QuoteFormContent";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useI18n } from "@/i18n";
import { useQuoteByIdQuery } from "@/queries/useQuoteByIdQuery";
import { QuoteFormValues } from "../components/QuoteFormContent";
import { useForm } from "react-hook-form";
import { QuoteUpdateRequest } from "@/models/dtos/QuoteUpdateRequest";
import { useMemo } from "react";
import { calculatePriceTTC } from "@/utils/price";
import { RRLink } from "@/components/RRLink";
import { QuoteLabel } from "@/components/labels/QuoteLabel";
import { Form } from "@/components/form/Form";
import { Submit } from "@/components/form/Submit";
import { FormErrorAlert } from "@/components/FormErrorAlert";

const defaultQuote = {
	lines: [],
	tva: 0,
	title: "",
	customerId: "",
} as QuoteFormValues;

export const Edit = () => {
	const { t } = useI18n();
	const toast = useToast();
	const { push } = useHistory();
	const { id } = useParams<QuoteRouteProps>();
	const { data: quote, isLoading } = useQuoteByIdQuery(id, {
		enabled: !!id,
	});

	const onSubmit = async (data: QuoteFormValues) => {
		const tmp: QuoteUpdateRequest = {
			id: quote?.id ?? "",
			...data,
			lines: data.lines.map((line, index: number) => ({
				...line,
				line: index + 1,
				price: line.price ? Number(`${line.price}`) : null,
				quantity: line.quantity ? Number(`${line.quantity}`) : null,
			})),
		};
		try {
			if (quote?.id) {
				await QuoteApi.update(tmp);
				toast.show(t("quotes.form.submit.success"));
				push(ROUTES.QUOTE_OVERVIEW.path({ id: quote.id }));
			}
		} catch {
			toast.destructive(t("genericFormError"));
		}
	};

	const initialValues: QuoteFormValues = useMemo(
		() =>
			quote
				? {
						...quote,
						lines: quote.lines.map(({ price, ...rest }) => ({
							...rest,
							price,
							itPrice: calculatePriceTTC(price, quote.tva),
						})),
					}
				: defaultQuote,
		[quote],
	);

	const methods = useForm<QuoteFormValues>({
		shouldFocusError: true,
		mode: "onChange",
		values: initialValues,
		disabled: !!(quote && quote.status !== "DRAFT"),
	});

	if (!quote && isLoading) {
		return <Loader />;
	}

	if (!quote) {
		return t("genericDataLoadError");
	}

	if (quote.status !== "DRAFT") {
		return <Redirect to={ROUTES.QUOTE_OVERVIEW.path({ id: quote.id })} />;
	}

	return (
		<div className="flex flex-col gap-12">
			<RRLink
				className="gap-2 inline-flex items-center"
				to={ROUTES.QUOTE_OVERVIEW.path({ id: quote.id })}
			>
				<ChevronLeftIcon className="size-5" /> {t("quotes.form.backTo.edit")}
			</RRLink>
			<div>
				<QuoteLabel quote={quote} size="lg" />
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
