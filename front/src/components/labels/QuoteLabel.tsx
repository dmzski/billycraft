import type { QuoteResponse } from "@/sdk";
import { DocumentIcon } from "@heroicons/react/24/solid";
import { type VariantProps, cva } from "class-variance-authority";
import { RRLink } from "../RRLink";

const labelVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap font-medium [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-accent-foreground [&_svg]:bg-accent [&_svg]:rounded-lg",
	{
		variants: {
			size: {
				md: "text-md gap-2 [&_svg]:size-8 [&_svg]:p-2",
				lg: "text-4xl gap-4 [&_svg]:size-12 [&_svg]:p-3",
			},
		},
		defaultVariants: {
			size: "md",
		},
	},
);

type QuoteLabelProps = {
	quote: QuoteResponse;
	to?: string;
} & VariantProps<typeof labelVariants>;

export const QuoteLabel = ({ quote, to, size = "md" }: QuoteLabelProps) => {
	if (to) {
		return (
			<p className={labelVariants({ size })}>
				<DocumentIcon />
				<RRLink to={to}>{quote.name}</RRLink>
			</p>
		);
	}

	return (
		<p className={labelVariants({ size })}>
			<DocumentIcon />
			<span>{quote.name}</span>
		</p>
	);
};
