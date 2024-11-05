import Quote from "../models/Quote";

export const isQuoteMinimumAccepted = ({ status }: Quote): boolean =>
	["ARCHIVED", "ACCEPTED", "DEPOSIT_ASK"].includes(status);
