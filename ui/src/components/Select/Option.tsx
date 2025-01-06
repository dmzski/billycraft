import { CheckIcon } from "@heroicons/react/24/solid";
import { tw } from "lib/utils";
import {
	KeyboardEventHandler,
	MouseEventHandler,
	useMemo,
	useRef,
} from "react";
import { SelectOptionType, SelectValueType } from ".";

export type RenderSelectOptionProps = {
	option: SelectOptionType;
	isSelected?: boolean;
};

type OptionProps = {
	isMulti?: boolean;
	value?: SelectValueType;
	option: SelectOptionType;
	onOptionClick: (option: SelectOptionType) => void;
	autoFocus?: boolean;
};

const Option = ({
	autoFocus,
	isMulti,
	value,
	option,
	onOptionClick,
}: OptionProps) => {
	const isSelected = useMemo(() => {
		return isMulti && Array.isArray(value)
			? value.includes(option.value)
			: option.value === value;
	}, [value, option, isMulti]);

	const optionRef = useRef<HTMLButtonElement>(null);

	const handleSelectOptionClick: MouseEventHandler<HTMLButtonElement> = (
		event,
	) => {
		event.preventDefault();
		onOptionClick(option);
	};
	const handleSelectOptionEnter: KeyboardEventHandler<HTMLButtonElement> = (
		event,
	) => {
		if (event.key === "Enter") {
			event.preventDefault();
			onOptionClick(option);
		}
	};

	return (
		<button
			role="option"
			type="button"
			autoFocus={autoFocus}
			aria-selected={isSelected}
			ref={optionRef}
			className={tw(
				"flex gap-2 items-center flex-row p-2 outline-none transition-colors",
				"hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
				"aria-[selected=false]:pl-8",
			)}
			onClick={handleSelectOptionClick}
			onKeyUp={handleSelectOptionEnter}
		>
			{isSelected ? <CheckIcon className="size-4" /> : null}
			{option.label}
		</button>
	);
};

export default Option;
