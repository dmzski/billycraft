import { Icon, Input } from '@coco-ui/core'
import { useState, ChangeEvent } from 'react';

const SearchBar = (): JSX.Element => {
  const [search, setSearch] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <div className="flex border rounded p-2">
      <Icon name="search" className="text-gray-500 mr-4" />
      <Input type="search" name="global-search" value={search} onChange={handleChange} />
    </div>
  )
}

export default SearchBar
