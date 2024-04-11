import Row from '.'
import { StoryObj } from '@storybook/react'

export default {
  title: 'Components/Row',
  component: Row,
}

type Story = StoryObj<typeof Row>

const render: Story['render'] = args => (
  <Row {...args}>
    <div className="bg-primary text-center text-white font-bold rounded border">1</div>
    <div className="bg-accent text-center text-white font-bold rounded border">2</div>
    <div className="bg-success text-center text-white font-bold rounded border">3</div>
    <div className="bg-info text-center text-white font-bold rounded border">4</div>
    <div className="bg-warning text-center text-white font-bold rounded border">5</div>
    <div className="bg-error text-center text-white font-bold rounded border">6</div>
  </Row>
)

export const Basic: Story = {
  render,
  args: {
    template: 'repeat(6, 1fr)',
  },
}
