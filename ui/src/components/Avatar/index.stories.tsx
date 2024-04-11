import example from './example.jpeg'
import Avatar from '.'
import { StoryObj } from '@storybook/react'

export default {
  title: 'Components/Avatar',
  component: Avatar,
}

type Story = StoryObj<typeof Avatar>

export const Basic: Story = {
  args: {
    src: example,
    alt: 'Example with image',
    size: 30,
  },
}

export const WithoutImage: Story = {
  args: {
    alt: 'Dorian Maliszewski',
    size: 30,
  },
}
