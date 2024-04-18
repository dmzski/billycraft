import { Meta, StoryObj } from '@storybook/react'
import Select, { ValueType } from '.'
import Button from 'components/Button'
import { useState } from 'react'

export default {
  title: 'Components/Select',
  component: Select,
  args: {
    className: 'flex-grow',
  },
} as Meta<typeof Select>

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

const render: Story['render'] = props => {
  const [value, setValue] = useState<ValueType>()

  return (
    <div className="min-h-44 flex gap-2 flex-row justify-start">
      <Select {...props} value={value} onChange={result => setValue(result)} />
      <div className="w-32 flex pt-3">Value is : {value}</div>
    </div>
  )
}

export const Basic: Story = {
  render,
  args: {
    options: fakeOptions,
    variant: 'default',
  },
  decorators: [Component => <Component />],
}

export const Searchable: Story = {
  render,
  args: {
    isSearchable: true,
    options: fakeOptions,
  },
  decorators: [
    Story => (
      <>
        <Story />
      </>
    ),
  ],
}

export const Labeled: Story = {
  render,
  args: {
    label: 'My awesome label',
    options: fakeOptions,
  },
}

export const Multi: Story = {
  render,
  args: {
    label: 'Multi select',
    options: fakeOptions,
    isMulti: true,
  },
}

export const CustomRender: Story = {
  render,
  args: {
    label: 'Select option 1, 2, or 5',
    options: [
      { label: 'Option 1', value: 1, render: 'Custom 1' },
      { label: 'Option 2', value: 2, render: 'Custom 2' },
      { label: 'Option 3', value: 3 },
      { label: 'Option 4', value: 4 },
      {
        label: 'Option 5 is a very very very very very very very very long string',
        value: 5,
        render: 'Option 5',
      },
    ],
  },
}

export const Controlled: Story = {
  render: props => {
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
          onChange={result => setValue(result as number)}
        />
        <p>Value is {JSON.stringify(value)}</p>
      </div>
    )
  },
  args: {
    'aria-label': 'My awesome label',
    options: fakeOptions,
  },
}
