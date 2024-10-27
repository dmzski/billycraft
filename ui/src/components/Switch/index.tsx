import { Label } from "components/Label";
import { tw } from "lib/utils";
import { ComponentProps, ReactNode, forwardRef, useId } from "react";

const switchContainerClassnames =
	"peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input";
const switchBallClassnames =
	"pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0";

export type SwitchProps = Omit<
	ComponentProps<"button">,
	"type" | "children"
> & {
	labelPosition?: "left" | "right";
	label?: ReactNode;
	checked?: boolean;
	onCheckedChange?: (newState: boolean) => void;
};

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
	(
		{
			labelPosition = "right",
			label,
			className,
			checked,
			onCheckedChange,
			onClick,
			id: idProp,
			...props
		},
		ref,
	) => {
		const generatedId = useId();
		const id = idProp ?? generatedId;
		if (!label) {
			return (
				<button
					role="switch"
					data-state={checked ? "checked" : "unchecked"}
					aria-checked={checked}
					{...props}
					type="button"
					ref={ref}
					className={tw(switchContainerClassnames, className)}
					onClick={(event) => {
						onClick?.(event);
						onCheckedChange?.(!checked);
					}}
				>
					<span
						data-state={checked ? "checked" : "unchecked"}
						className={switchBallClassnames}
					/>
				</button>
			);
		}

		return (
			<div className={tw("flex gap-2 items-center", className)}>
				{labelPosition === "left" ? <Label htmlFor={id}>{label}</Label> : null}
				<button
					role="switch"
					data-state={checked ? "checked" : "unchecked"}
					aria-checked={checked}
					{...props}
					type="button"
					ref={ref}
					className={tw(switchContainerClassnames, className)}
					onClick={(event) => {
						onClick?.(event);
						onCheckedChange?.(!checked);
					}}
				>
					<span
						data-state={checked ? "checked" : "unchecked"}
						className={switchBallClassnames}
					/>
				</button>
				{labelPosition === "right" ? <Label htmlFor={id}>{label}</Label> : null}
			</div>
		);
	},
);

Switch.displayName = "Switch"

