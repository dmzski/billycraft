import { MouseEvent, useEffect, useMemo, useRef } from 'react'
import { SelectOptionType, ValueType } from '.'
import clsx from 'clsx'

export type RenderSelectOptionProps = {
  option: SelectOptionType
  isSelected?: boolean
}

type OptionProps = {
  isMulti?: boolean
  value?: ValueType
  option: SelectOptionType
  focused: number | string
  onOptionClick: (option: SelectOptionType, event: MouseEvent) => void
}

const Option = ({ isMulti, value, option, focused, onOptionClick }: OptionProps) => {
  const isSelected = useMemo(() => {
    return isMulti && Array.isArray(value) ? value.includes(option.value) : option.value === value
  }, [value, option, isMulti])

  const isFocused = useMemo(() => focused === option.value, [option, focused])
  const optionRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (isFocused && optionRef.current) {
      optionRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'nearest',
        block: 'nearest',
      })
    }
  }, [isFocused])

  return (
    <li ref={optionRef}>
      <button
        role="option"
        tabIndex={-1}
        className={clsx({
          active: isFocused,
          'border-l-4 rounded-l-none bg-primary bg-opacity-10 border-primary': isSelected,
        })}
        onClick={event => onOptionClick(option, event)}
      >
        {option.label}
      </button>
    </li>
  )
}

export default Option
