import {
	cloneElement,
	ComponentProps,
	MouseEventHandler,
	ReactEventHandler,
	ReactNode,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button";
import MarkXIcon from "@heroicons/react/24/solid/XMarkIcon";
import clsx from "clsx";

const SIZES = {
	lg: "*:max-w-5xl",
	md: "*:max-w-3xl",
	sm: "*:max-w-1xl",
};

export type ModalProps = {
	disclosure?: JSX.Element;
	children: ((props: { close: () => void }) => JSX.Element) | ReactNode;
	withoutPortal?: boolean;
	hideOnClickOutside?: boolean;
	open?: boolean;
	onClose?: () => void;
	size?: keyof typeof SIZES;
};

type ModalTitleProps = ComponentProps<"h2">;

const Modal = ({
	disclosure,
	children,
	withoutPortal,
	hideOnClickOutside,
	open: openProp,
	onClose,
	size = "md",
}: ModalProps) => {
	const [open, setOpen] = useState(openProp && onClose ? openProp : false);
	const [displayContent, setDisplayContent] = useState(open);
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
			})
		: undefined;

	const close = () => {
		if (onClose) {
			onClose();
		} else {
			setOpen(false);
		}
	};
	const handleClickOutside: MouseEventHandler<HTMLButtonElement> = (event) => {
		event.stopPropagation();
		if (hideOnClickOutside) {
			close();
		}
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
					setDisplayContent(true);
					displayContentTimeout = setTimeout(() => {
						dialogRef.current?.showModal();
					});
				} else {
					displayContentTimeout = setTimeout(() => {
						setDisplayContent(false);
					}, 300);
					dialogRef.current.close();
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
				onClick={(e) => {
					e.stopPropagation();
				}}
				onClose={handleCloseDialog}
				ref={dialogRef}
				className={clsx(
					"modal modal-bottom sm:modal-middle sm:*:w-11/12",
					size && SIZES[size] ? SIZES[size] : SIZES["md"],
				)}
			>
				{displayContent ? (
					<div className="modal-box w-full ">
						<Button
							onClick={close}
							size="sm"
							variant="ghost"
							className="absolute right-2 top-2"
							type="button"
						>
							<MarkXIcon className="w-4" />
						</Button>
						{typeof children === "function" ? children({ close }) : children}
						<div className="modal-backdrop">
							<button onClick={handleClickOutside}>close</button>
						</div>
					</div>
				) : null}
			</dialog>
		),
		[open, children, close],
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
	return <div className="modal-action">{children}</div>;
};

const ModalTitle = ({ children, className, ...props }: ModalTitleProps) => (
	<h2 className={clsx("text-lg font-bold", className)} {...props}>
		{children}
	</h2>
);

Modal.Actions = ModalActions;
Modal.Title = ModalTitle;

export default Modal;
