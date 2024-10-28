import { useState } from 'react'
import { Checkbox, CheckboxProps } from '.'
import { StoryObj } from '@storybook/react'

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
}

type Story = StoryObj<typeof Checkbox>

export const Basic: Story = {
  render: ({ checked, ...props }: CheckboxProps) => {
    const [isChecked, setChecked] = useState(checked)

    const onChange = () => {
      setChecked(!isChecked)
    }

    return <Checkbox {...props} checked={isChecked} onCheckedChange={onChange} />
  },
  args: {
    checked: true,
  },
}
