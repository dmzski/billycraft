import Customer from "@/models/Customer";
import { IdentificationIcon } from "@heroicons/react/24/solid";
import { RRLink } from "../RRLink";
import { VariantProps, cva } from "class-variance-authority";
import { Badge } from "@coco-ui/core";
import { useI18n } from "@/i18n";

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

type CustomerLabelProps = {
	customer: Customer;
	to?: string;
} & VariantProps<typeof labelVariants>;

export const CustomerLabel = ({
	customer,
	to,
	size = "md",
}: CustomerLabelProps) => {
	const { t } = useI18n();

	if (to) {
		return (
			<p className={labelVariants({ size })}>
				<IdentificationIcon />
				<RRLink to={to}>{customer.name}</RRLink>
				{customer.deleted ? (
					<Badge variant="destructive">
						{t("deleted")}
					</Badge>
				) : null}
			</p>
		);
	}

	return (
		<p className={labelVariants({ size })}>
			<IdentificationIcon />
			<span>{customer.name}</span>
			{customer.deleted ? (
				<Badge variant="destructive">
					{t("deleted")}
				</Badge>
			) : null}
		</p>
	);
};
