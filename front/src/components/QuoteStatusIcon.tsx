import { QUOTE_STATUS_ICONS } from "@/constants/quote";
import type { QuoteStatus } from "@/sdk";
import type { ComponentProps } from "react";

type QuoteStatusIconProps = {
  status: QuoteStatus;
} & ComponentProps<
  (typeof QUOTE_STATUS_ICONS)[keyof typeof QUOTE_STATUS_ICONS]
>;

export const QuoteStatusIcon = ({ status, ...props }: QuoteStatusIconProps) => {
  const IconComponent = QUOTE_STATUS_ICONS[status];
  return <IconComponent {...props} />;
};
