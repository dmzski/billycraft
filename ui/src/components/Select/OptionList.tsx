import clsx from 'clsx'
import { SelectOptionType, ValueType } from '.'
import Option from './Option'
import { MouseEvent } from 'react'

const listContainerClasses =
  'menu max-h-40 flex-nowrap overflow-x-none overflow-y-auto dropdown-content shadow bg-base-300 rounded-box w-full z-10'
type OptionListProps = {
  focused: string | number
  options: SelectOptionType[]
  onOptionClick: (option: SelectOptionType, event: MouseEvent) => void
  value?: ValueType
  isMulti?: boolean
  isOpen?: boolean
}

const OptionList = ({
  focused,
  options,
  onOptionClick,
  value,
  isMulti,
  isOpen,
}: OptionListProps) => (
  <ul className={clsx(listContainerClasses, isOpen ? '' : 'sr-only')} role="listbox">
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
