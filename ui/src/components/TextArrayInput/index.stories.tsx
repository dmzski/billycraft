import { StoryObj } from '@storybook/react'
import TextArrayInput from '.'

export default {
  title: 'Components/TextArrayInput',
  component: TextArrayInput,
}

type Story = StoryObj<typeof TextArrayInput>

export const Basic: Story = {
  render: (args) => <TextArrayInput {...args} />,
  args: {
    value: ['This', 'is', 'awesome'],
  }
}
