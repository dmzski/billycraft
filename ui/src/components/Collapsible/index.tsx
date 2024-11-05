import {
	ReactNode,
	cloneElement,
	forwardRef,
	isValidElement,
	useEffect,
	useId,
	useImperativeHandle,
	useRef,
	useState,
} from "react";

type CollapsibleProps = {
	disclosure: ReactNode;
	children: ReactNode | ((params: { close: () => void }) => ReactNode);
	open?: boolean;
	onOpenChange?: (newState: boolean) => void;
};
export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(
	({ open: openProp, onOpenChange, disclosure, children }, ref) => {
		const id = useId();
		const [open, setOpen] = useState(
			openProp && onOpenChange ? openProp : false,
		);
		const disclosureRef = useRef<HTMLElement>(null);
		const containerRef = useRef<HTMLDivElement>(null);
		useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

		useEffect(() => {
			if (openProp === undefined && !onOpenChange) {
				const handleClick = () => {
					setOpen((current) => !current);
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

			if (openProp !== undefined && openProp !== open) {
				setOpen(!!openProp);
			}
		}, [disclosureRef, openProp, onOpenChange]);

		const Component =
			disclosure && isValidElement(disclosure)
				? cloneElement(disclosure, {
						ref: disclosureRef,
						"aria-controls": id,
					} as any)
				: undefined;

		const close = () => {
			if (onOpenChange) {
				onOpenChange(false);
			} else {
				setOpen(false);
			}
		};

		return (
			<>
				{Component}
				<div
					id={id}
					ref={containerRef}
					aria-expanded={open ? "true" : "false"}
					className="w-full relative grid grid-rows-[0fr] duration-250 transition-[grid-template-rows] aria-[expanded=true]:grid-rows-[1fr] [&>div]:overflow-hidden"
				>
					<div className="grid">
						{typeof children === "function" ? children({ close }) : children}
					</div>
				</div>
			</>
		);
	},
);
