import { useState } from 'react'
import { StoryObj } from '@storybook/react'
import { Drawer, DrawerProps } from '.'
import { Button } from 'components/Button'

export default {
  title: 'Components/Drawer',
  component: Drawer,
}

type Story = StoryObj<typeof Drawer>

export const Basic: Story = {
  render: ({ open, ...props }: DrawerProps) => {
    const [isOpen, setIsOpen] = useState(open)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open drawer</Button>
        <Drawer {...props} open={isOpen} onClose={() => setIsOpen(false)} />
      </>
    )
  },
  args: {
    children: 'Basic',
    open: false,
    noBackdrop: true,
    withoutPortal: true,
  },
}

export const Position: Story = {
  render: () => {
    const [state, setState] = useState('')

    return (
      <>
        <div className="flex gap-2">
          <Button onClick={() => setState('top')}>Open top drawer</Button>
          <Button onClick={() => setState('right')}>Open right drawer</Button>
          <Button onClick={() => setState('bottom')}>Open bottom drawer</Button>
          <Button onClick={() => setState('left')}>Open left drawer</Button>
        </div>
        <Drawer withoutPortal side="top" open={state === 'top'} onClose={() => setState('')}>
          {state}
        </Drawer>
        <Drawer withoutPortal side="right" open={state === 'right'} onClose={() => setState('')}>
          {state}
        </Drawer>
        <Drawer withoutPortal side="bottom" open={state === 'bottom'} onClose={() => setState('')}>
          {state}
        </Drawer>
        <Drawer withoutPortal side="left" open={state === 'left'} onClose={() => setState('')}>
          {state}
        </Drawer>
      </>
    )
  },
}
