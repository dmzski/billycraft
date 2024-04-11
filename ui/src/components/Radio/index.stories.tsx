import { StoryObj } from '@storybook/react'
import Radio, { RadioProps } from '.'
import { ChangeEventHandler, useState } from 'react'

export default {
  title: 'Components/Radio',
  component: Radio,
}

type Story = StoryObj<typeof Radio>

export const Basic: Story = {
  render: ({ ...props }: RadioProps) => {
    const [isChecked, setChecked] = useState('1')

    const onChange: ChangeEventHandler<HTMLInputElement> = event => {
      setChecked(event.target.value)
    }

    return (
      <div className="flex flex-col">
        <Radio {...props} value={1} checked={isChecked === '1'} onChange={onChange}>
          Radio 1
        </Radio>
        <Radio {...props} value={2} checked={isChecked === '2'} onChange={onChange}>
          Radio 2
        </Radio>
      </div>
    )
  },
  args: {
    children: 'Basic',
    value: 'test',
    name: 'test',
    className: 'w-fit',
  },
}
