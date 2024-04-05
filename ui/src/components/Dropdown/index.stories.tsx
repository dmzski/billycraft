import { StoryObj } from '@storybook/react'
import Dropdown from '.'
import Button from 'components/Button'

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
}

type Story = StoryObj<typeof Dropdown>

export const Basic: Story = {
  render: (args) => {
    return (
      <Dropdown {...args}>
        <Button>Click me</Button>
        <Dropdown.Content>
          <Dropdown.Button>Action</Dropdown.Button>
          <Dropdown.Button>Action</Dropdown.Button>
          <Dropdown.Button>Action</Dropdown.Button>
          <Dropdown.Button>Action</Dropdown.Button>
          <Dropdown.Button>
            Action that has a super long content
          </Dropdown.Button>
        </Dropdown.Content>
      </Dropdown>
    )
  }
}

export const Customized: Story = {
  render: (args) => {
    return (
      <Dropdown {...args}>
        <Button>Click me</Button>
        <Dropdown.Content className="w-52">
          <Dropdown.Button>Action</Dropdown.Button>
          <Dropdown.Button>Action</Dropdown.Button>
          <Dropdown.Button>Action</Dropdown.Button>
          <Dropdown.Button>Action</Dropdown.Button>
          <Dropdown.Button>
            Action that has a super long content
          </Dropdown.Button>
        </Dropdown.Content>
      </Dropdown>
    )
  }
}
