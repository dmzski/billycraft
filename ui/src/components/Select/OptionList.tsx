import clsx from 'clsx'
import { SelectOptionType, ValueType } from '.'
import Option from './Option'
import { MouseEvent } from 'react'

const listContainerClasses =
  'menu dropdown-content shadow bg-base-300 rounded-box w-52'
type OptionListProps = {
  focused: string | number
  isOpen?: boolean
  options: SelectOptionType[]
  onOptionClick: (option: SelectOptionType, event: MouseEvent) => void
  value?: ValueType
  isMulti?: boolean
}

const OptionList = ({
  focused,
  isOpen,
  options,
  onOptionClick,
  value,
  isMulti,
}: OptionListProps) => (
  <ul
    className={clsx(listContainerClasses, { 'sr-only': !isOpen })}
    role="listbox"
  >
    {options.map((option: SelectOptionType) => (
      <Option
        focused={focused}
        key={option.value}
        isMulti={isMulti}
        option={option}
        onOptionClick={onOptionClick}
        value={value}
      />
    ))}
  </ul>
)

export default OptionList
