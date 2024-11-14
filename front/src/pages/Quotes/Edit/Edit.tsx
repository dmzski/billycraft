import { Loader, useToast } from "@billycraft/ui";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { type QuoteRouteProps, ROUTES } from "@/routes";
import { QuoteFormContent } from "@/pages/Quotes/components/QuoteFormContent";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useI18n } from "@/i18n";
import { useQuoteByIdQuery } from "@/queries/useQuoteByIdQuery";
import type { QuoteFormValues } from "../components/QuoteFormContent";
import { useForm } from "react-hook-form";
import { useMemo } from "react";
import { calculatePriceTTC } from "@/utils/price";
import { RRLink } from "@/components/RRLink";
import { QuoteLabel } from "@/components/labels/QuoteLabel";
import { Form } from "@/components/form/Form";
import { Submit } from "@/components/form/Submit";
import { FormErrorAlert } from "@/components/FormErrorAlert";
import { QuotesService, type UpdateQuoteRequest } from "@/sdk";

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
		const tmp: UpdateQuoteRequest = {
			...data,
			lines: data.lines.map((line, index: number) => ({
				name: line.name,
				type: line.type,
				description: line.description ?? undefined,
				productId: line.productId ?? undefined,
				line: index + 1,
				price: line.price ? Number(`${line.price}`) : undefined,
				quantity: line.quantity ? Number(`${line.quantity}`) : undefined,
			})),
		};
		try {
			if (quote?.id) {
				await QuotesService.patchQuotesById({
					path: { id: quote.id },
					body: tmp,
				});
				toast.show(t("quotes.form.submit.success"));
				push(ROUTES.QUOTE_OVERVIEW.path({ id: quote.id }));
			}
		} catch {
			toast.destructive(t("genericFormError"));
		}
	};

	const initialValues = useMemo<QuoteFormValues>(
		() =>
			quote
				? {
						...quote,
						tva: quote.tva ?? 0,
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
