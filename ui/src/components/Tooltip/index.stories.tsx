import { StoryObj } from '@storybook/react'
import Tooltip from '.'

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
}

export const Basic: StoryObj<typeof Tooltip> = {
  render: args => <Tooltip {...args} />,
  args: {
    children: 'Tooltip',
    text: 'Test',
  },
}
