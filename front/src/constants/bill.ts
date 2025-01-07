import type { BillStatus } from "@/sdk";
import {
	CheckIcon,
	DocumentIcon,
	EnvelopeIcon,
	InboxArrowDownIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";

export const BILL_STATUS_ICONS: Record<BillStatus, typeof EnvelopeIcon> = {
	DRAFT: DocumentIcon,
	SENT: EnvelopeIcon,
	PAID: CheckIcon,
	REFUSED: XMarkIcon,
	ARCHIVED: InboxArrowDownIcon,
};
