import {
  ForwardedRef,
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
} from 'react'
import OptionList from './OptionList'
import clsx from 'clsx'
import useClickOutsideHandler from 'hooks/useClickOutsideHandler'

const errorClasses = 'select-error'
const disabledClasses = 'select-disabled'
const inputClasses =
  'select inline-flex items-center min-w-0'

type Variants = "no-border" | "ghost" | "default"
const variants: Record<Variants, string> = {
  "no-border": "",
  ghost: "select-ghost focus-within:select-primary",
  default: "select-bordered focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary focus-within:select-primary"
}

export type OptionValue = string | number
export type SelectOptionType = {
  value: OptionValue
  label: ReactNode
  render?: ReactNode
  searchText?: string
}

export type ValueType = OptionValue | Array<OptionValue> | undefined
export type SelectProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'autoFocus'
  | 'placeholder'
  | 'readOnly'
  | 'disabled'
  | 'required'
  | 'className'
  | 'id'
  | 'aria-label'
  | 'name'
> & {
  options: SelectOptionType[]
  label?: string
  onChange?: (result: ValueType) => unknown
  value: ValueType
  readOnly?: boolean
  isSearchable?: boolean
  isMulti?: boolean
  error?: boolean | string
  variant?: Variants
}

const KEYS = {
  ArrowDown: 'ArrowDown',
  ArrowUp: 'ArrowUp',
  Tab: 'Tab',
  Escape: 'Escape',
  Enter: 'Enter',
}


const Select = (
  {
    'aria-label': ariaLabel,
    readOnly,
    className,
    id: idProp,
    name,
    options = [],
    placeholder,
    onChange,
    isMulti,
    value = isMulti ? [] : undefined,
    disabled,
    label,
    isSearchable,
    error,
    required,
    autoFocus,
    variant = "default"
  }: SelectProps,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const [isOpen, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

  useClickOutsideHandler(containerRef, () => {
    setOpen(false)
  })

  const handleOpen = useCallback(() => {
    if (!disabled) {
      setOpen(true)
    }
  }, [disabled])

  // Click an option change the value only
  const handleClickForMulti = useCallback(
    (option: SelectOptionType) => {
      if (!value || !Array.isArray(value)) {
        onChange?.([option.value])
        return
      }
      const index = value.findIndex(v => v === option.value)

      // Handle if we click on an option which is already in value
      if (index > -1) {
        const tmp = [...value]
        tmp.splice(index, 1)
        onChange?.([...tmp])
      } else {
        onChange?.([...value, option.value])
      }
    },
    [onChange, value],
  )

  // Click an option change search and value then close the options
  const handleClickForSingle = useCallback(
    (option: SelectOptionType) => {
      onChange?.(option.value)
      inputRef.current?.focus()
      setOpen(false)
    },
    [onChange],
  )

  const handleKeyDown: KeyboardEventHandler = useCallback(
    event => {
      if (!isOpen) {
        if (event.key === KEYS.ArrowDown) {
          event.preventDefault()
          handleOpen()
        }
      } else {
        if (
          KEYS.Escape === event.key
        ) {
          setOpen(false)
        }
      }
    },
    [isOpen, handleOpen, setOpen],
  )

  const inputClassName = clsx(inputClasses, 'relative', variants[variant] ?? variants.default, {
    [errorClasses]: error,
    [disabledClasses]: disabled,
  })

  const valueRender = useMemo(() => {
    if (!value) {
      return placeholder
    }
    if (Array.isArray(value)) {
      return value
        .map(aValue => {
          const optionFound = options.find(({ value: optionValue }) => optionValue === aValue)

          return optionFound?.render ?? optionFound?.label
        })
        .filter(Boolean)
        .map((valueNode, index) => (
          <span
            key={index}
            className="bg-transparent border px-2 text-primary border-primary rounded"
          >
            {valueNode}
          </span>
        ))
    }
    const optionFound = options.find(option => value === option.value)

    return optionFound?.render ?? optionFound?.label
  }, [options, value])

  return (
    <div
      aria-expanded={isOpen}
      aria-disabled={disabled}
      ref={containerRef}
      onKeyDown={handleKeyDown}
      onClick={handleOpen}
      aria-invalid={required && !value}
      className={clsx("form-control", className)}
    >
      {label ? (
        <label htmlFor={id} className="label py-1">
          <span className="label-text">{label}</span>
        </label>
      ) : null}
      <div
        className={clsx(inputClassName, "relative flex-nowrap")}
      >
        <span className="flex-grow inline-flex gap-2 truncate">
          {valueRender}
        </span>
        <input
          aria-haspopup="listbox"
          autoFocus={autoFocus}
          id={id}
          className={clsx('sr-only')}
          tabIndex={-1}
          name={name}
          disabled={disabled || readOnly}
          aria-label={ariaLabel}
          ref={inputRef}
          onFocus={handleOpen}
          onClick={handleOpen}
          defaultValue={value?.toString() ?? ""}
        />
        {options?.length > 0 && isOpen ? (
          <OptionList
            isMulti={isMulti}
            options={options}
            value={value}
            isSearchable={isSearchable}
            onOptionClick={(option: SelectOptionType) => {
              isMulti ? handleClickForMulti(option) : handleClickForSingle(option)
            }}
          />
        ) : null}
      </div>
    </div>
  )
}

export default forwardRef(Select)
