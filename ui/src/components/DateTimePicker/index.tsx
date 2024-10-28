import { Input } from '../Input'
import {
  FocusEventHandler,
  forwardRef,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import useClickOutsideHandler from '../../hooks/useClickOutsideHandler'
import MonthCalendar from './MonthCalendar'
import CalendarIcon from '@heroicons/react/24/solid/CalendarIcon'
import { tw } from 'lib/utils'

export type DateTimePickerProps = {
  name?: string
  value?: Date
  onChange?: (newValue: Date) => void
  onBlur?: FocusEventHandler<HTMLInputElement>
  className?: string
  label?: string
  variant?: 'inside' | 'outside'
  disabled?: boolean
  error?: boolean
  required?: boolean
  onClickOutside?: () => void | Promise<void>
}

export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(
  (
    {
      name,
      value,
      onChange,
      onClickOutside,
      onBlur,
      label,
      variant,
      className,
      disabled,
      error,
      required,
    },
    ref,
  ) => {
    if (value && !(value instanceof Date && !Number.isNaN(value))) {
      throw new Error('DateTimePicker : value should be a Date instance or undefined')
    }
    const [inputValue, setInputValue] = useState(value)
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useClickOutsideHandler(containerRef, () => {
      setOpen(false)
      onClickOutside?.()
    })

    useEffect(() => {
      if (value) {
        if (!(value instanceof Date && !Number.isNaN(value))) {
          throw new Error('DateTimePicker : value should be a Date instance or undefined')
        }
        setInputValue(value)
      }
    }, [value])

    const handleFocus = useCallback(() => {
      if (!disabled) setOpen(true)
    }, [disabled])

    const handleClick = useCallback(() => {
      if (!disabled) setOpen(true)
    }, [disabled])

    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }, [])

    const handleDateClick = useCallback(
      (newDate: Date) => {
        onChange?.(newDate)
      },
      [onChange],
    )

    const handleTimeClick = useCallback(
      (hours: number, minutes: number) => {
        if (value) {
          const newValue = new Date(value)
          newValue.setHours(hours)
          newValue.setMinutes(minutes)
          onChange?.(newValue)
        } else {
          onChange?.(new Date(0, 0, 0, hours, minutes))
        }
      },
      [onChange, value],
    )

    const containerClassNames = useMemo(
      () =>
        tw({
          ['absolute top-full shadow-lg rounded-md overflow-hidden z-100 bg-background']: true,
          ['sr-only']: !open,
        }),
      [open],
    )

    const iconClassNames = useMemo(
      () =>
        tw('size-4 absolute right-2 bottom-0 mb-3 text-muted-foreground', {
          'text-destructive': error,
        }),
      [error, variant, label, open],
    )

    return (
      <div onKeyDown={handleKeyDown} ref={containerRef} className="relative">
        <Input
          className={className}
          label={label}
          onFocus={handleFocus}
          onClick={handleClick}
          onBlur={onBlur}
          name={name}
          value={inputValue?.toLocaleString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
          ref={ref}
          disabled={disabled}
          error={error}
          required={required}
        />
        {!disabled ? (
          <>
            <CalendarIcon className={iconClassNames} />
            <div className={containerClassNames}>
              <MonthCalendar
                selected={inputValue}
                onDateClick={handleDateClick}
                onTimeClick={handleTimeClick}
              />
            </div>
          </>
        ) : null}
      </div>
    )
  },
)

DateTimePicker.displayName = 'DateTimePicker'
