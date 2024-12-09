import { BILL_STATUS_ICONS } from "@/constants/bill";
import type { BillStatus } from "@/sdk";
import type { ComponentProps } from "react";

type BillStatusIconProps = {
	status: BillStatus;
} & ComponentProps<(typeof BILL_STATUS_ICONS)[keyof typeof BILL_STATUS_ICONS]>;

export const BillStatusIcon = ({ status, ...props }: BillStatusIconProps) => {
	const IconComponent = BILL_STATUS_ICONS[status];
	return <IconComponent {...props} />;
};
