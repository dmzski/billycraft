import clsx from 'clsx'
import { SelectOptionType, ValueType } from '.'
import Option from './Option'
import { ChangeEventHandler, KeyboardEventHandler, useMemo, useRef, useState } from 'react'

const listContainerClasses =
'menu max-h-56 flex-nowrap overflow-x-none absolute top-full left-0 right-0 overflow-y-auto shadow bg-base-300 rounded-xl w-full z-10 min-w-max'

const KEYS = {
  ArrowDown: 'ArrowDown',
  ArrowUp: 'ArrowUp',
  Tab: 'Tab',
  Escape: 'Escape',
  Enter: 'Enter',
}

type OptionListProps = {
  options: SelectOptionType[]
  onOptionClick: (option: SelectOptionType) => void
  value?: ValueType
  isMulti?: boolean
  isSearchable?: boolean
}

const filterOptions = ({ options, search }: { options: SelectOptionType[]; search: string }) =>
  search.length > 0 ? options.filter(option => {
    if (option.searchText) {
      return option.searchText.toLowerCase().includes(search.toLowerCase())
    }
    if (typeof option.label === 'string') {
      return option.label.toLowerCase().includes(search.toLowerCase())
    }
    return true
  }
  ) : options

const OptionList = ({
  options,
  onOptionClick,
  value,
  isMulti,
  isSearchable,
}: OptionListProps) => {
  const ulRef = useRef<HTMLUListElement>(null)
  const [search, setSearch] = useState("")

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearch(event.target.value)
  }

  const filteredOptions = useMemo(() => filterOptions({ options, search }), [options, search])

  const handleKeyDown: KeyboardEventHandler<HTMLUListElement> = (event) => {
    if (event.key === KEYS.ArrowDown || event.key === KEYS.ArrowUp) {
      event.preventDefault()
      if (ulRef.current && Object.values(KEYS).includes(event.key)) {
        const activeElement = document.activeElement
        const focusables = ulRef.current.querySelectorAll<HTMLElement>("button:not(disabled), input:not(disabled)")
        if (event.key === KEYS.ArrowDown) {
          if (activeElement && ulRef.current.contains(activeElement)) {
            const index = [...focusables].findIndex((aButton) => aButton === activeElement)
            focusables[index + 1]?.focus()
          } else {
            focusables[0]?.focus()
          }
        }
        if (event.key === KEYS.ArrowUp) {
          if (activeElement && ulRef.current.contains(activeElement)) {
            const index = [...focusables].findIndex((aButton) => aButton === activeElement)
            focusables[index - 1]?.focus()
          } else {
            focusables[0]?.focus()
          }
        }
      }
    }

  }

  const handleInputKeyUp: KeyboardEventHandler = event => {
    if ([KEYS.Enter].includes(event.key)) {
      event.preventDefault()
      event.stopPropagation()
    }
  }


  return (
    <ul ref={ulRef} onKeyUp={handleInputKeyUp} onKeyDown={handleKeyDown} onClick={(e) => { e.stopPropagation() }} className={clsx(listContainerClasses)} role="listbox">
      {isSearchable ? (
        <li className='pb-1'>
          <div className='menu-title font-normal'>
            <label className='input input-bordered flex items-center gap-2'>
              <input autoComplete='off' autoFocus className='grow text-base-content text-opacity-100' type="text" value={search} onChange={handleSearchChange} />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
            </label>
          </div>
        </li>
      ) : null}
      {filteredOptions.map((option: SelectOptionType, index) => (
        <Option
          autoFocus={index === 0 && !isSearchable}
          key={option.value}
          isMulti={isMulti}
          option={option}
          onOptionClick={onOptionClick}
          value={value}
        />
      ))}
    </ul>
  )
}

export default OptionList
