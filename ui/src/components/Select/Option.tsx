import { MouseEvent, useMemo } from 'react'
import { SelectOptionType, ValueType } from '.'

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

const Option = ({
  isMulti,
  value,
  option,
  focused,
  onOptionClick,
}: OptionProps) => {
  const isSelected = useMemo(() => {
    return isMulti && Array.isArray(value)
      ? value.includes(option.value)
      : option.value === value
  }, [value, option, isMulti])

  const isFocused = useMemo(() => focused === option.value, [option, focused])

  return (
    <li className={isSelected ? 'bordered' : ''}>
      <button
        role="option"
        tabIndex={-1}
        className={isFocused ? 'active' : ''}
        onClick={(event) => onOptionClick(option, event)}
      >
        <div className="flex items-center">
          <span className="flex-grow">{option.label}</span>
        </div>
      </button>
    </li>
  )
}

export default Option
