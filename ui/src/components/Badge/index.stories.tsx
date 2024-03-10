import { StoryObj } from '@storybook/react'
import Badge from '.'

export default {
  title: 'Components/Badge',
  component: Badge
}

type Story = StoryObj<typeof Badge>


export const Basic: Story = {
  args: {
    children: 'Basic',
  }
}

export const Outline: Story = {
  args: {
    children: 'outline',
    outline: true,
  }
}
