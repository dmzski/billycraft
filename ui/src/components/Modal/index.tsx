import MarkXIcon from "@heroicons/react/24/solid/XMarkIcon";
import { type VariantProps, cva } from "class-variance-authority";
import clsx from "clsx";
import { tw } from "lib/utils";
import {
	type ComponentProps,
	type MouseEventHandler,
	type ReactElement,
	type ReactNode,
	cloneElement,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button";

const DELAY_TRANSITION = 200;
const backdropClassNames = `
z-50
max-h-svh
fixed inset-0 aria-[expanded=false]:sr-only bg-black/80
data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
fill-mode-forwards
`;
const dialogClassNames = `
duration-200 w-full h-auto max-h-full m-2 absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]
gap-4 border bg-background p-6 shadow-lg sm:rounded-lg
text-foreground
overscroll-contain
overflow-y-auto
grid sm:rounded-lg
fill-mode-forwards
data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[50%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[50%]
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
	disclosure?: ReactElement;
	children: ((props: { close: () => void }) => ReactElement) | ReactNode;
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
	const previousOverflow = useRef(document.body.style.overflow);

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
	}, [open, openProp, onClose]);

	const Component = disclosure
		? cloneElement(disclosure, {
				// @ts-ignore TODO improve
				ref: disclosureRef,
				"aria-controls": id,
			})
		: undefined;

	const close = useCallback(() => {
		if (onClose) {
			onClose();
		} else {
			setOpen(false);
		}
	}, [onClose]);

	const handleClickOutside: MouseEventHandler<HTMLElement> = useCallback((event) => {
		event.preventDefault();
		event.stopPropagation();
		if (hideOnClickOutside) {
			close();
		}

		return false;
	}, [hideOnClickOutside, close]);

	useEffect(() => {
		let displayContentTimeout: ReturnType<typeof setTimeout>;
		if (open) {
			if (previousOverflow.current !== "hidden") {
				document.body.style.overflow = "hidden";
			}
			setTransitionState((original) =>
				original !== "open" ? "opening" : "open",
			);
			displayContentTimeout = setTimeout(() => {
				setTransitionState("open");
			}, DELAY_TRANSITION);
		} else {
			setTransitionState((original) =>
				original !== "closed" ? "closing" : "closed",
			);
			displayContentTimeout = setTimeout(() => {
				document.body.style.overflow = previousOverflow.current;
				setTransitionState("closed");
			}, DELAY_TRANSITION);
		}

		return () => {
			if (displayContentTimeout) {
				clearTimeout(displayContentTimeout);
			}
		};
	}, [open]);

	const modalContentRendered = useMemo(
		() => (
			<div
				onClick={handleClickOutside}
				onKeyUp={undefined}
				aria-expanded={transitionState !== "closed"}
				data-state={transitionState.includes("open") ? "open" : "closed"}
				className={backdropClassNames}
			>
				{transitionState !== "closed" ? (
					<dialog
						open
						id={id}
						onClick={(event) => {
							event.stopPropagation();
						}}
						onKeyDown={(event) => {
							event.stopPropagation();
						}}
						ref={dialogRef}
						className={tw(dialogVariants({ size }))}
						data-state={open ? "open" : "closed"}
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
					</dialog>
				) : null}
			</div>
		),
		[children, open, id, close, size, transitionState, handleClickOutside],
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
