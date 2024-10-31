import Supplier from "@/models/Supplier";
import { BuildingStorefrontIcon } from "@heroicons/react/24/solid";
import { RRLink } from "../RRLink";
import { VariantProps, cva } from "class-variance-authority";

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

type SupplierLabelProps = {
	supplier: Supplier;
	to?: string;
} & VariantProps<typeof labelVariants>;

export const SupplierLabel = ({ supplier, to, size = "md" }: SupplierLabelProps) => {
	if (to) {
		return (
			<p className={labelVariants({ size })}>
				<BuildingStorefrontIcon />
				<RRLink to={to}>{supplier.name}</RRLink>
			</p>
		);
	}

	return (
		<p className={labelVariants({ size })}>
			<BuildingStorefrontIcon />
			<span>{supplier.name}</span>
		</p>
	);
};
