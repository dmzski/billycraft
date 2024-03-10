import { StoryObj } from '@storybook/react'
import Link from '.'
import Button from 'components/Button'

export default {
  title: 'Components/Link',
  component: Link,
}

type Story = StoryObj<typeof Link>

export const Basic: Story = {
  render: (args) => <Link {...args} />,
  args: {
    children: 'Basic',
  }
}

type Story2 = StoryObj<typeof Link<typeof Button>>

export const CustomComponent: Story2 = {
  render: (args) => <Link {...args} />,
  args: {
    children: 'Basic',
    as: Button,
    type: "button"
  }
}
