import { StoryObj } from '@storybook/react'
import TopBar from '.'

export default {
  title: 'Components/TopBar',
  component: TopBar,
}
type Story = StoryObj<typeof TopBar>

export const Basic: Story = {
  render: args => <TopBar {...args} />,
  args: {
    children: 'Test navbar',
    className: 'border rounded-box shadow-xl',
  },
}
