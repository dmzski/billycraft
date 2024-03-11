import { Link, useRouteMatch } from 'react-router-dom'

type MenuItemProps = {
  text?: string
  path: string
  exact?: boolean
}
const MenuItem = ({ text, path, exact }: MenuItemProps) => {
  const match = useRouteMatch({
    path,
    exact,
  })

  return (
    <li>
      <Link to={path} className={match ? 'active' : ''}>
        <span className="ml-4">{text}</span>
      </Link>
    </li>
  )
}

export default MenuItem
