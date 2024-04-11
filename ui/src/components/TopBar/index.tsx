import clsx from 'clsx'
import { InputHTMLAttributes, ReactNode } from 'react'

export type TopBarProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string
  children: ReactNode
}

const TopBar = ({ children, className, ...props }: TopBarProps) => {
  const finalClassName = clsx('navbar', className)
  return (
    <div className={finalClassName} {...props}>
      {children}
    </div>
  )
}

export default TopBar
