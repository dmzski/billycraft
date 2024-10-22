import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import { Badge } from "../Badge";
import {
	AriaAttributes,
	ChangeEventHandler,
	FocusEventHandler,
	KeyboardEventHandler,
	ReactNode,
	Ref,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";

type RenderSelectedProps = {
	array: string[];
	onDelete: (index: number) => () => void;
};
export type TextArrayInputProps = AriaAttributes & {
	onInputChange?: ChangeEventHandler<HTMLInputElement>;
	onChange?: (strings: string[]) => void;
	onFocus?: FocusEventHandler<HTMLInputElement>;
	onBlur?: FocusEventHandler<HTMLInputElement>;
	onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
	onKeyPress?: KeyboardEventHandler<HTMLInputElement>;
	onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
	value?: string[];
	className?: string;
	placeholder?: string;
	ref?: Ref<HTMLInputElement>;
	renderSelected?: (props: RenderSelectedProps) => ReactNode;
	disabled?: boolean;
};

const defaultRender = ({ array, onDelete }: RenderSelectedProps) =>
	array?.map((string, index) => (
		<Badge key={index} variant="outline">
			<p className="flex gap-1 items-center">
				<span>{string}</span>
				<XMarkIcon onClick={onDelete(index)} className="w-4 cursor-pointer" />
			</p>
		</Badge>
	));

const TextArrayInput = ({
	disabled,
	onInputChange,
	onKeyDown,
	onChange,
	value,
	placeholder,
	ref,
	renderSelected = defaultRender,
	...props
}: TextArrayInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
	const [inputValue, setInputValue] = useState("");
	const [array, setArray] = useState(value ?? []);

	const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		onInputChange?.(event);
		if (!event.defaultPrevented) setInputValue(event.target.value);
	};

	const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
		onKeyDown?.(event);
		if (event.key === "Enter" && !event.defaultPrevented && inputValue.length) {
			const tmp = [...array];
			tmp.push(inputValue);
			onChange?.(tmp);
			setArray(tmp);
			setInputValue("");
		}
		if (
			event.key === "Backspace" &&
			!event.defaultPrevented &&
			inputValue.length === 0
		) {
			const tmp = [...array];
			tmp.pop();
			onChange?.(tmp);
			setArray(tmp);
		}
	};

	const handleDelete = (index: number) => () => {
		const tmp = [...array];
		tmp.splice(index, 1);
		onChange?.(tmp);
		setArray(tmp);
	};

	useEffect(() => {
		value && setArray(value);
	}, [value]);

	return (
		<div
			className={`flex w-full border focus-within:border-primary gap-2 p-2 rounded outline-none focus-within:ring-2 ring-primary text-black ${
				disabled ? "opacity-50 pointer-event-none" : ""
			}`}
		>
			<div className="flex gap-1">
				{renderSelected({ array, onDelete: handleDelete })}
			</div>
			<input
				{...props}
				type="text"
				className="flex-grow focus:outline-none"
				placeholder={placeholder ?? "Type some Text..."}
				ref={inputRef}
				value={inputValue}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
			/>
		</div>
	);
};

export default TextArrayInput;
