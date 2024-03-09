import { Icon } from '@coco-ui/core'
import { IconName } from '@coco-ui/core/dist/components/Icon'
import { Link, useRouteMatch } from 'react-router-dom'

type MenuItemProps = {
  text?: string
  icon?: IconName
  path: string
  exact?: boolean
}
const MenuItem = ({ text, icon, path, exact }: MenuItemProps) => {
  const match = useRouteMatch({
    path,
    exact,
  })

  return (
    <li>
      <Link to={path} className={match ? 'active' : ''}>
        {icon ? <Icon name={icon} /> : null}
        <span className="ml-4">{text}</span>
      </Link>
    </li>
  )
}

export default MenuItem
