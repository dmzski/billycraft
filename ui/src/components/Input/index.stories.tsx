import { StoryObj } from '@storybook/react'
import Input from '.'

export default {
  title: 'Components/Input',
  component: Input,
}

type Story = StoryObj<typeof Input>

const render: Story['render'] = args => <Input {...args} />

export const Basic: Story = {
  render,
}

export const WithLabel: Story = {
  render,
  args: {
    label: 'My awesome label',
  },
}

export const PrefixAndSuffix: Story = {
  render,
  args: {
    label: 'My awesome label',
    suffix: 'Suffix',
    prefix: 'Prefix',
  },
}

export const Error: Story = {
  render,
  args: {
    value: 'test',
    label: 'My awesome label',
    error: 'Test error',
  },
}
