import { SelectOptionType, SelectValueType } from ".";
import Option from "./Option";
import {
	ChangeEventHandler,
	KeyboardEventHandler,
	RefObject,
	useMemo,
	useRef,
	useState,
} from "react";
import { Input } from "components/Input";
import { createPortal } from "react-dom";

const listContainerClasses =
	"max-h-56 flex flex-col flex-nowrap overflow-x-none absolute overflow-y-auto shadow-md border bg-popover text-popover-foreground rounded-md w-full z-50 min-w-max";

const KEYS = {
	ArrowDown: "ArrowDown",
	ArrowUp: "ArrowUp",
	Tab: "Tab",
	Escape: "Escape",
	Enter: "Enter",
};

type OptionListProps = {
	options: SelectOptionType[];
	onOptionClick: (option: SelectOptionType) => void;
	value?: SelectValueType;
	isMulti?: boolean;
	isSearchable?: boolean;
	placeholderSearchText?: string;
	containerRef: RefObject<HTMLElement>;
};

const filterOptions = ({
	options,
	search,
}: { options: SelectOptionType[]; search: string }) =>
	search.length > 0
		? options.filter((option) => {
				if (option.searchText) {
					return option.searchText.toLowerCase().includes(search.toLowerCase());
				}
				if (typeof option.label === "string") {
					return option.label.toLowerCase().includes(search.toLowerCase());
				}
				return true;
			})
		: options;

const OptionList = ({
	options,
	onOptionClick,
	value,
	isMulti,
	isSearchable,
	placeholderSearchText,
	containerRef,
}: OptionListProps) => {
	const listboxRef = useRef<HTMLDivElement>(null);
	const [search, setSearch] = useState("");

	const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		setSearch(event.target.value);
	};

	const filteredOptions = useMemo(
		() => filterOptions({ options, search }),
		[options, search],
	);

	const handleKeyDown: KeyboardEventHandler = (event) => {
		if (event.key === KEYS.ArrowDown || event.key === KEYS.ArrowUp) {
			event.preventDefault();
			if (listboxRef.current && Object.values(KEYS).includes(event.key)) {
				const activeElement = document.activeElement;
				const focusables = listboxRef.current.querySelectorAll<HTMLElement>(
					"button:not(disabled), input:not(disabled)",
				);
				if (event.key === KEYS.ArrowDown) {
					if (activeElement && listboxRef.current.contains(activeElement)) {
						const index = [...focusables].findIndex(
							(aButton) => aButton === activeElement,
						);
						focusables[index + 1]?.focus();
					} else {
						focusables[0]?.focus();
					}
				}
				if (event.key === KEYS.ArrowUp) {
					if (activeElement && listboxRef.current.contains(activeElement)) {
						const index = [...focusables].findIndex(
							(aButton) => aButton === activeElement,
						);
						focusables[index - 1]?.focus();
					} else {
						focusables[0]?.focus();
					}
				}
			}
		}
	};

	const handleInputKeyUp: KeyboardEventHandler = (event) => {
		if ([KEYS.Enter].includes(event.key)) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	const rect = containerRef.current?.getBoundingClientRect();
	const scrollTop =
		(window.scrollY || document.body.scrollTop) - document.body.clientTop;

	const styles = rect
		? {
				width: rect.width,
				left: rect.left,
				top: rect.bottom + scrollTop,
			}
		: {
				width: 0,
				left: -9999,
				top: -9999,
			};

	return createPortal(
		<div
			onKeyUp={handleInputKeyUp}
			onKeyDown={handleKeyDown}
			onClick={(e) => {
				e.stopPropagation();
			}}
			className={listContainerClasses}
			role="listbox"
			ref={listboxRef}
			style={styles}
		>
			{isSearchable ? (
				<li className="px-2 py-2 border-b">
					<Input
						placeholder={placeholderSearchText}
						autoComplete="off"
						autoFocus
						value={search}
						onChange={handleSearchChange}
						suffix={
							<div className="px-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 16 16"
									fill="currentColor"
									className="size-4 text-muted-foreground"
								>
									<path
										fillRule="evenodd"
										d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						}
					/>
				</li>
			) : null}
			{filteredOptions.map((option: SelectOptionType, index) => (
				<Option
					autoFocus={index === 0 && !isSearchable}
					key={option.value}
					isMulti={isMulti}
					option={option}
					onOptionClick={onOptionClick}
					value={value}
				/>
			))}
		</div>,
		document.body,
	);
};

export default OptionList;
