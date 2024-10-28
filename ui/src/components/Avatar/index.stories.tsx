import example from './example.jpeg'
import { Avatar } from '.'
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
  },
}

export const WithoutImage: Story = {
  args: {
    alt: 'Dorian Maliszewski',
    charCount: 2,
  },
}

export const OnImageLoadError: Story = {
  args: {
    src: '/refrepifjeroivnevnijfevbeiuvbeiuvbfev',
    alt: 'P',
    charCount: 1,
  },
}
