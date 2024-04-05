import clsx from 'clsx'
import { ButtonHTMLAttributes, LinkHTMLAttributes, ReactNode } from 'react'

const dropdownContentClasses =
  'dropdown-content menu p-2 shadow bg-base-100 rounded-box z-10'

export type DropdownProps = {
  children: ReactNode
}
type DropdownContentProps =  {
  children: ReactNode
  className?: string
}
type DropdownLinkItemProps = LinkHTMLAttributes<HTMLAnchorElement>
type DropdownButtonItemProps = ButtonHTMLAttributes<HTMLButtonElement>

const Dropdown = ({ children }: DropdownProps) => (
  <div className="dropdown">{children}</div>
)

const DropdownContent = ({ children, className }: DropdownContentProps) => {
  return (
    <ul tabIndex={0} className={clsx(dropdownContentClasses, className)}>
      {children}
    </ul>
  )
}

const DropdownLink = (props: DropdownLinkItemProps) => (
  <li>
    <a {...props}>{props.children}</a>
  </li>
)

const DropdownButton = (props: DropdownButtonItemProps) => (
  <li>
    <button type="button" {...props}>
      {props.children}
    </button>
  </li>
)

DropdownContent.displayName = 'Dropdown.Content'
DropdownButton.displayName = 'Dropdown.Button'
DropdownContent.displayName = 'Dropdown.Content'
DropdownLink.displayName = 'Dropdown.Link'

Dropdown.Content = DropdownContent
Dropdown.Link = DropdownLink
Dropdown.Button = DropdownButton

export default Dropdown
