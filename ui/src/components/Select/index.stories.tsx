import { StoryObj } from '@storybook/react'
import Select, { ValueType } from '.'
import Button from 'components/Button'
import { useRef, useState } from 'react'

export default {
  title: 'Components/Select',
  component: Select,
  args: {
    variant: 'inside',
  },
}

const fakeOptions = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option 3', value: 3 },
  { label: 'Option 4', value: 4 },
  {
    label: 'Option 5 is a very very very very very very very very long string',
    value: 5,
  },
]

type Story = StoryObj<typeof Select>

const render: Story['render'] = (props) => {
  const ref = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<ValueType>()

  return (
    <div className="flex gap-2 items-center">
      <Select
        {...props}
        value={value}
        onChange={(result) => setValue(result)}
        ref={ref}
      />
      <div>Value is : {value}</div>
    </div>
  )
}

export const Basic: Story = {
  render,
  args: {
    options: fakeOptions
  },
  decorators: [
    (Component) => (
      <div style={{ minHeight: '10rem' }} className="w-full items-start flex">
        <Component />
      </div>
    ),
  ]
}

export const Searchable: Story = {
  render,
  args: {
    isSearchable: true,
    options: fakeOptions
  },
  decorators: [
    (Story) => (
      <>
        <Story />
      </>
    ),
  ]
}

export const Labeled: Story = {
  render,
  args: {
    label: 'My awesome label',
    options: fakeOptions,
  }
}

export const Multi: Story = {
  render,
  args: {
    label: 'Multi select',
    options: fakeOptions,
    isMulti: true,
  }
}

export const Controlled: Story = {
  render: (props) => {
    const [value, setValue] = useState<number | undefined>(1)

    const handleReset = () => {
      setValue(undefined)
    }
    return (
      <div className="w-full flex items-center gap-2">
        <Button size="md" className="m-2" onClick={handleReset}>
          Reset
        </Button>
        <Select
          {...props}
          value={value}
          isSearchable
          onChange={(result) => setValue(result as number)}
        />
        <p>Value is {JSON.stringify(value)}</p>
      </div>
    )
  },
  args: {
    "aria-label": 'My awesome label',
    options: fakeOptions,
  }
}
