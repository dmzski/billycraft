import {
  cloneElement,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import Button from '../Button'
import MarkXIcon from '@heroicons/react/24/solid/XMarkIcon'

export type ModalProps = {
  disclosure?: JSX.Element
  children: ((props: { close: () => void }) => JSX.Element) | ReactNode
  withoutPortal?: boolean
  hideOnClickOutside?: boolean
  open?: boolean
  onClose?: () => void
}

const Modal = ({
  disclosure,
  children,
  withoutPortal,
  hideOnClickOutside,
  open: openProp,
  onClose,
}: ModalProps) => {
  const [open, setOpen] = useState(openProp && onClose ? openProp : false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!openProp && !onClose) {
      const handleClick = () => {
        setOpen(true)
      }
      if (ref.current) {
        ref.current.addEventListener('click', handleClick)
      }

      return () => {
        if (ref.current) {
          ref.current.removeEventListener(
            'click',
            handleClick
          )
        }
      }
    }

    if (onClose && openProp !== open) {
      setOpen(!!openProp)
    }
  }, [ref, openProp, onClose])

  const Component = disclosure
    ? cloneElement(disclosure, {
      ref,
    })
    : undefined

  const close = () => {
    if (onClose) {
      onClose()
    } else {
      setOpen(false)
    }
  }

  const modalContentRendered = useMemo(
    () => (
      <div
        onClick={hideOnClickOutside ? close : undefined}
        className={
          open ? 'modal visible opacity-100 pointer-events-auto' : 'sr-only'
        }
      >
        {open ? (
          <dialog
            open={open}
            onClick={(event) => {
              event.stopPropagation()
            }}
            className="modal-box relative"
          >
            <Button
              onClick={close}
              size="sm"
              outline
              rounded
              className="absolute right-2 top-2"
            >
              <MarkXIcon className='h-5' />
            </Button>
            {typeof children === 'function' ? children({ close }) : children}
          </dialog>
        ) : null}
      </div>
    ),
    [open, children, close]
  )

  return (
    <>
      {Component}
      {withoutPortal
        ? modalContentRendered
        : createPortal(modalContentRendered, document.body)}
    </>
  )
}

const ModalActions = ({ children }: { children: ReactNode }) => {
  return <div className="modal-action">{children}</div>
}

Modal.Actions = ModalActions

export default Modal
