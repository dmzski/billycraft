import { StoryObj } from '@storybook/react'
import TimePicker, { TimePickerProps } from '.'
import { useState } from 'react'

export default {
  title: 'Components/TimePicker',
  component: TimePicker,
}

type Story = StoryObj<typeof TimePicker>

const render: Story['render'] = ({ ...args }: TimePickerProps) => {
  const [value, setValue] = useState('')

  return <TimePicker {...args} value={value} onChange={newValue => setValue(newValue)} />
}

export const Basic: Story = {
  render,
  args: {
    id: 'test',
  },
}

export const Disabled: Story = {
  render,
  args: {
    id: 'test',
    disabled: true,
  },
}

export const Error: Story = {
  render,
  args: {
    id: 'test',
    error: true,
  },
}
