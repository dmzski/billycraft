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
  useId,
  ReactNode,
} from 'react'
import OptionList from './OptionList'
import clsx from 'clsx'
import useClickOutsideHandler from 'hooks/useClickOutsideHandler'

const errorClasses = 'select-error'
const disabledClasses = 'select-disabled'
const inputClasses =
  'select select-bordered focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary focus-within:select-primary inline-flex items-center min-w-0'

export type OptionValue = string | number
export type SelectOptionType = {
  value: OptionValue
  label: ReactNode
  render?: ReactNode
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
  | 'tabIndex'
  | 'name'
  | 'autoComplete'
> & {
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

const filterOptions = ({ options, search }: { options: SelectOptionType[]; search: string }) =>
  options.filter(option =>
    typeof option.label === 'string'
      ? option.label.toLowerCase().includes(search.toLowerCase())
      : true,
  )

const Select = (
  {
    'aria-label': ariaLabel,
    readOnly,
    autoComplete,
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
    tabIndex,
    isSearchable,
    error,
    required,
    autoFocus,
  }: SelectProps,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const generatedId = useId()
  const id = idProp ?? generatedId
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
    [isSearchable, options, search, filterOptions],
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
      const index = value.findIndex(v => v === option.value)

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
    [onChange, value],
  )

  // Click an option change search and value then close the options
  const handleClickForSingle = useCallback(
    (option: SelectOptionType) => {
      onChange?.(option.value)
      setSearch('')
      inputRef.current?.focus()
      setOpen(false)
    },
    [onChange],
  )

  const handleKeyDown: KeyboardEventHandler = useCallback(
    event => {
      if (!isOpen) {
        event.preventDefault()
        if (event.key === KEYS.ArrowDown) handleOpen()
      } else if (
        [KEYS.ArrowDown, KEYS.ArrowUp, KEYS.Enter, KEYS.Tab, KEYS.Escape].includes(event.key)
      ) {
        switch (event.key) {
          case KEYS.Tab:
          case KEYS.Escape:
            event.preventDefault()
            setOpen(false)
            break
          case KEYS.ArrowUp:
            {
              event.preventDefault()
              const index = filteredOptions.findIndex(option => option.value === focused)
              setFocused(current => filteredOptions[index - 1]?.value ?? current)
            }
            break
          case KEYS.ArrowDown:
            event.preventDefault()
            if (!isOpen) {
              handleOpen()
              setFocused(filteredOptions[0].value)
            } else {
              const index = filteredOptions.findIndex(option => option.value === focused)
              setFocused((current: string | number) => filteredOptions[index + 1]?.value ?? current)
            }
            break
          case KEYS.Enter: {
            if (isOpen) {
              event.preventDefault()
              const optionSelected = filteredOptions.find(option => option.value === focused)
              if (optionSelected) {
                isMulti ? handleClickForMulti(optionSelected) : handleClickForSingle(optionSelected)
              }
              break
            }
          }
        }
      }
    },
    [isOpen, filteredOptions, handleClickForMulti, handleClickForMulti, focused, handleOpen],
  )

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      setSearch(event.currentTarget.value ?? '')
      handleOpen()
    },
    [handleOpen],
  )

  const handleInputKeyUp: KeyboardEventHandler = useCallback(event => {
    if ([KEYS.Enter].includes(event.key)) {
      event.preventDefault()
      event.stopPropagation()
    }
  }, [])

  const inputClassName = clsx(inputClasses, 'relative', {
    [errorClasses]: error,
    [disabledClasses]: disabled,
  })

  const valueRender = useMemo(() => {
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

  const inputValue = useMemo(() => {
    if (isOpen && search.length > 0) {
      return search
    }

    return ''
  }, [value, search, isOpen])

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
        onClick={() => {
          inputRef.current?.focus()
        }}
      >
        {label ? (
          <label htmlFor={id} className="label py-1">
            <span className="label-text">{label}</span>
          </label>
        ) : null}
        <div className={inputClassName}>
          <span className="flex-grow inline-flex gap-2">
            {isOpen && search.length > 0 ? '' : valueRender}
          </span>
          <input
            className={clsx('bg-transparent outline-none absolute inset-y-0 inset-x-4', {
              'cursor-pointer': !isSearchable,
            })}
            autoFocus={autoFocus}
            onClick={handleOpen}
            name={name}
            role="combobox"
            disabled={disabled}
            onKeyUp={handleInputKeyUp}
            onChange={handleInputChange}
            readOnly={readOnly || !isSearchable}
            aria-label={ariaLabel}
            placeholder={!value ? placeholder ?? 'Select...' : undefined}
            type="text"
            id={id}
            tabIndex={tabIndex}
            ref={inputRef}
            value={inputValue}
            aria-haspopup="listbox"
            autoComplete={autoComplete}
          />
        </div>
      </div>
      {filteredOptions?.length > 0 ? (
        <OptionList
          isMulti={isMulti}
          options={filteredOptions}
          value={value}
          focused={focused}
          isOpen={isOpen}
          onOptionClick={(option: SelectOptionType, event: MouseEvent) => {
            event.preventDefault()
            isMulti ? handleClickForMulti(option) : handleClickForSingle(option)
          }}
        />
      ) : null}
    </div>
  )
}

export default forwardRef(Select)
