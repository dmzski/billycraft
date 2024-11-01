import {
	forwardRef,
	useMemo,
	useState,
	useCallback,
	InputHTMLAttributes,
	KeyboardEventHandler,
	useRef,
	useImperativeHandle,
	useId,
	ReactNode,
	MouseEventHandler,
} from "react";
import OptionList from "./OptionList";
import useClickOutsideHandler from "hooks/useClickOutsideHandler";
import { VariantProps, cva } from "class-variance-authority";
import { Label } from "components/Label";
import { tw } from "lib/utils";
import {
	ChevronDownIcon,
	ChevronUpIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { Button } from "components/Button";

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
export type SelectProps = Pick<
	InputHTMLAttributes<HTMLInputElement>,
	| "autoFocus"
	| "placeholder"
	| "readOnly"
	| "disabled"
	| "required"
	| "className"
	| "id"
	| "aria-label"
	| "name"
> & {
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
			autoFocus,
			placeholderSearchText = "Search",
			variant,
		},
		ref,
	) => {
		const clearable = !required;
		const generatedId = useId();
		const id = idProp ?? generatedId;
		const [isOpen, setOpen] = useState(false);
		const containerRef = useRef<HTMLDivElement>(null);
		const inputRef = useRef<HTMLDivElement>(null);

		useImperativeHandle(ref, () => inputRef.current as HTMLDivElement);

		useClickOutsideHandler(containerRef, () => {
			setOpen(false);
			onBlur?.();
		});

		const handleOpen = useCallback(() => {
			if (!disabled) {
				setOpen(true);
			}
		}, [disabled]);

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
				inputRef.current?.focus();
				setOpen(false);
			},
			[onChange],
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
				} else {
					if (KEYS.Escape === event.key) {
						setOpen(false);
					}
				}
			},
			[isOpen, handleOpen, setOpen],
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
					.map((valueNode, index) => (
						<span
							key={index}
							className="bg-background border px-2 text-foreground border rounded-md"
						>
							{valueNode}
						</span>
					));
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
				onKeyDown={handleKeyDown}
				onClick={handleOpen}
				aria-invalid={!!error}
				className={tw("grid group gap-1 w-full h-max", className)}
			>
				{label ? <Label htmlFor={id}>{label}</Label> : null}
				<div className="relative flex-nowrap">
					<div
						id={id}
						data-invalid={!!error}
						className={selectVariants({ variant })}
						aria-expanded={isOpen}
						role="combobox"
						aria-haspopup="listbox"
						onFocus={handleOpen}
						onClick={handleOpen}
						defaultValue={value?.toString() ?? ""}
						aria-disabled={disabled || readOnly}
						aria-label={ariaLabel ?? name}
						autoFocus={autoFocus}
						ref={inputRef}
					>
						<div className="flex gap-2 flex-row flex-nowrap truncate">
							{valueRender}
						</div>
						<div className="flex items-center gap-2">
							{required ? <span className="text-destructive">*</span> : null}
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
