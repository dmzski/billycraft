import Input from '../Input'
import {
  FocusEventHandler,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import useClickOutsideHandler from '../../hooks/useClickOutsideHandler'
import MonthCalendar from './MonthCalendar'
import clsx from 'clsx'
import CalendarIcon from '@heroicons/react/24/outline/CalendarIcon'

export type DatePickerProps = {
  name?: string
  value?: Date
  onChange?: (newValue: Date) => void
  onBlur?: FocusEventHandler<HTMLInputElement>
  className?: string
  label?: string
  disabled?: boolean
  error?: boolean
  required?: boolean
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
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
    ref
  ) => {
    if (value && !(value instanceof Date && !Number.isNaN(value))) {
      throw new Error(
        'DatePicker : value should be a Date instance or undefined'
      )
    }
    const [inputValue, setInputValue] = useState(value?.toLocaleDateString())
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useClickOutsideHandler(containerRef, () => {
      setOpen(false)
    })

    useEffect(() => {
      if (value) {
        if (!(value instanceof Date && !Number.isNaN(value))) {
          throw new Error(
            'DatePicker : value should be a Date instance or undefined'
          )
        }
        setInputValue(value.toLocaleDateString())
      }
    }, [value])

    const handleFocus = useCallback(() => {
      if (!disabled) setOpen(true)
    }, [disabled])

    const handleDateClick = useCallback(
      (newDate: Date) => {
        onChange?.(newDate)
        setOpen(false)
      },
      [onChange]
    )

    const containerClassNames = useMemo(
      () =>
        clsx({
          ['absolute top-full shadow rounded overflow-hidden z-100 bg-background']:
            true,
          ['sr-only']: !open,
        }),
      [open]
    )

    const iconClassNames = useMemo(
      () =>
        clsx('absolute h-5 right-2', {
          'text-gray-400': !error && !open,
          'text-primary': !error && open,
          'text-error': error,
          'bottom-3': label,
        }),
      [error, label, open]
    )

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
            <CalendarIcon
              className={iconClassNames}
            />
            <div className={containerClassNames}>
              <MonthCalendar selected={value} onDateClick={handleDateClick} />
            </div>
          </>
        ) : null}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'
export default DatePicker
