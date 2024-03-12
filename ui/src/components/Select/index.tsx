import {
  ForwardedRef,
  forwardRef,
  MouseEvent,
  useMemo,
  useState,
  useCallback,
  InputHTMLAttributes,
  KeyboardEventHandler,
  ChangeEventHandler,
  useRef,
  useImperativeHandle,
} from 'react'
import OptionList from './OptionList'
import clsx from 'clsx'
import useClickOutsideHandler from 'hooks/useClickOutsideHandler'

const errorClasses = 'select-error'
const disabledClasses = 'select-disabled'
const inputClasses = 'select select-bordered focus:select-primary'

export type OptionValue = string | number
export type SelectOptionType = {
  value: OptionValue
  label: string
}

export type ValueType = OptionValue | Array<OptionValue> | undefined
export type SelectProps = Pick<InputHTMLAttributes<HTMLInputElement>, "placeholder" | "readOnly" | "disabled" | "required" | "className" | "id" | "aria-label" | "tabIndex" | "name" | "autoComplete"> & {
  options: SelectOptionType[]
  label?: string
  onChange?: (result: ValueType) => unknown
  value: ValueType
  readOnly?: boolean
  isSearchable?: boolean
  isMulti?: boolean
  error?: boolean | string
}

const KEYS = {
  ArrowDown: 'ArrowDown',
  ArrowUp: 'ArrowUp',
  Tab: 'Tab',
  Escape: 'Escape',
  Enter: 'Enter',
}

const filterOptions = ({
  options,
  search,
}: {
  options: SelectOptionType[]
  search: string
}) =>
  options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

const Select = (
  {
    'aria-label': ariaLabel,
    readOnly,
    autoComplete,
    className,
    id,
    name,
    options = [],
    placeholder,
    onChange,
    isMulti,
    value = isMulti ? [] : undefined,
    disabled,
    label,
    tabIndex,
    isSearchable,
    error,
    required,
  }: SelectProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const [isOpen, setOpen] = useState(false)
  const [search, setSearch] = useState<string>('')
  const [focused, setFocused] = useState<OptionValue>(options[0]?.value)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

  useClickOutsideHandler(containerRef, () => {
    setSearch('')
    setOpen(false)
  })

  const filteredOptions = useMemo(
    () => (search.length === 0 ? options : filterOptions({ options, search })),
    [isSearchable, options, search, filterOptions]
  )

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
      const index = value.findIndex((v) => v === option.value)

      // Handle if we click on an option which is already in value
      if (index > -1) {
        const tmp = [...value]
        tmp.splice(index, 1)
        onChange?.([...tmp])
      } else {
        onChange?.([...value, option.value])
      }
      setSearch('')
    },
    [onChange, value]
  )

  // Click an option change search and value then close the options
  const handleClickForSingle = useCallback(
    (option: SelectOptionType) => {
      onChange?.(option.value)
      setSearch('')
      inputRef.current?.focus()
      setOpen(false)
    },
    [onChange]
  )

  const handleKeyDown: KeyboardEventHandler = useCallback(
    (event) => {
      if (!isOpen) {
        if (event.key === KEYS.ArrowDown) handleOpen()
      } else if (
        [
          KEYS.ArrowDown,
          KEYS.ArrowUp,
          KEYS.Enter,
          KEYS.Tab,
          KEYS.Escape,
        ].includes(event.key)
      ) {
        event.stopPropagation()
        event.preventDefault()
        switch (event.key) {
          case KEYS.Tab:
          case KEYS.Escape:
            setOpen(false)
            break
          case KEYS.ArrowUp:
            {
              const index = filteredOptions.findIndex(
                (option) => option.value === focused
              )
              setFocused(
                (current) => filteredOptions[index - 1]?.value ?? current
              )
            }
            break
          case KEYS.ArrowDown:
            if (!isOpen) {
              handleOpen()
              setFocused(filteredOptions[0].value)
            } else {
              const index = filteredOptions.findIndex(
                (option) => option.value === focused
              )
              setFocused(
                (current: string | number) =>
                  filteredOptions[index + 1]?.value ?? current
              )
            }
            break
          case KEYS.Enter: {
            const optionSelected = filteredOptions.find(
              (option) => option.value === focused
            )
            if (optionSelected) {
              isMulti
                ? handleClickForMulti(optionSelected)
                : handleClickForSingle(optionSelected)
            }
            break
          }
        }
      }
    },
    [
      isOpen,
      filteredOptions,
      handleClickForMulti,
      handleClickForMulti,
      focused,
      handleOpen,
    ]
  )

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setSearch(event.currentTarget.value ?? '')
      handleOpen()
    },
    [handleOpen]
  )

  const handleInputKeyUp: KeyboardEventHandler = useCallback((event) => {
    if ([KEYS.Enter].includes(event.key)) {
      event.preventDefault()
      event.stopPropagation()
    }
  }, [])

  const inputClassName = clsx(inputClasses, {
    [errorClasses]: error,
    [disabledClasses]: disabled,
  })

  const valueRender = useMemo(
    () =>
      Array.isArray(value)
        ? options
          .filter((option) => value.includes(option.value))
          .map((option) => option.label)
          .join(', ')
        : options.find((option) => value === option.value)?.label,
    [options, value]
  )

  return (
    <div
      className={clsx('dropdown', className)}
      aria-expanded={isOpen}
      aria-disabled={disabled}
      ref={containerRef}
    >
      <div
        className="form-control"
        aria-invalid={required && !value}
        onKeyDown={handleKeyDown}
      >
        {label ? (
          <label htmlFor={id} className="label">
            <span className="label-text">{label}</span>
          </label>
        ) : null}
        <input
          onFocus={handleOpen}
          onClick={handleOpen}
          name={name}
          role="combobox"
          className={inputClassName}
          disabled={disabled}
          onKeyUp={handleInputKeyUp}
          onChange={handleInputChange}
          readOnly={readOnly || !isSearchable}
          aria-label={ariaLabel}
          placeholder={placeholder ?? 'Select...'}
          type="text"
          id={id}
          tabIndex={tabIndex}
          ref={inputRef}
          value={isOpen && search.length > 0 ? search : valueRender ?? ''}
          aria-haspopup="listbox"
          autoComplete={autoComplete}
        />
      </div>
      <OptionList
        isMulti={isMulti}
        options={filteredOptions}
        value={value}
        focused={focused}
        isOpen={isOpen}
        onOptionClick={(option: SelectOptionType, event: MouseEvent) => {
          event.preventDefault()
          event.stopPropagation()
          isMulti ? handleClickForMulti(option) : handleClickForSingle(option)
        }}
      />
    </div>
  )
}

export default forwardRef(Select)
