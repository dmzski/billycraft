import { type ReactNode, useEffect, useState } from "react";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import { createPortal } from "react-dom";
import { type VariantProps, cva } from "class-variance-authority";
import { tw } from "lib/utils";

const backdropClassnames =
	"fixed inset-0 z-50 bg-black/80 fill-mode-forwards data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0";

const drawerVariants = cva(
	"overflow-hidden overflow-y-auto fixed z-50 gap-4 bg-background fill-mode-forwards shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
	{
		variants: {
			side: {
				top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
				bottom:
					"inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
				left: "inset-y-0 left-0 h-full border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
				right:
					"inset-y-0 right-0 h-full  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
			},
		},
		defaultVariants: {
			side: "right",
		},
	},
);

const closeButtonClassNames = `absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary
`;

const DELAY_TRANSITION = 300;

export type DrawerProps = {
	open: boolean;
	onClose?: () => void;
	children?: ReactNode;
	noBackdrop?: boolean;
	hasCloseButton?: boolean;
	withoutPortal?: boolean;
	className?: string;
} & VariantProps<typeof drawerVariants>;

export const Drawer = ({
	children,
	open: openProp = false,
	noBackdrop = false,
	hasCloseButton = true,
	onClose,
	withoutPortal = false,
	side,
	className,
}: DrawerProps) => {
	const [open, setOpen] = useState(openProp && onClose ? openProp : false);
	const [transitionState, setTransitionState] = useState<
		"opening" | "closing" | "open" | "closed"
	>("closed");

	useEffect(() => {
		if (onClose && openProp !== open) {
			setOpen(!!openProp);
		}
	}, [openProp, onClose, open]);

	useEffect(() => {
		let displayContentTimeout: ReturnType<typeof setTimeout>;
		if (open) {
			setTransitionState((originalState) =>
				originalState !== "open" ? "opening" : "open",
			);
			displayContentTimeout = setTimeout(() => {
				setTransitionState("open");
			}, DELAY_TRANSITION);
		} else {
			setTransitionState((originalState) =>
				originalState !== "closed" ? "closing" : "closed",
			);
			displayContentTimeout = setTimeout(() => {
				setTransitionState("closed");
			}, DELAY_TRANSITION);
		}

		return () => {
			if (displayContentTimeout) {
				clearTimeout(displayContentTimeout);
			}
		};
	}, [open]);

	const modalRendered = (
		<div
			aria-hidden={transitionState === "closed"}
			data-state={transitionState !== "closed" ? "open" : "closed"}
			className="data-[state=closed]:sr-only"
		>
			{transitionState !== "closed" || open ? (
				<>
					{!noBackdrop ? (
						<div
							onClick={onClose}
							onKeyUp={onClose}
							data-state={open ? "open" : "closed"}
							className={backdropClassnames}
						/>
					) : null}

					<div
						className={tw(drawerVariants({ side, className }))}
						data-state={open ? "open" : "closed"}
					>
						{children}
						{hasCloseButton ? (
							<button
								onClick={onClose}
								className={closeButtonClassNames}
								type="button"
							>
								<XMarkIcon className="size-4" />
								<span className="sr-only">Close</span>
							</button>
						) : null}
					</div>
				</>
			) : null}
		</div>
	);

	return withoutPortal
		? modalRendered
		: createPortal(modalRendered, document.body);
};
