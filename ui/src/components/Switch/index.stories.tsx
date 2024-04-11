import { StoryObj } from '@storybook/react'
import Switch from '.'
import { useState } from 'react'

export default {
  title: 'Components/Switch',
  component: Switch,
}

type Story = StoryObj<typeof Switch>
const render: Story['render'] = ({ checked, onChange, ...props }) => {
  const [isChecked, setIsChecked] = useState(checked)
  return (
    <Switch
      checked={isChecked}
      onChange={event => {
        setIsChecked(!isChecked)
        onChange?.(event)
      }}
      {...props}
    />
  )
}

export const Basic: Story = {
  render,
  args: {
    children: 'My awesome switch',
    id: 'test',
    value: 'on',
    className: 'w-fit',
  },
}

export const Position: Story = {
  render,
  args: {
    children: 'My awesome switch',
    id: 'test',
    value: 'on',
    labelPosition: 'left',
    className: 'w-fit',
  },
}
