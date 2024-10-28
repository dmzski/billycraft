import { useState } from 'react'
import { DateTimePicker, DateTimePickerProps } from '.'
import { StoryObj } from '@storybook/react'

export default {
  title: 'Components/DateTimePicker',
  component: DateTimePicker,
}

type Story = StoryObj<typeof DateTimePicker>

const render = ({ ...args }: DateTimePickerProps) => {
  const [value, setValue] = useState<Date | undefined>()
  return <DateTimePicker {...args} value={value} onChange={newValue => setValue(newValue)} />
}

export const Basic: Story = {
  args: {
    label: 'Basic',
  },
  render,
}

export const Labeled: Story = {
  render,
  args: {
    label: 'Labeled',
    variant: 'outside',
  },
}

export const Disabled: Story = {
  render,
  args: {
    label: 'Disabled',
    disabled: true,
  },
}

export const Error: Story = {
  render,
  args: {
    label: 'Error',
    error: true,
  },
}
