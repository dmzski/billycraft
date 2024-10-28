import { StoryObj } from '@storybook/react'
import { Badge } from '.'

export default {
  title: 'Components/Badge',
  component: Badge,
}

type Story = StoryObj<typeof Badge>

export const Basic: Story = {
  args: {
    children: 'Basic',
  },
}

export const Outline: Story = {
  args: {
    children: 'outline',
    variant: 'outline',
  },
}

export const Destructive: Story = {
  args: {
    children: 'destructive',
    variant: 'destructive',
  },
}

export const Secondary: Story = {
  args: {
    children: 'secondary',
    variant: 'secondary',
  },
}
