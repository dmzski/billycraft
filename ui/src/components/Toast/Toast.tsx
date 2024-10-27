import { ReactNode, SyntheticEvent, useEffect, useRef, useState } from "react";
import { VariantProps, cva } from "class-variance-authority";

const progressBarVariants = cva("absolute bottom-0 left-0 w-0 h-1 opacity-40", {
	variants: {
		variant: {
			destructive: "bg-destructive-foreground",
			default: "bg-foreground",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});
const toastVariants = cva(
	"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full overflow-hidden cursor-pointer relative w-full rounded-md border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
	{
		variants: {
			variant: {
				default: "bg-background text-foreground",
				destructive:
					"bg-destructive text-destructive-foreground border-destructive [&>svg]:text-destructive",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const ANIMATION_DURATION = 150;
export type ToastProps = {
	onClose: (index: number) => void;
	duration: number;
	children?: ReactNode;
	id: number;
} & VariantProps<typeof toastVariants>;

const Toast = ({ onClose, duration, children, variant, id }: ToastProps) => {
	const [mounted, setMounted] = useState<
		"opening" | "opened" | "closing" | "closed"
	>("opening");
	const onCloseRef = useRef(onClose);
	const handleClose = (_event?: SyntheticEvent, reason?: string) => {
		if (reason === "clickaway") {
			return;
		}
		setMounted("closing");
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			setMounted("closing");
		}, duration - ANIMATION_DURATION);

		return () => {
			clearTimeout(timeout);
		};
	}, [duration]);

	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout>;
		if (mounted === "closing") {
			timeout = setTimeout(() => {
				setMounted("closed");
				onCloseRef.current(id);
			}, ANIMATION_DURATION);
		}
		if (mounted === "opening") {
			timeout = setTimeout(() => {
				setMounted("opened");
			}, ANIMATION_DURATION);
		}

		return () => {
			if (timeout) {
				clearTimeout(timeout);
			}
		};
	}, [mounted]);

	if (mounted === "closed") {
		return null;
	}

	return (
		<div
			className={toastVariants({ variant })}
			onClick={handleClose}
			data-state={mounted.includes("open") ? "open" : "closed"}
		>
			{children}
			<div
				className={progressBarVariants({ variant })}
				style={{
					animation: `toast-progress-bar ${Math.round(duration) - (1000 - ANIMATION_DURATION)}ms linear`,
				}}
			/>
		</div>
	);
};

export default Toast;
