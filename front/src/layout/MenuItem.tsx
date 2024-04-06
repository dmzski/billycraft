import { Route } from '@/routes'
import clsx from 'clsx'
import { Link, useRouteMatch } from 'react-router-dom'

type MenuItemProps = {
  text?: string
  path: string
  exact?: boolean
  icon?: Route['icon']
}
const MenuItem = ({ text, path, exact, icon: IconComponent }: MenuItemProps) => {
  const match = useRouteMatch({
    path,
    exact,
  })

  return (
    <li>
      <Link
        to={path}
        className={clsx(
        "focus:text-primary focus:bg-primary-content",
        match ? 'bg-primary-content text-primary' : '',
        IconComponent ? 'flex items-center gap-3' : ''
        )}
      >
        {IconComponent ? <IconComponent className="w-4" /> : null}
        {text}
      </Link>
    </li>
  )
}

export default MenuItem
