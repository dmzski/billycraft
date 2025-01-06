import clsx from "clsx";
  import { type HTMLAttributes, type ReactNode, forwardRef } from "react";

export type RowProps = HTMLAttributes<HTMLDivElement> & {
	template?: string;
	children?: ReactNode;
};

export const Row = forwardRef<HTMLDivElement, RowProps>(
	({ template, children, className, ...props }: RowProps) => {
		const finalClasses = clsx("grid", className);

		return (
			<div
				style={{ gridTemplateColumns: template }}
				className={finalClasses}
				{...props}
			>
				{children}
			</div>
		);
	},
);

Row.displayName = "Row";
