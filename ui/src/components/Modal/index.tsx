import {
	cloneElement,
	ComponentProps,
	MouseEventHandler,
	ReactEventHandler,
	ReactNode,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button";
import MarkXIcon from "@heroicons/react/24/solid/XMarkIcon";
import clsx from "clsx";
import { tw } from "lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const DELAY_TRANSITION = 100;
const dialogClassNames = `z-50 duration-200 w-full backdrop:bg-black/70
data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0
data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg`;

const dialogContentClassNames = `
overflow-auto
grid max-w-screen
gap-4 border bg-background p-6 shadow-lg sm:rounded-lg
text-foreground
`;

const dialogVariants = cva(dialogClassNames, {
	variants: {
		size: {
			lg: "max-w-5xl",
			md: "max-w-3xl",
			sm: "max-w-lg",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

export type ModalProps = {
	disclosure?: JSX.Element;
	children: ((props: { close: () => void }) => JSX.Element) | ReactNode;
	withoutPortal?: boolean;
	hideOnClickOutside?: boolean;
	open?: boolean;
	onClose?: () => void;
} & VariantProps<typeof dialogVariants>;

type ModalTitleProps = ComponentProps<"h2">;

export const Modal = ({
	disclosure,
	children,
	withoutPortal,
	hideOnClickOutside,
	open: openProp,
	onClose,
	size = "md",
}: ModalProps) => {
	const id = useId();
	const [open, setOpen] = useState(openProp && onClose ? openProp : false);
	const [transitionState, setTransitionState] = useState<
		"opening" | "closing" | "open" | "closed"
	>(open ? "opening" : "closed");
	const disclosureRef = useRef<HTMLElement>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (!openProp && !onClose) {
			const handleClick = () => {
				setOpen(true);
			};
			if (disclosureRef.current) {
				disclosureRef.current.addEventListener("click", handleClick);
			}

			return () => {
				if (disclosureRef.current) {
					disclosureRef.current.removeEventListener("click", handleClick);
				}
			};
		}

		if (onClose && openProp !== open) {
			setOpen(!!openProp);
		}
	}, [disclosureRef, openProp, onClose]);

	const Component = disclosure
		? cloneElement(disclosure, {
				ref: disclosureRef,
				"aria-controls": id,
			})
		: undefined;

	const close = () => {
		if (onClose) {
			onClose();
		} else {
			setOpen(false);
		}
	};
	const handleClickOutside: MouseEventHandler<HTMLDialogElement> = (event) => {
		event.preventDefault();
		event.stopPropagation();
		if (hideOnClickOutside) {
			close();
		}

		return false;
	};

	const handleCloseDialog: ReactEventHandler<HTMLDialogElement> = (e) => {
		if (onClose) {
			onClose();
		}
		if (openProp) {
			e.preventDefault();
		} else {
			setOpen(false);
		}
	};

	useEffect(() => {
		let displayContentTimeout: ReturnType<typeof setTimeout>;
		if (dialogRef.current) {
			const isOpen = dialogRef.current.open;
			if (isOpen !== open) {
				if (open) {
					setTransitionState((original) =>
						original !== "open" ? "opening" : "open",
					);
					displayContentTimeout = setTimeout(() => {
						dialogRef.current?.showModal();
						setTransitionState("open");
					}, DELAY_TRANSITION);
				} else {
					setTransitionState((original) =>
						original !== "closed" ? "closing" : "closed",
					);
					displayContentTimeout = setTimeout(() => {
						setTransitionState("closed");
						dialogRef.current?.close();
					}, DELAY_TRANSITION);
				}
			}
		}

		return () => {
			if (displayContentTimeout) {
				clearTimeout(displayContentTimeout);
			}
		};
	}, [open]);

	const modalContentRendered = useMemo(
		() => (
			<dialog
				id={id}
				onClick={handleClickOutside}
				onClose={handleCloseDialog}
				ref={dialogRef}
				className={tw(dialogVariants({ size }))}
				aria-expanded={transitionState.includes("open")}
				data-state={transitionState.includes("open") ? "open" : "closed"}
			>
				{transitionState !== "closed" ? (
					<div
						className={dialogContentClassNames}
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						<Button
							onClick={close}
							variant="ghost"
							className="size-8 absolute right-1 top-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
							type="button"
							size="icon"
						>
							<MarkXIcon className="size-4" />
							<span className="sr-only">Close</span>
						</Button>

						{typeof children === "function" ? children({ close }) : children}
					</div>
				) : null}
			</dialog>
		),
		[children, close, transitionState],
	);

	return (
		<>
			{Component}
			{withoutPortal
				? modalContentRendered
				: createPortal(modalContentRendered, document.body)}
		</>
	);
};

const ModalActions = ({ children }: { children: ReactNode }) => {
	return <div className="flex items-center gap-2 justify-end">{children}</div>;
};

const ModalTitle = ({ children, className, ...props }: ModalTitleProps) => (
	<h2 className={clsx("text-lg font-bold", className)} {...props}>
		{children}
	</h2>
);

Modal.Actions = ModalActions;
Modal.Title = ModalTitle;
