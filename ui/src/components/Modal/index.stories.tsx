import { useState } from 'react'
import { Modal } from '.'
import { Button } from 'components/Button'
import { StoryObj } from '@storybook/react'

export default {
  title: 'Components/Modal',
  component: Modal,
}

type Story = StoryObj<typeof Modal>

export const Basic: Story = {
  render: ({ withoutPortal, hideOnClickOutside, size }) => (
    <Modal
      disclosure={<Button>Open modal</Button>}
      withoutPortal={withoutPortal}
      hideOnClickOutside={hideOnClickOutside}
      size={size}
    >
      {({ close }) => (
        <div>
          <Modal.Title>Title</Modal.Title>
          <p>Description</p>
          <Modal.Actions>
            <Button onClick={close}>Close</Button>
          </Modal.Actions>
        </div>
      )}
    </Modal>
  ),
  args: {
    withoutPortal: false,
    hideOnClickOutside: true,
  },
}

export const Controlled: Story = {
  render: ({ withoutPortal, hideOnClickOutside }) => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button
          onClick={() => {
            setOpen(true)
          }}
        >
          Open controlled modal
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          withoutPortal={withoutPortal}
          hideOnClickOutside={hideOnClickOutside}
        >
          {<>You can close me</>}
        </Modal>
      </>
    )
  },
  args: {
    withoutPortal: false,
    hideOnClickOutside: true,
  },
}

export const WithScroll: Story = {
  render: ({ withoutPortal, hideOnClickOutside }) => (
    <>
      <Modal
        disclosure={<Button>Open scrollable modal</Button>}
        withoutPortal={withoutPortal}
        hideOnClickOutside={hideOnClickOutside}
      >
        <div className="flex flex-col gap-4">
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
          <p>Content</p>
        </div>
      </Modal>
    </>
  ),
  args: {
    withoutPortal: false,
    hideOnClickOutside: true,
  },
}
