import { StoryObj } from '@storybook/react'
import { Tabs } from '.'
import { useState } from 'react'

export default {
  title: 'Components/Tabs',
  component: Tabs,
}

type Story = StoryObj<typeof Tabs>
const render: Story['render'] = props => {
  const [selected, setSelected] = useState('left')

  return (
    <Tabs {...props}>
      <Tabs.Tab value="left" onClick={() => setSelected('left')} isActive={selected === 'left'}>
        Left
      </Tabs.Tab>
      <Tabs.Tab value="right" onClick={() => setSelected('right')} isActive={selected === 'right'}>
        Right
      </Tabs.Tab>
    </Tabs>
  )
}

export const Basic: Story = {
  render,
  args: {},
}

export const WithLinks: Story = {
  args: {},
  render: props => {
    const [selected, setSelected] = useState('left')

    return (
      <Tabs {...props}>
        <Tabs.Tab onClick={() => setSelected('left')} isActive={selected === 'left'} asChild>
          <a href="#" target="_blank">
            Left is link
          </a>
        </Tabs.Tab>
        <Tabs.Tab
          value="right"
          onClick={() => setSelected('right')}
          isActive={selected === 'right'}
        >
          Right is button
        </Tabs.Tab>
      </Tabs>
    )
  },
}
