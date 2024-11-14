import type { QuoteResponse } from "@/sdk";

export const isQuoteMinimumAccepted = ({ status }: QuoteResponse): boolean =>
	["ARCHIVED", "ACCEPTED", "DEPOSIT_ASK"].includes(status);
