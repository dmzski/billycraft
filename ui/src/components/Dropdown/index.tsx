import { VariantProps, cva } from 'class-variance-authority'
import { Button } from 'components/Button'
import { Link } from 'components/Link'
import useClickOutsideHandler from 'hooks/useClickOutsideHandler'
import { tw } from 'lib/utils'
import { ComponentProps, ReactNode, cloneElement, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const dropdownContentClasses = `z-50 w-auto absolute top-full max-w-screen min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md
data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0
data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`

const dropdownContentVariants = cva(dropdownContentClasses, {
  variants: {
    align: {
      start: 'left-0',
      end: 'right-0',
    },
  },
  defaultVariants: {
    align: 'start',
  },
})

export type DropdownProps = {
  children: ((props: { close: () => void }) => JSX.Element) | ReactNode
  disclosure: JSX.Element
  onClose?: () => void
  open?: boolean
}
type DropdownContentProps = {
  children: ReactNode
  className?: string
} & VariantProps<typeof dropdownContentVariants>
type DropdownLinkItemProps = ComponentProps<typeof Link>
type DropdownButtonItemProps = ComponentProps<typeof Button>

export const Dropdown = ({ open: openProp, children, disclosure, onClose }: DropdownProps) => {
  const [open, setOpen] = useState(openProp && onClose ? openProp : false)
  const disclosureRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const close = () => {
    if (onClose) {
      onClose()
    } else {
      setOpen(false)
    }
  }
  const handleClickOutside = (event: Event) => {
    event.stopPropagation()
    close()
  }

  useClickOutsideHandler(containerRef, handleClickOutside)

  useEffect(() => {
    if (!openProp && !onClose) {
      const handleClick = () => {
        setOpen(true)
      }
      if (disclosureRef.current) {
        disclosureRef.current.addEventListener('click', handleClick)
      }

      return () => {
        if (disclosureRef.current) {
          disclosureRef.current.removeEventListener('click', handleClick)
        }
      }
    }

    if (onClose && openProp !== open) {
      setOpen(!!openProp)
    }
  }, [disclosureRef, openProp, onClose])

  const Component = cloneElement(disclosure, {
    ref: disclosureRef,
  })

  const disclosureSize = disclosureRef.current?.clientWidth
  const disclosureRect = disclosureRef.current?.getBoundingClientRect()

  return (
    <>
      {Component}
      {createPortal(
        <div
          ref={containerRef}
          aria-expanded={open ? 'true' : 'false'}
          className="absolute aria-[expanded=false]:sr-only"
          style={{
            width: disclosureSize,
            left: disclosureRect?.left ?? -9999,
            top: disclosureRect?.bottom ?? -9999,
          }}
        >
          {typeof children === 'function' ? children({ close }) : children}
        </div>,
        document.body,
      )}
    </>
  )
}

const DropdownContent = ({ children, className, align }: DropdownContentProps) => {
  return (
    <ul tabIndex={0} className={tw(dropdownContentVariants({ align }), className)}>
      {children}
    </ul>
  )
}

const DropdownLink = ({ className, ...props }: DropdownLinkItemProps) => (
  <li className="grid">
    <Link variant="button" className={tw('justify-start', className)} {...props}>
      {props.children}
    </Link>
  </li>
)

const DropdownButton = ({ className, ...props }: DropdownButtonItemProps) => (
  <li className="grid">
    <Button variant="ghost" type="button" className={tw('justify-start', className)} {...props}>
      {props.children}
    </Button>
  </li>
)

DropdownContent.displayName = 'Dropdown.Content'
DropdownButton.displayName = 'Dropdown.Button'
DropdownContent.displayName = 'Dropdown.Content'
DropdownLink.displayName = 'Dropdown.Link'

Dropdown.Content = DropdownContent
Dropdown.Link = DropdownLink
Dropdown.Button = DropdownButton
