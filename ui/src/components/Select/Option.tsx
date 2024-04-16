import { KeyboardEventHandler, MouseEventHandler, useEffect, useMemo, useRef } from 'react'
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
  onOptionClick: (option: SelectOptionType) => void
  autoFocus?: boolean
}

const Option = ({ autoFocus, isMulti, value, option, onOptionClick }: OptionProps) => {
  const isSelected = useMemo(() => {
    return isMulti && Array.isArray(value) ? value.includes(option.value) : option.value === value
  }, [value, option, isMulti])

  const optionRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setTimeout(() => {
      if (autoFocus && optionRef.current) {
        optionRef.current.focus()
      }
    })
  }, [autoFocus])

  const handleSelectOptionClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    onOptionClick(option)
  }
  const handleSelectOptionEnter: KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      onOptionClick(option)
    }
  }

  return (
    <li role="option">
      <button
        autoFocus={autoFocus}
        ref={optionRef}
        className={clsx({
          'focus:bg-primary-content focus:text-primary': !isSelected,
          'border-l-4 rounded-l-none bg-primary-content text-primary border-primary focus:bg-primary focus:text-primary-content focus:border-primary-content': isSelected,
        })}
        onClick={handleSelectOptionClick}
        onKeyUp={handleSelectOptionEnter}
      >
        {option.label}
      </button>
    </li>
  )
}

export default Option
