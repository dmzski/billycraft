import {
	ChevronDownIcon,
	ChevronUpIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { type VariantProps, cva } from "class-variance-authority";
import { Button } from "components/Button";
import { Label } from "components/Label";
import { tw } from "lib/utils";
import {
	type KeyboardEventHandler,
	type MouseEventHandler,
	type ReactNode,
	forwardRef,
	useCallback,
	useId,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import OptionList from "./OptionList";

const selectVariants = cva(
	"flex justify-between h-10 w-full items-center bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 group-focus-within:ring-2 group-focus-within:ring-ring group-focus-within:ring-offset-2 data-[invalid=true]:border-destructive group-focus-within:data-[invalid=true]:ring-destructive",
	{
		variants: {
			variant: {
				default: "rounded-md border border-input",
				ghost: "border-none rounded-md hover:bg-accent transition-colors",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export type OptionValue = string | number;
export type SelectOptionType = {
	value: OptionValue;
	label: ReactNode;
	render?: ReactNode;
	searchText?: string;
};

export type SelectValueType =
	| OptionValue
	| Array<OptionValue>
	| undefined
	| null;

export type SelectProps = {
	autoFocus?: boolean;
	disabled?: boolean;
	placeholder?: string;
	className?: string;
	required?: boolean;
	id?: string;
	"aria-label"?: string;
	name?: string;
	options: SelectOptionType[];
	label?: string;
	onChange?: (result: SelectValueType) => unknown;
	onBlur?: () => void;
	value: SelectValueType;
	readOnly?: boolean;
	isSearchable?: boolean;
	isMulti?: boolean;
	error?: boolean | string;
	placeholderSearchText?: string;
} & VariantProps<typeof selectVariants>;

const KEYS = {
	ArrowDown: "ArrowDown",
	ArrowUp: "ArrowUp",
	Tab: "Tab",
	Escape: "Escape",
	Enter: "Enter",
};

export const Select = forwardRef<HTMLDivElement, SelectProps>(
	(
		{
			"aria-label": ariaLabel = "Select",
			readOnly,
			className,
			id: idProp,
			name,
			options = [],
			placeholder = "Select",
			onChange,
			onBlur,
			isMulti,
			value = isMulti ? [] : undefined,
			disabled,
			label,
			isSearchable,
			error,
			required,
			placeholderSearchText = "Search",
			variant,
		},
		ref,
	) => {
		const clearable = !required;
		const optionListId = useId();
		const generatedId = useId();
		const id = idProp ?? generatedId;
		const [isOpen, setOpen] = useState(false);
		const containerRef = useRef<HTMLDivElement>(null);
		const inputRef = useRef<HTMLDivElement>(null);

		useImperativeHandle(ref, () => inputRef.current as HTMLDivElement);

		const handleOpen = useCallback(() => {
			if (!disabled && !readOnly) {
				setOpen(() => true);
			}
		}, [disabled, readOnly]);

		const handleClose = useCallback((restoreFocus?: boolean) => {
			if (restoreFocus) {
				inputRef.current?.focus();
			}
			setOpen(() => false);
		}, []);

		// Click an option change the value only
		const handleClickForMulti = useCallback(
			(option: SelectOptionType) => {
				if (!value || !Array.isArray(value)) {
					onChange?.([option.value]);
					return;
				}
				const index = value.findIndex((v) => v === option.value);

				// Handle if we click on an option which is already in value
				if (index > -1) {
					const tmp = [...value];
					tmp.splice(index, 1);
					onChange?.([...tmp]);
				} else {
					onChange?.([...value, option.value]);
				}
			},
			[onChange, value],
		);

		// Click an option change search and value then close the options
		const handleClickForSingle = useCallback(
			(option: SelectOptionType) => {
				onChange?.(option.value);
				handleClose(true);
			},
			[onChange, handleClose],
		);

		const handleClear: MouseEventHandler = useCallback(
			(event) => {
				event.stopPropagation();
				if (isMulti) {
					onChange?.([]);
				} else {
					onChange?.(null);
				}
			},
			[onChange, isMulti],
		);

		const handleKeyDown: KeyboardEventHandler = useCallback(
			(event) => {
				if (!isOpen) {
					if (event.key === KEYS.ArrowDown) {
						event.preventDefault();
						handleOpen();
					}
				}
			},
			[isOpen, handleOpen],
		);

		const valueRender = useMemo(() => {
			if (!value || (Array.isArray(value) && value.length === 0)) {
				return <span className="text-muted-foreground">{placeholder}</span>;
			}
			if (Array.isArray(value)) {
				return value
					.map((aValue) => {
						const optionFound = options.find(
							({ value: optionValue }) => optionValue === aValue,
						);

						return optionFound?.render ?? optionFound?.label;
					})
					.filter(Boolean)
					.map((valueNode) => {
						const id = useId();

						return (
							<span
								key={id}
								className="bg-background border px-2 text-foreground border rounded-md"
							>
								{valueNode}
							</span>
						);
					});
			}
			const optionFound = options.find((option) => value === option.value);

			return optionFound?.render ?? optionFound?.label;
		}, [options, value, placeholder]);

		const displayClearable =
			clearable &&
			((value !== undefined &&
				value !== null &&
				typeof value === "string" &&
				value !== "") ||
				(typeof value === "number" && value !== null && value !== undefined) ||
				(Array.isArray(value) && value.length > 0));

		return (
			<div
				aria-disabled={disabled}
				ref={containerRef}
				aria-invalid={!!error}
				className={tw("grid group gap-1 w-full h-max", className)}
			>
				{label ? (
					<Label htmlFor={id}>
						{label}
						{required ? <span>*</span> : null}
					</Label>
				) : null}
				<div className="relative flex-nowrap">
					<div
						tabIndex={0}
						onKeyDown={handleKeyDown}
						id={id}
						data-invalid={!!error}
						className={selectVariants({ variant })}
						aria-expanded={isOpen}
						aria-controls={optionListId}
						// biome-ignore lint/a11y/useSemanticElements: Cant use select
						role="combobox"
						aria-haspopup="listbox"
						onClick={handleOpen}
						onBlur={onBlur}
						defaultValue={value?.toString() ?? ""}
						aria-disabled={disabled || readOnly}
						aria-label={ariaLabel ?? name}
						ref={inputRef}
					>
						<span className="flex gap-2 flex-row flex-nowrap truncate">
							{valueRender}
						</span>
						<div className="flex items-center gap-2">
							{required && !label ? <span>*</span> : null}
							{displayClearable ? (
								<Button
									variant="ghost"
									size="icon"
									className="size-8"
									onClick={handleClear}
									aria-label="clear"
								>
									<XMarkIcon className="size-4" />
								</Button>
							) : null}
							{isOpen ? (
								<ChevronUpIcon className="size-4" />
							) : (
								<ChevronDownIcon className="size-4" />
							)}
						</div>
					</div>
					{options?.length > 0 && isOpen ? (
						<OptionList
							id={optionListId}
							close={handleClose}
							placeholderSearchText={placeholderSearchText}
							isMulti={isMulti}
							options={options}
							value={value}
							isSearchable={isSearchable}
							containerRef={containerRef}
							onOptionClick={(option: SelectOptionType) => {
								isMulti
									? handleClickForMulti(option)
									: handleClickForSingle(option);
							}}
						/>
					) : null}
				</div>
			</div>
		);
	},
);

Select.displayName = "Select";
