import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import clsx from "clsx";
import { tw } from "lib/utils";
import {
	type FocusEventHandler,
	forwardRef,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import useClickOutsideHandler from "../../hooks/useClickOutsideHandler";
import { Input } from "../Input";
import MonthCalendar from "./MonthCalendar";

export type DatePickerProps = {
	name?: string;
	value?: Date;
	onChange?: (newValue: Date) => void;
	onBlur?: FocusEventHandler<HTMLInputElement>;
	className?: string;
	label?: string;
	disabled?: boolean;
	error?: boolean;
	required?: boolean;
};

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
	(
		{
			name,
			value,
			onChange,
			onBlur,
			label,
			className,
			disabled,
			error,
			required,
		},
		ref,
	) => {
		if (value && !(value instanceof Date && !Number.isNaN(value))) {
			throw new Error(
				"DatePicker : value should be a Date instance or undefined",
			);
		}
		const [inputValue, setInputValue] = useState(value?.toLocaleDateString());
		const [open, setOpen] = useState(false);
		const containerRef = useRef<HTMLDivElement>(null);

		useClickOutsideHandler(containerRef, () => {
			setOpen(false);
		});

		useEffect(() => {
			if (value) {
				if (!(value instanceof Date && !Number.isNaN(value))) {
					throw new Error(
						"DatePicker : value should be a Date instance or undefined",
					);
				}
				setInputValue(value.toLocaleDateString());
			}
		}, [value]);

		const handleFocus = useCallback(() => {
			if (!disabled) setOpen(true);
		}, [disabled]);

		const handleDateClick = useCallback(
			(newDate: Date) => {
				onChange?.(newDate);
				setOpen(false);
			},
			[onChange],
		);

		const containerClassNames = useMemo(
			() =>
				clsx({
					["absolute text-foreground top-full shadow-lg rounded-md overflow-hidden z-100 bg-background"]: true,
					["sr-only"]: !open,
				}),
			[open],
		);

		const iconClassNames = useMemo(
			() =>
				tw("absolute size-5 right-2 mb-3 text-muted-foreground", {
					"text-destructive": error,
					"bottom-0": label,
				}),
			[error, label, open],
		);

		return (
			<div ref={containerRef} className="relative">
				<Input
					className={className}
					label={label}
					onFocus={handleFocus}
					onBlur={onBlur}
					name={name}
					value={inputValue}
					ref={ref}
					disabled={disabled}
					error={error}
					required={required}
				/>
				{!disabled ? (
					<>
						<CalendarIcon className={iconClassNames} />
						<div className={containerClassNames}>
							<MonthCalendar selected={value} onDateClick={handleDateClick} />
						</div>
					</>
				) : null}
			</div>
		);
	},
);

DatePicker.displayName = "DatePicker";
