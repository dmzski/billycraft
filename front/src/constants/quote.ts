import type { QuoteStatus } from "@/sdk";
import {
	CheckIcon,
	DocumentIcon,
	EnvelopeIcon,
	InboxArrowDownIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";

export const QUOTE_STATUS: QuoteStatus[] = [
	"DRAFT",
	"SENT",
	"ACCEPTED",
	"REFUSED",
	"ARCHIVED",
];

export const QUOTE_STATUS_ICONS: Record<QuoteStatus, typeof EnvelopeIcon> = {
	DRAFT: DocumentIcon,
	SENT: EnvelopeIcon,
	ACCEPTED: CheckIcon,
	REFUSED: XMarkIcon,
	ARCHIVED: InboxArrowDownIcon,
};
